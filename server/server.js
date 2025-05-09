// server.js (same as your original, just moved to src folder)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const path = require("path");

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

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
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));