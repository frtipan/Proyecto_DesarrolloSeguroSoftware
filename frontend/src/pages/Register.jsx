import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password
    ) {
      return alert("Completa todos los campos");
    }

    try {
      await axios.post(
        "http://localhost:3000/auth/register",
        {
          firstname,
          lastname,
          username,
          email,
          password,
        }
      );

      alert("Usuario registrado");

      window.location.href = "/";

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.error ||
        "Error registrando"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Crear cuenta</h1>

        <input
          placeholder="Nombres"
          value={firstname}
          onChange={(e) =>
            setFirstname(e.target.value)
          }
        />

        <input
          placeholder="Apellidos"
          value={lastname}
          onChange={(e) =>
            setLastname(e.target.value)
          }
        />

        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={register}>
          Registrarse
        </button>

        <p
          onClick={() =>
            (window.location.href = "/")
          }
        >
          Ya tengo cuenta
        </p>
      </div>
    </div>
  );
}