import Stripe from 'stripe';

const clientDomain = process.env.CLIENT_DOMAIN;
const stripe = new Stripe(process.env.STRIPE_PRIVATE_API_KEY);

export const paymentControl = async (req, res, next) => {

    const { products } = req.body;
  console.log("In payment control")
    if (!products || products.length === 0) {
        return res.status(400).json({ success: false, message: "Products required" });
    }

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product?.productDetails?.title,
                    images: [product?.productDetails?.image[0]],
                },
                unit_amount: Math.round(83 * product.productDetails.price * 100), 
            },
            quantity: product?.productDetails?.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${clientDomain}/user/payment/success`,
            cancel_url: `${clientDomain}/user/payment/cancel`,
        });

        return res.status(200).json({ success: true, message: "Payment Successfull", sessionId: session.id });

};

export const sessionStatus =  async (req, res) => {

    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.send({
        status: session?.status,
        customer_email: session?.customer_details?.email,
        session
    });

}


export const webhook = (req, res) => {
    let event ;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
          console.log(`New payment started`);
          console.log(event.data)
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'invoice paid':
        console.log('Invoice paid')
        console.log(event.data)
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
        case 'invoice.payment_failed':
        console.log('Invoice payment failed')
        console.log(event.data)
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 res to acknowledge receipt of the event
    res.send();
  }
   