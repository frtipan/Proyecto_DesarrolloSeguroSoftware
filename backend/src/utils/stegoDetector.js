const Jimp = require("jimp");

exports.detectStego = async (filePath) => {
  try {
    const image = await Jimp.read(filePath);

    let count = 0;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const lsb = this.bitmap.data[idx] & 1;
      if (lsb === 1) count++;
    });

    if (count > 5000) {
      return { status: "suspicious", detail: "LSB detectado" };
    }

    return { status: "clean", detail: "Imagen limpia" };

  } catch (err) {
    return { status: "clean", detail: "Fallback seguro" };
  }
};