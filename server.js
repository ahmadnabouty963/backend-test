const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const authenticate = require("./middleware/authenticate");
const PORT = 3000;
const users = require("./data/users");
const sessions = require("./data/sessions");
const requireAdmin = require("./middleware/requireAdmin");

app.use(express.json());

//erste Route

app.get("/", (req, res) => {
  res.send("Secure Login API läuft!");
});

//HEALTH ROUTE erstellen
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

//regestierungsroute
app.post("/register", async (req, res) => {
  const { email, password, role = "user" } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Email und Password sind erforderlich",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find((user) => user.email === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Diese Email ist bereits registered",
    });
  }
  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = {
    id: users.length + 1,
    email: normalizedEmail,
    passwordHash,
    role,
  };
  users.push(newUser);

  return res.status(201).json({
    success: true,
    message: "Benutzer erfolgreich regestiert.",
    data: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// LOGIN ROUTE !
app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Email und Password sind erforderlich.",
    });
  }
  const normalizedEmail = email.trim().toLocaleLowerCase();
  const user = users.find((user) => user.email === normalizedEmail);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Email oder Pasword ist falsch",
    });
  }
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "zugangsdaten sind falsch",
    });
  }
  const token = randomUUID();
  sessions.set(token, user.id);
  return res.status(200).json({
    success: true,
    message: "Login erfolgreich",
    token: token,
  });
});

// GESCHÜTZTE ROUTE
app.get("/me", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Benutzerdaten erfolgreich geladen",
    data: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// admin ROUTE

app.get("/admin", authenticate, requireAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Wilkommen im Admin-bereich",
    date: {
      email: req.user.email,
      role: req.user.role,
    },
  });
});
//server testen
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
