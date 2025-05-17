"use client";
import React from "react";

function MainComponent() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const { data: user } = useUser();

  const productId = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch("/api/products/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });

      if (!response.ok) {
        throw new Error("Errore nel caricamento del prodotto");
      }

      const data = await response.json();
      setProduct(data.product);
    } catch (err) {
      console.error(err);
      setError(
        "Non è stato possibile caricare il prodotto. Riprova più tardi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = `/account/signin?callbackUrl=/product/${productId}`;
      return;
    }
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          sellerId: product.seller_id,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nell'invio del messaggio");
      }

      setMessage("");
      setShowContactForm(false);
      alert("Messaggio inviato con successo!");
    } catch (err) {
      console.error(err);
      alert("Errore nell'invio del messaggio. Riprova più tardi.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Caricamento...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">
          {error || "Prodotto non trovato"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex space-x-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md ${
                    selectedImage === index ? "ring-2 ring-[#357AFF]" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - Immagine ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <p className="mt-2 text-xl font-semibold text-[#357AFF]">
                €{product.price}
              </p>
            </div>

            <div className="space-y-4 border-y border-gray-200 py-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Marca</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condizioni</span>
                <span className="font-medium">{product.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taglia</span>
                <span className="font-medium">{product.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria</span>
                <span className="font-medium">{product.category}</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Descrizione
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-gray-600">
                {product.description}
              </p>
            </div>

            <button
              onClick={() => setShowContactForm(true)}
              className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2"
            >
              Contatta il venditore
            </button>

            {showContactForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Invia un messaggio al venditore
                  </h3>
                  <form onSubmit={handleContact} className="space-y-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Scrivi il tuo messaggio..."
                      className="h-32 w-full rounded-lg border border-gray-300 p-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                      required
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="rounded-lg px-4 py-2 text-gray-600 hover:text-gray-900"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                      >
                        Invia
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;