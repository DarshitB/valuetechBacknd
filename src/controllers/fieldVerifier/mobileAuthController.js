const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mobileAuth = require("../../models/fieldVerifier/mobile_auth");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE_HOURS = 3; // fixed 3 hours

const mobileAuthController = {
  // LOGIN handler
  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required." });
    }

    try {
      const verifier = await mobileAuth.findByMobileOrEmail(username);

      if (!verifier) {
        return res.status(404).json({ message: "User not found." });
      }

      if (!verifier.is_active) {
        return res.status(403).json({
          message: "Contact your admin. You are not allowed to login for now.",
        });
      }

      const isMatch = await bcrypt.compare(password, verifier.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password." });
      }

      const expiresAt = new Date(
        Date.now() + JWT_EXPIRE_HOURS * 60 * 60 * 1000
      );
      const token = jwt.sign({ id: verifier.id }, JWT_SECRET, {
        expiresIn: `${JWT_EXPIRE_HOURS}h`,
      });

      const loginData = {
        field_verifier_id: verifier.id,
        token,
        login_at: new Date(),
        expires_at: expiresAt,
        ip_address: req.ip,
        device_info: req.headers["user-agent"],
      };

      const [session] = await mobileAuth.logLogin(loginData);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: verifier.id,
          name: verifier.name,
          mobile: verifier.mobile,
          email: verifier.email,
        },
        session,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  },

  // LOGOUT handler
  async logout(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token missing." });
    console.log("TOKEN:", token);
    try {
      const session = await mobileAuth.findValidSession(token);
      console.log("SESSION FOUND:", session);
      if (!session)
        return res.status(401).json({ message: "Invalid or expired token." });

      await mobileAuth.logoutById(session.id);

      return res.status(200).json({ message: "Logout successful." });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  },
};

module.exports = mobileAuthController;
