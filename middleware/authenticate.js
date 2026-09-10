const users = require("../data/users");
const sessions = require("../data/sessions");

function authenticate(req, res, next) {
  console.log("Authorization:", req.headers.authorization);
  console.log("Sessions:", [...sessions.entries()]);
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentifizierung erforderlich",
    });
  }

  const token = authorizationHeader.slice(7).trim();
  if (!sessions.has(token)) {
    return res.status(401).json({
      success: false,
      message: "Token ist ungültig",
    });
  }
  const userId = sessions.get(token);
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: " Benutzer der Sitzung wurde nicht gefunden.",
    });
  }
  req.user = user;
  req.token = token;
  next();
}
module.exports = authenticate;
