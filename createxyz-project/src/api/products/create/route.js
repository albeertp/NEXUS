async function handler({
  title,
  description,
  price,
  condition,
  category,
  size,
  brand,
  images,
}) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Autenticazione richiesta" };
  }

  if (
    !title ||
    !description ||
    !price ||
    !condition ||
    !category ||
    !size ||
    !brand ||
    !images?.length
  ) {
    return { error: "Tutti i campi sono obbligatori" };
  }

  if (images.length === 0) {
    return { error: "Carica almeno un'immagine" };
  }

  if (price <= 0) {
    return { error: "Il prezzo deve essere maggiore di zero" };
  }

  const validCategories = [
    "abbigliamento",
    "scarpe",
    "accessori",
    "borse",
    "gioielli",
  ];
  if (!validCategories.includes(category)) {
    return { error: "Categoria non valida" };
  }

  const validConditions = ["nuovo", "come_nuovo", "buono", "usato"];
  if (!validConditions.includes(condition)) {
    return { error: "Condizione non valida" };
  }

  try {
    const product = await sql`
      INSERT INTO products (
        title, description, price, condition, category, 
        size, brand, images, seller_id, status
      ) 
      VALUES (
        ${title}, ${description}, ${price}, ${condition}, ${category}, 
        ${size}, ${brand}, ${images}, ${session.user.id}, 'available'
      )
      RETURNING id, title, price, images
    `;

    return { product: product[0] };
  } catch (error) {
    return { error: "Errore durante la creazione del prodotto" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}