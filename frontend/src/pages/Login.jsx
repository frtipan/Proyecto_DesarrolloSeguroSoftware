import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      return alert("Completa usuario y contraseña");
    }

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("userId", res.data.id);

      window.location.replace("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Error al iniciar sesión");
      console.log(err.response?.data);
    }
  };

  const entrarComoVisitante = () => {
    localStorage.clear();
    window.location.replace("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>SecureFrame</h1>

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

        <button onClick={login}>
          Entrar
        </button>

        <button
          onClick={entrarComoVisitante}
          style={{ marginTop: "10px" }}
        >
          Entrar sin registrarse
        </button>

        <p onClick={() => window.location.replace("/register")}>
          Crear cuenta
        </p>
      </div>
    </div>
  );
}