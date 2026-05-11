import { useEffect, useState } from "react";
import axios from "axios";

export default function Supervisor() {
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/images/quarantine"
      );

      setImages(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const approve = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/images/approve/${id}`
      );

      loadImages();
    } catch (err) {
      console.log(err);
    }
  };

  const reject = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/images/reject/${id}`
      );

      loadImages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>Imágenes en cuarentena</h1>

      {images.length === 0 ? (
        <p>No hay imágenes pendientes</p>
      ) : (
        <div className="supervisor-grid">
          {images.map((img) => (
            <div className="card" key={img.id}>
              <img
                src={`http://localhost:3000/quarantine/${img.filename}`}
                alt="cuarentena"
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
              </div>

              <div className="actions">
                <button onClick={() => approve(img.id)}>
                  Aprobar
                </button>

                <button onClick={() => reject(img.id)}>
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}