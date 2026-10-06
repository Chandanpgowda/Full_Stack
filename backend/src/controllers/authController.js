const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ems_secure_jwt_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Helper to safely decode Google ID token JWT without third-party lib if credential passed
 */
const decodeGoogleCredential = (credential) => {
  try {
    const parts = credential.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      provider: 'local'
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Sign in existing user
 * @route   POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user and include password hash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // For users registered solely with Google OAuth without a password
    if (user.provider === 'google' && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google. Please use "Continue with Google" to sign in.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Google OAuth Sign-In or Sign-Up
 * @route   POST /api/auth/google
 */
exports.googleAuth = async (req, res, next) => {
  try {
    const { credential, email, name, avatar, googleId } = req.body;

    let userEmail = email;
    let userName = name;
    let userAvatar = avatar || '';
    let gId = googleId || '';

    // If Google ID token credential was sent directly from Google One-Tap or Google GSI
    if (credential) {
      const decoded = decodeGoogleCredential(credential);
      if (decoded && decoded.email) {
        userEmail = decoded.email;
        userName = decoded.name || decoded.email.split('@')[0];
        userAvatar = decoded.picture || '';
        gId = decoded.sub || '';
      }
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication payload missing email'
      });
    }

    userEmail = userEmail.toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      // Create new user via Google
      user = await User.create({
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        avatar: userAvatar,
        provider: 'google',
        googleId: gId
      });
    } else {
      // Update googleId and avatar if missing
      if (userAvatar && !user.avatar) user.avatar = userAvatar;
      if (gId && !user.googleId) user.googleId = gId;
      await user.save();
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token'
    });
  }
};
