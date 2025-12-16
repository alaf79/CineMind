import { registerService, loginService } from "../services/services.js";
import { validatePassword, validateUsername, validateEmail } from "../utils/passwordValidator.js";
import { verifyToken } from "../utils/jwt.js";
// import { sendWelcomeEmail } from "../services/emailService.js";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Username validation
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: usernameValidation.errors[0] 
      });
    }

    // Email validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: emailValidation.errors[0] 
      });
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: passwordValidation.errors[0] 
      });
    }

    // Register user
    const user = await registerService(username, email, password);

    // Optional: send welcome email
    /* sendWelcomeEmail(email, username).catch(err =>
      console.error('Failed to send welcome email:', err)
    ); */

    res.status(201).json({ success: true, user });
  } catch (err) {
    // Handle duplicate keys
    if (err.code === '23505') {
      if (err.constraint === 'users_username_key') {
        return res.status(400).json({ success: false, error: "Username already exists" });
      }
      if (err.constraint === 'users_email_key') {
        return res.status(400).json({ success: false, error: "Email already exists" });
      }
    }

    res.status(400).json({ success: false, error: err.message || "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required"
      });
    }

    const result = await loginService(username, password);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || "Login failed" });
  }
}

export function profile(req, res) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ success: false, error: "Missing token" });
    }

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    res.json({ success: true, message: "You are authenticated", user: decoded });
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}
