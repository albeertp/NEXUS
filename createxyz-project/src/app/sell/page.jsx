"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [upload, { loading: uploading }] = useUpload();
  const { data: user } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "nuovo",
    category: "abbigliamento",
    size: "",
    brand: "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url, error } = await upload({ file });
      if (error) throw new Error(error);
      setImages([...images, url]);
    } catch (err) {
      setError("Errore nel caricamento dell'immagine. Riprova.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Devi effettuare l'accesso per pubblicare un prodotto");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setError("Carica almeno un'immagine del prodotto");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nella pubblicazione del prodotto");
      }

      window.location.href = "/";
    } catch (err) {
      setError(
        "Non è stato possibile pubblicare il prodotto. Riprova più tardi."
      );
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Accedi per vendere
          </h2>
          <a
            href="/account/signin"
            className="text-[#357AFF] hover:text-[#2E69DE]"
          >
            Vai al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Vendi un articolo
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg bg-white p-6 shadow"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Immagini
            </label>
            <div className="flex flex-wrap gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative h-24 w-24">
                  <img
                    src={url}
                    alt={`Prodotto ${index + 1}`}
                    className="h-full w-full rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded border-2 border-dashed border-gray-300 hover:border-[#357AFF]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <i className="fas fa-plus text-gray-400"></i>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Titolo
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descrizione
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Prezzo (€)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Condizione
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
              >
                <option value="nuovo">Nuovo</option>
                <option value="come_nuovo">Come nuovo</option>
                <option value="buono">Buono</option>
                <option value="usato">Usato</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
              >
                <option value="abbigliamento">Abbigliamento</option>
                <option value="scarpe">Scarpe</option>
                <option value="accessori">Accessori</option>
                <option value="borse">Borse</option>
                <option value="gioielli">Gioielli</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Taglia
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Pubblicazione in corso..." : "Pubblica annuncio"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MainComponent;