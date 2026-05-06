const db = require("../config/db");

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No se recibió imagen",
      });
    }

    const filename = req.file.filename;

    await db.query(
      `
      INSERT INTO images (
        filename,
        status,
        analysis,
        reason
      )
      VALUES ($1, 'APPROVED', 'CLEAN', 'Sin anomalías')
      `,
      [filename]
    );

    res.json({
      message: "Imagen subida correctamente",
    });
  } catch (err) {
    console.log("UPLOAD ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.gallery = async (req, res) => {
  try {
    const data = await db.query(`
      SELECT
        id,
        filename,
        status,
        analysis,
        reason
      FROM images
      WHERE status = 'APPROVED'
      ORDER BY id DESC
    `);

    res.json(data.rows);
  } catch (err) {
    console.log("GALLERY ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.quarantine = async (req, res) => {
  try {
    const data = await db.query(`
      SELECT *
      FROM images
      WHERE status = 'QUARANTINE'
      ORDER BY id DESC
    `);

    res.json(data.rows);
  } catch (err) {
    console.log("QUARANTINE ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE images
      SET status = 'APPROVED'
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Imagen aprobada",
    });
  } catch (err) {
    console.log("APPROVE ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.reject = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM images
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Imagen eliminada",
    });
  } catch (err) {
    console.log("REJECT ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};