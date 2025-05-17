async function handler({ productId, sellerId, message }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Autenticazione richiesta" };
  }

  if (!productId || !sellerId || !message) {
    return {
      error: "Dati mancanti: productId, sellerId e message sono richiesti",
    };
  }

  try {
    const product = await sql`
      SELECT id FROM products 
      WHERE id = ${productId} 
      AND seller_id = ${sellerId}
      AND status = 'available'
    `;

    if (product.length === 0) {
      return { error: "Prodotto non trovato o non disponibile" };
    }

    const result = await sql`
      INSERT INTO messages (
        sender_id,
        receiver_id,
        product_id,
        content,
        created_at
      )
      VALUES (
        ${session.user.id},
        ${sellerId},
        ${productId},
        ${message},
        NOW()
      )
      RETURNING id, created_at
    `;

    return {
      success: true,
      message: {
        id: result[0].id,
        createdAt: result[0].created_at,
      },
    };
  } catch (error) {
    return { error: "Errore durante l'invio del messaggio" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}