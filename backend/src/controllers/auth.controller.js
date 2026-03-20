import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);
/**
 * @desc Temporary debug route — checks env vars and sends a test email
 * @route GET /api/auth/debug
 * @access Public — REMOVE THIS FUNCTION AND ROUTE AFTER DEBUGGING
 */
export async function debug(req, res) {
  const results = {
    env: {
      BACKEND_URL: process.env.FRONTEND_URL || "❌ NOT SET",
      FRONTEND_URL: process.env.FRONTEND_URL || "❌ NOT SET",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ set" : "❌ NOT SET",
      GOOGLE_USER: process.env.GOOGLE_USER || "❌ NOT SET",
      MAIL_PASS: process.env.MAIL_PASS ? "✅ set" : "❌ NOT SET",
      NODE_ENV: process.env.NODE_ENV || "❌ NOT SET",
    },
    emailTest: null,
    emailError: null,
  };
 
  try {
    await sendEmail({
      to: process.env.GOOGLE_USER,
      subject: "Render Debug Test",
      html: "<p>If you see this, email is working on Render ✅</p>",
    });
    results.emailTest = "✅ Email sent successfully";
  } catch (err) {
    results.emailTest = "❌ Email failed";
    results.emailError = err.message;
  }
 
  return res.status(200).json(results);
}
/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
        err: "User already exists",
      });
    }

    const user = await userModel.create({ username, email, password });

    const emailVerificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
    );

    const backendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    await sendEmail({
      to: email,
      subject: "Welcome to Perplexity!",
      html: `
        <p>Hi ${username},</p>
        <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${backendUrl}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>The Perplexity Team</p>
      `,
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Registration failed. Please try again.",
      success: false,
      err: error.message,
    });
  }
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "User not found",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "Incorrect password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.redirect(
        `${frontendUrl}/verify-email?status=error&message=UserNotFound`,
      );
    }

    user.verified = true;
    await user.save();

    return res.redirect(`${frontendUrl}/verify-email?status=success`);
  } catch (err) {
    return res.redirect(
      `${frontendUrl}/verify-email?status=error&message=InvalidToken`,
    );
  }
}

/**
 * @desc Logout user and clear JWT cookie
 * @route POST /api/auth/logout
 * @access Private
 */
export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      success: false,
      err: error.message,
    });
  }
}

/**
 * @desc Resend verification email
 * @route POST /api/auth/resend-verification
 * @access Public
 * @body { email }
 */
export async function resendVerificationEmail(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
      success: false,
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false,
      });
    }

    const emailVerificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
    );

    const backendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    await sendEmail({
      to: email,
      subject: "Verify your Perplexity account!",
      html: `
        <p>Hi ${user.username},</p>
        <p>You requested to resend the verification email. Please verify your email address by clicking the link below:</p>
        <a href="${backendUrl}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>The Perplexity Team</p>
      `,
    });

    return res.status(200).json({
      message: "Verification email resent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      message: "Failed to resend verification email",
      success: false,
      err: error.message,
    });
  }
}

export async function googleAuth(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({
        message: "Failed to retrieve id_token from Google",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account email not found" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        username: name,
        email,
        provider: "google",
        googleId: sub,
        picture,
        verified: true,
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
}