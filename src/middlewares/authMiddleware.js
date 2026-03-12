import jwt from 'jsonwebtoken';
import settings from '../config/settings.js';
import { HTTP, ERR } from '../constants/index.js';
import { renderOrJson } from './errors/index.js';

export const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return renderOrJson(res, req, HTTP.UNAUTHORIZED, { success: false, message: ERR.AUTH_REQUIRED, data: null });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, settings.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return renderOrJson(res, req, HTTP.UNAUTHORIZED, { success: false, message: ERR.TOKEN_EXPIRED, data: null });
    }
    return renderOrJson(res, req, HTTP.UNAUTHORIZED, { success: false, message: ERR.TOKEN_INVALID, data: null });
  }
};

export const roleMiddleware = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!allowed.includes(req.user.role)) {
      return renderOrJson(res, req, HTTP.FORBIDDEN, { success: false, message: ERR.FORBIDDEN, data: null });
    }
    next();
  };
};
