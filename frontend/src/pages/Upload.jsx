import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const enviarSolicitud = async () => {
    if (!title || !description) {
      return alert("Completa título y descripción");
    }

    if (!file) {
      return alert("Selecciona una imagen");
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/albums/create", {
        title,
        description,
        privacy: "publico",
        userId
      });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);

      const res = await axios.post(
        "http://localhost:3000/images/upload",
        formData
      );

      setLoading(false);

      if (res.data.status === "SOSPECHOSO") {
        alert("Imagen sospechosa enviada a cuarentena");
      } else {
        alert("Imagen subida sin novedades");
      }

      setTitle("");
      setDescription("");
      setFile(null);

      document.getElementById("archivo").value = "";

    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.error || "Error procesando solicitud");
    }
  };

  return (
    <div className="container">
      <h1>SecureFrame</h1>

      <div className="card">
        <h2>Solicitar creación de álbum</h2>

        <input
          placeholder="Título del álbum"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px"
          }}
        />

        <input
          id="archivo"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginTop: "10px" }}
        />

        <button
          onClick={enviarSolicitud}
          disabled={loading}
          style={{ marginTop: "12px" }}
        >
          {loading
            ? "Analizando imagen..."
            : "Enviar solicitud y analizar imagen"}
        </button>
      </div>
    </div>
  );
}