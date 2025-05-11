require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: plan },
          unit_amount: plan === "Basic" ? 1000 : plan === "Pro" ? 2000 : 3000,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});

// AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Save user plan to S3
app.post("/store-plan", async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });

    const userEmail = session.customer_details.email;
    const planName = session.display_items?.[0]?.custom?.name || "Unknown";

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `subscriptions/${userEmail}.json`,
      Body: JSON.stringify({
        email: userEmail,
        plan: planName,
        timestamp: new Date().toISOString(),
      }),
      ContentType: "application/json",
    };

    await s3.send(new PutObjectCommand(s3Params));

    res.status(200).json({ message: "Plan stored successfully" });
  } catch (error) {
    console.error("Error storing to S3:", error);
    res.status(500).json({ error: "Failed to store plan" });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
