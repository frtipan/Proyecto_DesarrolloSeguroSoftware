const express = require("express");
const cors = require("cors");
const albumRoutes = require("./routes/album.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", require("express").static("uploads"));
app.use("/quarantine", require("express").static("quarantine"));


app.use("/auth", require("./routes/auth.routes"));
app.use("/images", require("./routes/image.routes"));
app.use("/albums", albumRoutes);

module.exports = app;