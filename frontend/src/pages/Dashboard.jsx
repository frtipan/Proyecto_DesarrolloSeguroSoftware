import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/images/gallery"
      );

      setImages(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="container">
      <h1>Galería pública</h1>

      {images.length === 0 ? (
        <p>No hay imágenes aprobadas</p>
      ) : (
        <div className="gallery">
          {images.map((img) => (
            <div className="card" key={img.id}>
              <img
                src={`http://localhost:3000/uploads/${img.filename}`}
                alt={img.album_title}
              />

<div className="info">
  <h3>Álbum: {img.album_title}</h3>
  <p>Descripción: {img.description}</p>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}