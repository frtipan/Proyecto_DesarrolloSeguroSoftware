const fs = require("fs");

exports.analyze = (file) => {
    const buffer = fs.readFileSync(file);

    let count = 0;

    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] % 2 === 1) count++;
    }

    const ratio = count / buffer.length;

    return ratio > 0.55 ? "SUSPICIOUS" : "CLEAN";
};