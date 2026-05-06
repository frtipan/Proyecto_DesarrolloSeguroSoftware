import { useEffect, useState } from "react";
import axios from "axios";

export default function Quarantine() {
  const [images, setImages] = useState([]);

  const load = async () => {
    const res = await axios.get("http://localhost:3000/images/quarantine");
    setImages(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await axios.put(`http://localhost:3000/images/approve/${id}`);
    load();
  };

  const reject = async (id) => {
    await axios.delete(`http://localhost:3000/images/reject/${id}`);
    load();
  };

  return (
    <div className="container">
      <h1>Cuarentena</h1>

      <div className="grid">
        {images.map((img) => (
          <div key={img.id}>
            <img
              src={`http://localhost:3000/uploads/${img.filename}`}
              alt=""
            />

            <p>{img.reason}</p>

            <button onClick={() => approve(img.id)}>Aprobar</button>
            <button onClick={() => reject(img.id)}>Rechazar</button>
          </div>
        ))}
      </div>
    </div>
  );
}