import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Lawyer } from '../models/index.js';
import settings from '../config/settings.js';
import { HTTP, ERR } from '../constants/index.js';
import { renderOrJson } from '../middlewares/errors/index.js';

// Register a new lawyer account
// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { full_name, email, password, phone, specialty, role } = req.body;

    const existing = await Lawyer.findOne({ where: { email } });
    if (existing) {
      return renderOrJson(res, req, HTTP.CONFLICT, { success: false, message: 'An account with this email already exists', data: null });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const lawyer = await Lawyer.create({ full_name, email, password: hashedPassword, phone, specialty, role });

    const token = jwt.sign(
      { id: lawyer.id, email: lawyer.email, role: lawyer.role },
      settings.jwt.secret,
      { expiresIn: settings.jwt.expiresIn }
    );

    renderOrJson(res, req, HTTP.CREATED, {
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: {
          id: lawyer.id,
          full_name: lawyer.full_name,
          email: lawyer.email,
          role: lawyer.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const lawyer = await Lawyer.scope('withPassword').findOne({ where: { email } });
    if (!lawyer) {
      return renderOrJson(res, req, HTTP.UNAUTHORIZED, { success: false, message: ERR.INVALID_CREDENTIALS, data: null });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) {
      return renderOrJson(res, req, HTTP.UNAUTHORIZED, { success: false, message: ERR.INVALID_CREDENTIALS, data: null });
    }

    if (!lawyer.is_active) {
      return renderOrJson(res, req, HTTP.UNAUTHORIZED, { success: false, message: ERR.ACCOUNT_INACTIVE, data: null });
    }

    const token = jwt.sign(
      { id: lawyer.id, email: lawyer.email, role: lawyer.role },
      settings.jwt.secret,
      { expiresIn: settings.jwt.expiresIn }
    );

    renderOrJson(res, req, HTTP.OK, {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: lawyer.id,
          full_name: lawyer.full_name,
          email: lawyer.email,
          role: lawyer.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
// POST /api/auth/logout
export const logout = (req, res) => {
  renderOrJson(res, req, HTTP.OK, { success: true, message: 'Logged out successfully', data: null });
};

// Get current authenticated user
// GET /api/auth/me
export const me = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findByPk(req.user.id);
    if (!lawyer) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: ERR.NOT_FOUND, data: null });
    }
    renderOrJson(res, req, HTTP.OK, { success: true, data: lawyer });
  } catch (error) {
    next(error);
  }
};
