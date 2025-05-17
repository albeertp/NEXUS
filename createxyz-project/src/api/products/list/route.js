async function handler({ search, category }) {
  let queryText = `
    SELECT * FROM products 
    WHERE status = 'available'
  `;

  const values = [];
  let paramCount = 1;

  if (search) {
    queryText += ` AND (
      LOWER(title) LIKE LOWER($${paramCount}) 
      OR LOWER(description) LIKE LOWER($${paramCount}) 
      OR LOWER(brand) LIKE LOWER($${paramCount})
    )`;
    values.push(`%${search}%`);
    paramCount++;
  }

  if (category) {
    queryText += ` AND category = $${paramCount}`;
    values.push(category);
    paramCount++;
  }

  queryText += ` ORDER BY created_at DESC`;

  try {
    const products = await sql(queryText, values);
    return { products };
  } catch (error) {
    return { error: "Error fetching products" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}