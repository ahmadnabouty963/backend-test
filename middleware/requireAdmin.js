function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "zugriff nur für Admin",
    });
  }
  next();
}
module.exports = requireAdmin;
