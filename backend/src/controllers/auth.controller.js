const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exist = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (exist.rows.length > 0) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users(username, password, role) VALUES($1, $2, $3)",
      [username, hash, "USER"]
    );

    res.json({ message: "Registrado" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error servidor" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no existe" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Password incorrecto" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      "secret"
    );

    res.json({
      token,
      role: user.role,
      username: user.username,
      id: user.id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error login" });
  }
};