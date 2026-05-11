const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

exports.register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
    } = req.body;

    /*
      VALIDAR CAMPOS
    */
    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        error: "Completa todos los campos",
      });
    }

    /*
      VALIDAR EMAIL
    */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Correo inválido",
      });
    }

    /*
      VALIDAR USUARIO
    */
    if (username.length < 4) {
      return res.status(400).json({
        error:
          "El usuario debe tener mínimo 4 caracteres",
      });
    }

    /*
      PASSWORD FUERTE
    */
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        error:
          "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo",
      });
    }

    /*
      VERIFICAR USUARIO
    */
    const existUser = await db.query(
      `
      SELECT *
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (existUser.rows.length > 0) {
      return res.status(400).json({
        error: "Usuario ya existe",
      });
    }

    /*
      VERIFICAR EMAIL
    */
    const existEmail = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (existEmail.rows.length > 0) {
      return res.status(400).json({
        error: "Correo ya registrado",
      });
    }

    /*
      HASH
    */
    const hash = await bcrypt.hash(
      password,
      10
    );

    /*
      INSERT
    */
    await db.query(
      `
      INSERT INTO users(
        firstname,
        lastname,
        username,
        email,
        password,
        role
      )
      VALUES($1,$2,$3,$4,$5,$6)
      `,
      [
        firstname,
        lastname,
        username,
        email,
        hash,
        "USER",
      ]
    );

    res.json({
      message:
        "Usuario registrado correctamente",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Error servidor",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    /*
      VALIDAR CAMPOS
    */
    if (!username || !password) {
      return res.status(400).json({
        error: "Completa todos los campos",
      });
    }

    /*
      BUSCAR USUARIO
    */
    const result = await db.query(
      `
      SELECT *
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    /*
      EVITAR ENUMERACIÓN
    */
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Credenciales inválidas",
      });
    }

    const user = result.rows[0];

    /*
      VALIDAR PASSWORD
    */
    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(400).json({
        error: "Credenciales inválidas",
      });
    }

    /*
      TOKEN JWT
    */
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      "secret",
      {
        expiresIn: "2h",
      }
    );

    res.json({
      token,
      role: user.role,
      username: user.username,
      id: user.id,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Error login",
    });
  }
};