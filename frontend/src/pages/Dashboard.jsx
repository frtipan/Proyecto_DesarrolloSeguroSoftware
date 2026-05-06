import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/images/gallery"
      );

      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="container">
      <h1>Galería SecureFrame</h1>

      <div className="gallery">
        {images.length === 0 && (
          <p>No hay imágenes aprobadas</p>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}