# SUBSCRIPTION BILLING SYSTEM - POWERED BY AWS

## Services used:
1) AWS Cognito  
2) AWS S3 - Simple Storage Service  
3) AWS IAM - Identity and Access Management  
4) AWS SNS - Simple Notification Service  

---

### The first thing that needs to be done after downloading the zip file is to change the details in `.env` files present in both client and server folders

#### `.env - client`
1) `REACT_APP_STRIPE_PUBLIC_KEY= ---`  
2) `REACT_APP_API_BASE_URL=http://localhost:3001`  

Create an account on Stripe and login to access your secret key and publishable key in test mode.  
Make sure it's in test mode before making any payments  
- Test card number - `4242 4242 4242`  
- CVV - `123` (Can be any 3 digit number)  
- Expiry date - `12/30` (Can be anything)  
- Cardholder name - Anything (Can be anything)  

#### `.env - server`
1) `STRIPE_SECRET_KEY= ---`  
2) `CLIENT_URL=http://localhost:3000`  
3) `AWS_ACCESS_KEY_ID= ---`  
4) `AWS_SECRET_ACCESS_KEY= ---`  
5) `AWS_REGION=us-east-1`  
6) `S3_BUCKET_NAME= ---`  
7) `AWS_ACCOUNT_ID= ---`  
8) `SNS_TOPIC_ARN= ---`  

---

## To use the above services, you need to have an AWS account.
Since I am using free tier - 12 months from creation of your AWS account, all the mentioned services are free for limited usage. Make sure you have a clear idea before proceeding.

---

## After creating AWS account, you need to create:

### 1) Cognito
Create a Cognito user pool. I used only email cause I wanted to keep it simple. You can add any number of constraints if you are out of free tier.  
Add your client URL - `http://localhost:3000`

### 2) S3
Create an S3 bucket for standard use. Name it as per your requirement and add it in your `.env` file

### 3) SNS
Create a topic on SNS and mention it in `.env` file of your server.  
Also, I only selected email notification service cause again, I wanted to keep it simple.  
You can select any other as per your requirement.

### 4) IAM
Create an IAM user and give full access to S3 and SNS and mention the access key id in `.env` file located in your server.

---

## Software requirements:
1) React  
2) Node.js  
3) AWS account - make sure it's still in free tier so as to not incur charges  
4) IDE - I used VS Code  

## Hardware requirements:
1) A laptop or a PC  

---

## Push it to your Git

Before pushing to your git repository make sure to add a `.gitignore` file and add files that you do not want the public to have access  

```bash
git init  
git remote add origin {http link}  
git add .  
git commit -m "Some message"  
git push -u origin main  


> **Note:**  
> If you are a first time user, it might be prompted to login.  
> Enter your git username or email and password.








<!-- SUBSCRIPTION BILLING SYSTEM - POWERED BY AWS

Services used:
1) AWS Cognito
2) AWS S3 - Simple Storage Service
3) AWS IAM - Identity and Access Management
4) AWS SNS - Simple Notification Service

The first thing that needs to be done after downloading the zip file is to change the details in .env files present in both client and server folders

.env - client
1) REACT_APP_STRIPE_PUBLIC_KEY= ---
2) REACT_APP_API_BASE_URL=http://localhost:3001

Create an account on Stripe and login to access your secret key and publishable key in test mode. Make sure it's in test mode before making any payments
-- Test card number - 4242 4242 4242
-- CVV - 123 (Can be any 3 digit number)
-- Expiry date - 12/30 (Can be anything)
-- Cardholder name - Anything (Can be anything)

.env - server
1) STRIPE_SECRET_KEY= --- 
2) CLIENT_URL=http://localhost:3000
3) AWS_ACCESS_KEY_ID= ---
4) AWS_SECRET_ACCESS_KEY= ---
5) AWS_REGION=us-east-1
6) S3_BUCKET_NAME= ---
7) AWS_ACCOUNT_ID= ---
8) SNS_TOPIC_ARN= ---

To use the above services, you need to have an AWS account. Since I am using free tier - 12 months from creation of your AWS account, all the mentioned services are free for limited usage. Make sure you have a clear idea before proceeding.

After creating AWS account, you need to create
1) Cognito
---
Create a cognito user pool. I used only email cause I wanted to keep it simple. You can add any number of constraints if you are out of free tier. Add your client url - http://localhost:3000

2) S3
---
Create an S3 bucket for standard use. Name it as per your requirement and add it in your .env file
 
3) SNS
---
Create a topic on SNS and mention it in .env file of your server. Also, I only selected email notification service cause again, I wanted to keep it simple. You can select any other as per you requirement.

4) IAM 
---
Create a IAM user and give full access to S3 and SNS and mention the access key id in .env file located in your server.

-------------------------------------------------------------------------------------------------------------------

Software requirements:
1) React
2) Node.js
3) AWS account - make sure it's still in free tier so as to not incur charges
4) IDE - I used VS code

Hardware requirements:
1) A laptop or a PC

-------------------------------------------------------------------------------------------------------------------

Push it to your git

-- Before pushing to your git repository make sure to add a .gitignore file and add files that you donot want the public to have access
1) git init
2) git remote add origin {http link}
3) git add .
4) git commit -m "Some message"
5) git push -u origin main

Note:
If you are a first time user, it might be prompted to login. Enter your git user name or email and password.

-------------------------------------------------------------------------------------------------------------------

Feel free to reach out for any doubts or collaboration
email: marreddyakshayavarshini@gmail.com -->