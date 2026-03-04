import crypto from 'crypto';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules ────────────────────────────────────────────────────────

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

export const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return true;
  }
  return false;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

export const register = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isBlocked) return res.status(403).json({ message: 'Your account has been blocked' });

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond with success to avoid user enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent' });

    // Generate raw token and its hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken  = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to:      user.email,
      subject: 'CEILO — Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the link below — it expires in <strong>15 minutes</strong>.</p>
        <a href="${resetUrl}" style="
          display:inline-block;padding:12px 24px;background:#000;color:#fff;
          text-decoration:none;border-radius:6px;margin:16px 0;
        ">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
      text: `Reset your password: ${resetUrl}`,
    });

    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password            = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};