async function handler({ productId, paymentMethodId }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Autenticazione richiesta" };
  }

  if (!productId) {
    return { error: "ID prodotto richiesto" };
  }

  try {
    const products = await sql`
      SELECT p.*, up.username as seller_username 
      FROM products p
      JOIN user_profiles up ON p.seller_id = up.user_id
      WHERE p.id = ${productId} 
      AND p.status = 'available'
    `;

    if (products.length === 0) {
      return { error: "Prodotto non trovato o non disponibile" };
    }

    const product = products[0];

    if (product.seller_id === session.user.id) {
      return { error: "Non puoi acquistare il tuo stesso prodotto" };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100),
      currency: "eur",
      payment_method_types: ["card"],
      metadata: {
        productId: product.id,
        buyerId: session.user.id,
        sellerId: product.seller_id,
      },
      payment_method: paymentMethodId,
      description: `Acquisto ${product.title} da ${product.seller_username}`,
      statement_descriptor: "COMUNITAS MARKET",
    });

    await sql`
      UPDATE products 
      SET status = 'pending' 
      WHERE id = ${productId}
    `;

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    if (error.type === "StripeError") {
      return { error: error.message };
    }
    return { error: "Errore durante la creazione del pagamento" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}