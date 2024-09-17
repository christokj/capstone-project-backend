import Stripe from 'stripe';
import dotenv from 'dotenv';
import { sendOTP } from '../utils/otpService.js';
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

const clientDomain = process.env.CLIENT_DOMAIN;
const stripeApiKey = process.env.STRIPE_PRIVATE_API_KEY;

// Validate environment variables
if (!clientDomain) {
  console.error('CLIENT_DOMAIN is not set in the environment variables.');
  process.exit(1);
}

if (!stripeApiKey) {
  console.error('STRIPE_PRIVATE_API_KEY is not set in the environment variables.');
  process.exit(1);
}

// Initialize Stripe with API version
const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2024-06-20', 
});

export const paymentControl = async (req, res) => {
  try {

    const { products } = req.body;
    if (!products || products.length === 0) {
      console.warn('No products received in the request');
      return res.status(400).json({ success: false, message: "Products required" });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product?.productDetails?.title || 'Unnamed Product',
          images: product?.productDetails?.image && product.productDetails.image.length > 0
            ? [product.productDetails.image[0]]
            : [],
        },
        unit_amount: Math.round(83 * (product?.productDetails?.price || 0) * 100),
      },
      quantity: product?.productDetails?.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${clientDomain}/user/payment/success?session_id={CHECKOUT_SESSION_ID}&product=${encodeURIComponent(products[0]?.productDetails?.title || '')}&price=${products[0]?.productDetails?.price || 0}`,
      cancel_url: `${clientDomain}/user/payment/cancel`,
    });

    return res.status(200).json({ success: true, sessionId: session.id });

  } catch (error) {
    console.error('Stripe session creation error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      console.error('Stripe Authentication Error. Please check your API key.');
      return res.status(500).json({ 
        success: false, 
        message: 'Error authenticating with Stripe. Please contact support.',
        error: 'Stripe Authentication Error'
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Error creating checkout session', 
      error: error.message 
    });
  }
};

export const sessionStatus = async (req, res) => {

  const sessionId = req.query.session_id;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  res.send({
    status: session?.status,
    customer_email: session?.customer_details?.email,
    session
  });

}

export const emailHandler = async (req, res) => {

  const { token } = req.cookies;

  const {sessionId, productName, productPrice} = req.body

  if (!sessionId || !productName || !productPrice) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

    if (!token) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    // Verify token and get user ID
    let decoded;
    try {
        decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const email = decoded.email;

     // Email subject and message
  const subject = 'Payment Confirmation: Thank you for your purchase!';
  const emailHtml = `
    <h1>Thank you for your purchase!</h1>
    <p>We have received your payment for the following product:</p>
    <ul>
      <li><strong>Product:</strong> ${productName}</li>
      <li><strong>Price:</strong> ₹${productPrice}</li>
      <li><strong>Payment Session ID:</strong> ${sessionId}</li>
    </ul>
    <p>We hope you enjoy your purchase! If you have any questions, feel free to contact our support.</p>
  `;

  const response = await sendOTP({
    from: process.env.EMAIL_ADMIN,
    to: email,
    subject,
    emailHtml
});

}


// export const webhook = (req, res) => {
//   let event;
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (process.env.STRIPE_WEBHOOK_SECRET) {
//     // Get the signature sent by Stripe
//     const signature = req.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return res.sendStatus(400);
//     }
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       console.log(`New payment started`);
//       console.log(event.data)
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'invoice paid':
//       console.log('Invoice paid')
//       console.log(event.data)
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     case 'invoice.payment_failed':
//       console.log('Invoice payment failed')
//       console.log(event.data)
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 res to acknowledge receipt of the event
//   res.send();
// }
