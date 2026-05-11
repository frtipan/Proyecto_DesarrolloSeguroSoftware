const fs = require("fs");
const sharp = require("sharp");

module.exports = async function detectStego(filePath) {

  try {

    const buffer = fs.readFileSync(filePath);

    let score = 0;
    let reasons = [];

    // =====================================
    // 1. PAYLOADS OCULTOS
    // =====================================

    const tail = buffer
      .slice(-8000)
      .toString("hex");

    if (
      tail.includes("504b0304") || // ZIP
      tail.includes("4d5a") || // EXE
      tail.includes("52617221") || // RAR
      tail.includes("25504446") || // PDF
      tail.includes("3c736372697074") // SCRIPT
    ) {

      score += 10;

      reasons.push(
        "Payload oculto"
      );
    }

    // =====================================
    // 2. EXTRAER PIXELES
    // =====================================

    const {
      data,
      info,
    } = await sharp(filePath)
      .raw()
      .toBuffer({
        resolveWithObject: true,
      });

    const limit = Math.min(
      data.length,
      100000
    );

    // =====================================
    // 3. ANALISIS LSB
    // =====================================

    let ones = 0;

    for (let i = 0; i < limit; i++) {

      if ((data[i] & 1) === 1) {
        ones++;
      }

    }

    const ratio = ones / limit;

    // más sensible
    if (
      ratio > 0.512 ||
      ratio < 0.488
    ) {

      score += 3;

      reasons.push(
        "LSB alterado"
      );
    }

    // =====================================
    // 4. BLOQUES
    // =====================================

    let suspiciousBlocks = 0;

    const blockSize = 256;

    for (
      let start = 0;
      start < limit;
      start += blockSize
    ) {

      let localOnes = 0;
      let count = 0;

      for (
        let i = start;
        i < start + blockSize &&
        i < limit;
        i++
      ) {

        if ((data[i] & 1) === 1) {
          localOnes++;
        }

        count++;
      }

      const localRatio =
        localOnes / count;

      // MUY importante
      if (
        localRatio > 0.56 ||
        localRatio < 0.44
      ) {

        suspiciousBlocks++;
      }
    }

    if (suspiciousBlocks >= 15) {

      score += 3;

      reasons.push(
        "Patrones LSB"
      );
    }

    // =====================================
    // 5. PIXELES CON CAMBIOS ±1
    // =====================================

    let plusMinusOne = 0;

    for (let i = 1; i < limit; i++) {

      const diff = Math.abs(
        data[i] - data[i - 1]
      );

      // típico de steganography.js
      if (diff === 1) {
        plusMinusOne++;
      }

    }

    const pmRatio =
      plusMinusOne / limit;

    // MUY útil para stylesuxx
    if (pmRatio > 0.16) {

      score += 4;

      reasons.push(
        "Cambios secuenciales"
      );
    }

    // =====================================
    // 6. ENTROPIA
    // =====================================

    let freq =
      new Array(256).fill(0);

    for (let i = 0; i < limit; i++) {

      freq[data[i]]++;

    }

    let entropy = 0;

    for (let i = 0; i < 256; i++) {

      if (freq[i] > 0) {

        const p =
          freq[i] / limit;

        entropy -=
          p * Math.log2(p);

      }
    }

    if (entropy > 7.92) {

      score += 1;

      reasons.push(
        "Entropía alta"
      );
    }

    // =====================================
    // 7. TAMAÑO SOSPECHOSO
    // =====================================

    const estimated =
      info.width *
      info.height *
      info.channels;

    if (
      buffer.length >
      estimated * 9
    ) {

      score += 1;

      reasons.push(
        "Tamaño anómalo"
      );
    }

    // =====================================
    // DECISION FINAL
    // =====================================

    // equilibrio correcto
    const suspicious =
      score >= 5;

    return {

      suspicious,

      reason:
        reasons.join(", ") ||
        "Sin anomalías",

    };

  } catch (err) {

    console.log(err);

    return {

      suspicious: true,

      reason:
        "Imagen corrupta",

    };

  }
};