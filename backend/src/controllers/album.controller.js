const db = require("../config/db");

exports.create = async (req, res) => {
  try {
    const { title, description, privacy, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const cleanDescription = description
      .replace(/</g, "")
      .replace(/>/g, "");

    await db.query(
      `INSERT INTO albums(user_id,title,description,privacy,status)
       VALUES($1,$2,$3,$4,'PENDIENTE')`,
      [userId, title, cleanDescription, privacy]
    );

    res.json({ message: "Álbum enviado a revisión" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al crear álbum" });
  }
};

exports.mine = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await db.query(
      "SELECT * FROM albums WHERE user_id=$1 ORDER BY id DESC",
      [userId]
    );

    res.json(data.rows);

  } catch (err) {
    res.status(500).json({ error: "Error cargando álbumes" });
  }
};

exports.pending = async (req, res) => {
  const data = await db.query(
    "SELECT * FROM albums WHERE status='PENDIENTE' ORDER BY id DESC"
  );

  res.json(data.rows);
};

exports.approve = async (req, res) => {
  await db.query(
    "UPDATE albums SET status='APROBADO' WHERE id=$1",
    [req.params.id]
  );

  res.json({ message: "Álbum aprobado" });
};

exports.reject = async (req, res) => {
  await db.query(
    "DELETE FROM albums WHERE id=$1",
    [req.params.id]
  );

  res.json({ message: "Álbum rechazado" });
};