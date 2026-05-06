import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [images, setImages] = useState([]);

  const load = async () => {
    const res = await axios.get("http://localhost:3000/images/quarantine");
    setImages(res.data);
  };

  const approve = async (id) => {
    await axios.put(`http://localhost:3000/images/approve/${id}`);
    load();
  };

  const reject = async (id) => {
    await axios.delete(`http://localhost:3000/images/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h1>Supervisor</h1>

      {images.map((img) => (
        <div key={img.id}>
          <img src={`http://localhost:3000/uploads/${img.filename}`} width="200" />

          <p>{img.analysis}</p>

          <button onClick={() => approve(img.id)}>Aprobar</button>
          <button onClick={() => reject(img.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}