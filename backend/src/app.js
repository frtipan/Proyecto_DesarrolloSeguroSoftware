const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const imageRoutes = require("./routes/image.routes");
const albumRoutes = require("./routes/album.routes");

const app = express();

/*
  CORS
*/
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/*
  HELMET
*/
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/*
  CSP
*/
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      imgSrc: [
        "'self'",
        "data:",
        "http://localhost:3000",
      ],

      scriptSrc: ["'self'"],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
      ],

      objectSrc: ["'none'"],

      upgradeInsecureRequests: [],
    },
  })
);

/*
  X-Content-Type-Options: nosniff
*/
app.use(
  helmet.noSniff()
);

/*
  JSON
*/
app.use(express.json());

/*
  RATE LIMIT LOGIN
*/
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  message: {
    error:
      "Demasiados intentos. Intenta más tarde.",
  },
});

/*
  LOGIN LIMITER
*/
app.use(
  "/auth/login",
  loginLimiter
);

/*
  STATIC FILES
*/
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

app.use(
  "/quarantine",
  express.static(
    path.join(__dirname, "../quarantine")
  )
);

/*
  ROUTES
*/
app.use("/auth", authRoutes);
app.use("/images", imageRoutes);
app.use("/albums", albumRoutes);

/*
  EXPORT
*/
module.exports = app;