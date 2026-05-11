const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const { fileTypeFromFile } = require("file-type");
const sharp = require("sharp");

const detectStego = require("../utils/stegoDetector");

exports.upload = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: "Debe seleccionar una imagen",
      });
    }

    if (!title || !description || !userId) {
      return res.status(400).json({
        error: "Faltan datos",
      });
    }

    const cleanDescription = description
      .replace(/</g, "")
      .replace(/>/g, "");

    const fileName = req.file.filename;

    const realType = await fileTypeFromFile(req.file.path);

    if (
      !realType ||
      !["image/jpeg", "image/png", "image/webp"].includes(realType.mime)
    ) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        error: "Archivo inválido",
      });
    }

    const uploadsDir = path.join(__dirname, "../../uploads");
    const quarantineDir = path.join(__dirname, "../../quarantine");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (!fs.existsSync(quarantineDir)) {
      fs.mkdirSync(quarantineDir, { recursive: true });
    }

    const quarantinePath = path.join(
      quarantineDir,
      fileName
    );

    // mover primero a cuarentena
    fs.renameSync(req.file.path, quarantinePath);

    // detectar esteganografía sobre el archivo original
    const result = await detectStego(quarantinePath);

    let status = "APPROVED";
    let analysis = "CLEAN";

    if (result.suspicious) {
      status = "QUARANTINE";
      analysis = "SUSPICIOUS";
    }

    // si no es sospechosa pasa directo a uploads
    if (!result.suspicious) {
      const finalPath = path.join(
        uploadsDir,
        fileName
      );

      fs.renameSync(quarantinePath, finalPath);
    }

    const album = await db.query(
      `
      INSERT INTO albums(
        user_id,
        title,
        description,
        privacy,
        status
      )
      VALUES($1,$2,$3,'PUBLIC','APROBADO')
      RETURNING id
      `,
      [
        userId,
        title,
        cleanDescription,
      ]
    );

    const albumId = album.rows[0].id;

    await db.query(
      `
      INSERT INTO images(
        filename,
        status,
        analysis,
        reason,
        album_id
      )
      VALUES($1,$2,$3,$4,$5)
      `,
      [
        fileName,
        status,
        analysis,
        result.reason,
        albumId,
      ]
    );

    if (result.suspicious) {
      return res.json({
        message:
          "Imagen sospechosa: Enviada al Supervisor",
      });
    }

    return res.json({
      message:
        "Imagen sin novedad: Subida Correctamente",
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: "Error subiendo imagen",
    });
  }
};

exports.gallery = async (req, res) => {
  try {
    const data = await db.query(`
      SELECT
        images.id,
        images.filename,
        albums.title AS album_title,
        albums.description
      FROM images
      LEFT JOIN albums
        ON albums.id = images.album_id
      WHERE images.status = 'APPROVED'
      AND images.filename IS NOT NULL
      ORDER BY images.id DESC
    `);

    res.json(data.rows);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Error cargando galería",
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
    console.log(err);

    res.status(500).json({
      error: "Error cargando cuarentena",
    });
  }
};

exports.approve = async (req, res) => {
  try {
    const image = await db.query(
      `
      SELECT *
      FROM images
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (image.rows.length === 0) {
      return res.status(404).json({
        error: "Imagen no encontrada",
      });
    }

    const img = image.rows[0];

    const quarantinePath = path.join(
      __dirname,
      "../../quarantine",
      img.filename
    );

    const uploadPath = path.join(
      __dirname,
      "../../uploads",
      img.filename
    );

    // mover imagen aprobada
    if (fs.existsSync(quarantinePath)) {
      fs.renameSync(
        quarantinePath,
        uploadPath
      );
    }

    await db.query(
      `
      UPDATE images
      SET status='APPROVED'
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      message: "Imagen aprobada",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Error aprobando imagen",
    });
  }
};
exports.reject = async (req, res) => {
  try {
    const image = await db.query(
      `
      SELECT *
      FROM images
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (image.rows.length > 0) {
      const img = image.rows[0];

      const quarantinePath = path.join(
        __dirname,
        "../../quarantine",
        img.filename
      );

      const uploadPath = path.join(
        __dirname,
        "../../uploads",
        img.filename
      );

      if (fs.existsSync(quarantinePath)) {
        fs.unlinkSync(quarantinePath);
      }

      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
    }

    await db.query(
      `
      DELETE FROM images
      WHERE id = $1
      `,
      [req.params.id]
    );

    res.json({
      message: "Imagen eliminada",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Error eliminando imagen",
    });
  }
};