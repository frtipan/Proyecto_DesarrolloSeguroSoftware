import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const upload = async () => {
    if (!title || !description || !file) {
      return alert("Completa todos los campos");
    }

    if (!userId) {
      return alert("Debes iniciar sesión");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("userId", userId);

      const res = await axios.post(
        "http://localhost:3000/images/upload",
        formData
      );

      alert(res.data.message);

      setTitle("");
      setDescription("");
      setFile(null);

      const input = document.getElementById("fileInput");
      if (input) input.value = "";

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.error ||
        "Error subiendo imagen"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="upload-wrapper">
        <h1 className="page-title">Galeria Segura</h1>

        <div className="upload-card">
          <h2>Subir Album</h2>

          <input
            className="input"
            placeholder="Nombre del álbum"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="input textarea"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            id="fileInput"
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            className="btn-primary"
            onClick={upload}
            disabled={loading}
          >
            {loading ? "Analizando..." : "Subir"}
          </button>
        </div>
      </div>
    </div>
  );
}