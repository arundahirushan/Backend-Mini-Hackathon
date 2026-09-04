const authService = require("../services/authService");

async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    await authService.registerUser({ fullName, email, password });
    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    if (error.message === "An account with this email already exists") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Register Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { token, user } = await authService.loginUser({ email, password });
    
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    console.error("Login Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

module.exports = {
  register,
  login
};
