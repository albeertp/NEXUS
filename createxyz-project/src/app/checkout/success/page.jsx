"use client";
import React from "react";

function MainComponent() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentIntentId = searchParams.get("payment_intent");

    if (paymentIntentId) {
      fetchOrderDetails(paymentIntentId);
    } else {
      setLoading(false);
      setError("Dettagli ordine non trovati");
    }
  }, []);

  const fetchOrderDetails = async (paymentIntentId) => {
    try {
      const response = await fetch("/api/products/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paymentIntentId }),
      });

      if (!response.ok) {
        throw new Error("Errore nel recupero dei dettagli dell'ordine");
      }

      const data = await response.json();
      setOrderDetails(data.product);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare i dettagli dell'ordine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <style jsx global>{`
        @keyframes successCheck {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .success-check {
          animation: successCheck 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .fade-slide-up {
          opacity: 0;
          animation: fadeSlideUp 0.8s ease-out forwards;
        }

        .gradient-shift {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti 3s ease-out forwards;
        }
      `}</style>

      <div className="max-w-xl w-full">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden fade-slide-up">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent shadow-xl"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center fade-slide-up">
              <div className="w-20 h-20 mx-auto mb-6 text-red-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Errore</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Torna alla home
              </a>
            </div>
          ) : (
            <div className="p-8">
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-8 text-emerald-500 success-check">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {[...Array.from({ length: 20 })].map((_, i) => (
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              <div
                className="text-center space-y-4"
                style={{ animationDelay: "0.5s" }}
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-shift">
                  Pagamento completato!
                </h1>
                <p
                  className="text-gray-600 text-lg fade-slide-up"
                  style={{ animationDelay: "0.7s" }}
                >
                  Grazie per il tuo acquisto. Ti invieremo una email con i
                  dettagli dell'ordine.
                </p>
              </div>

              {orderDetails && (
                <div
                  className="mt-8 bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/50 transform hover:scale-[1.02] transition-all duration-300 fade-slide-up"
                  style={{ animationDelay: "0.9s" }}
                >
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
                    Riepilogo Ordine
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <img
                        src={orderDetails.images[0]}
                        alt={orderDetails.title}
                        className="w-24 h-24 object-cover rounded-xl transform group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {orderDetails.title}
                      </h3>
                      <p className="text-gray-500">{orderDetails.brand}</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">
                        €{orderDetails.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className="mt-8 text-center fade-slide-up"
                style={{ animationDelay: "1.1s" }}
              >
                <a
                  href="/"
                  className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Torna alla home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;