import { useEffect, useState } from "react";
import axios from "axios";

export default function Supervisor() {

  const [images, setImages] = useState([]);

  const load = async () => {
    try {

      const res = await axios.get(
        "http://localhost:3000/images/quarantine"
      );

      setImages(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await axios.put(
      `http://localhost:3000/images/approve/${id}`
    );

    alert("Imagen aprobada");

    load();
  };

  const reject = async (id) => {
    await axios.delete(
      `http://localhost:3000/images/reject/${id}`
    );

    alert("Imagen eliminada");

    load();
  };

  return (
    <div className="app">

      <nav className="navbar">
        <h1>Panel Supervisor</h1>

        <div className="menu">
          <a href="/dashboard">Galería</a>
        </div>
      </nav>

      <div className="container">

        <h2>Imágenes sospechosas</h2>

        <div className="gallery">

          {images.length === 0 && (
            <p>No existen imágenes en cuarentena</p>
          )}

          {images.map((img) => (
            <div className="card" key={img.id}>

              <img
                src={`http://localhost:3000/uploads/${img.filename}`}
                alt=""
              />

              <div className="info">

                <p>
                  <strong>Estado:</strong> {img.status}
                </p>

                <p>
                  <strong>Análisis:</strong> {img.analysis}
                </p>

                <p>
                  <strong>Motivo:</strong> {img.reason}
                </p>

                <div className="actions">

                  <button
                    className="approve"
                    onClick={() => approve(img.id)}
                  >
                    Aprobar
                  </button>

                  <button
                    className="reject"
                    onClick={() => reject(img.id)}
                  >
                    Rechazar
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}