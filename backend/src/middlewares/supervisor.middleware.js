module.exports = function requireSupervisor(req, res, next) {
  const role = req.headers["x-role"];

  if (role !== "SUPERVISOR") {
    return res.status(403).json({
      error: "Acceso denegado",
    });
  }

  next();
};