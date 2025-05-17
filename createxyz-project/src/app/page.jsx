"use client";
import React from "react";

function MainComponent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: user } = useUser();

  const categories = [
    "all",
    "abbigliamento",
    "scarpe",
    "accessori",
    "borse",
    "gioielli",
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: searchTerm,
          category: selectedCategory === "all" ? null : selectedCategory,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nel caricamento dei prodotti");
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
      setError("Non è stato possibile caricare i prodotti. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50/30">
      <header className="bg-white/60 backdrop-blur-2xl shadow-2xl border-b border-white/20 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="flex items-center hover:scale-105 transition-all duration-700 cursor-default">
                <img
                  src="https://ucarecdn.com/cfa38c60-9b24-49b0-ac17-a23fd4ab9f27/-/format/auto/"
                  alt="Comunitas Logo"
                  className="h-20"
                />
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <span className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 shadow-inner">
                  Italia
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/30"></div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-2xl rounded-full px-4 py-2 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/50">
                    <div className="w-10 h-10 rounded-full bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-inner">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.name || user.email}
                    </span>
                  </div>
                  <a
                    href="/account/logout"
                    className="text-gray-600 hover:text-indigo-600 transition-all duration-300 flex items-center space-x-1 bg-white/50 backdrop-blur-2xl rounded-full px-4 py-2 hover:shadow-2xl hover:scale-105"
                  >
                    <span>Esci</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </a>
                </div>
              ) : (
                <a
                  href="/account/signin"
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium bg-white/80 backdrop-blur-2xl rounded-full px-4 py-2 shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Accedi</span>
                </a>
              )}
              <a
                href="/sell"
                className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-all duration-500 shadow-2xl shadow-indigo-500/30 hover:shadow-3xl hover:scale-105 flex items-center space-x-2 border border-white/20"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Vendi un articolo</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="Cerca prodotti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-white/50 px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all pl-12 group-hover:border-indigo-500 text-gray-700 bg-white/80 backdrop-blur-2xl shadow-2xl hover:shadow-3xl text-lg"
            />
            <svg
              className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-full border border-white/50 px-6 py-4 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white/80 backdrop-blur-2xl hover:border-indigo-500 text-gray-700 cursor-pointer appearance-none pr-12 relative min-w-[200px] shadow-2xl hover:shadow-3xl text-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.5rem",
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category} className="py-2">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-500 border-t-transparent shadow-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-inner"></div>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-50 p-10 text-red-500 text-center shadow-2xl border border-red-100 backdrop-blur-2xl">
            <svg
              className="w-16 h-16 mx-auto text-red-400 mb-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-medium">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-20 h-20 mx-auto text-gray-400 mb-6 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-2xl text-gray-500 font-medium">
              Nessun prodotto trovato
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 border border-white/50 hover:border-indigo-500/20 transform hover:-translate-y-2 hover:rotate-1"
              >
                <a href={`/product/${product.id}`} className="block">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-2xl rounded-full px-5 py-2.5 text-sm font-medium text-indigo-600 shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 border border-white/50">
                      Vedi dettagli →
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-4 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 shadow-inner">
                        {product.condition}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <span className="text-sm text-gray-500 font-medium">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2 mb-4">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mb-6">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {product.brand}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        €{product.price}
                      </span>
                    </div>
                    <a
                      href={`/checkout/${product.id}`}
                      className="block w-full text-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-all duration-500 shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/40 transform hover:scale-[1.02] border border-white/20"
                    >
                      Compra Ora
                    </a>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MainComponent;