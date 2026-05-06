import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!username || !password) {
      return alert("Completa todos los campos");
    }

    try {
      await axios.post("http://localhost:3000/auth/register", {
        username,
        password,
      });

      alert("Usuario registrado correctamente");
      window.location.replace("/");
    } catch (err) {
      alert(err.response?.data?.error || "Error al registrar");
      console.log(err.response?.data);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Crear cuenta</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register}>
          Registrarse
        </button>

        <p onClick={() => window.location.replace("/")}>
          Ya tengo cuenta
        </p>
      </div>
    </div>
  );
}