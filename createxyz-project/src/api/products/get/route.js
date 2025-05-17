async function handler({ id }) {
  if (!id) {
    return { error: "ID prodotto richiesto" };
  }

  try {
    const results = await sql`
      SELECT 
        p.*,
        u.username,
        u.avatar_url,
        u.rating,
        u.reviews_count
      FROM products p
      LEFT JOIN user_profiles u ON p.seller_id = u.user_id
      WHERE p.id = ${id}
    `;

    if (results.length === 0) {
      return { error: "Prodotto non trovato" };
    }

    const product = results[0];

    return { product };
  } catch (error) {
    return { error: "Errore durante il recupero del prodotto" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}