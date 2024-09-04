import Stripe from 'stripe';

const clientDomain = process.env.CLIENT_DOMAIN_STRIPE;
const stripe = new Stripe(process.env.STRIPE_PRIVATE_API_KEY);

export const paymentControl = async (req, res, next) => {

    const { products } = req.body;

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

        res.json({ success: true, message: "Payment Successfull", sessionId: session.id });

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
