import { Lawyer } from '../models/index.js';
import bcrypt from "bcrypt";
import { HTTP, ERR } from '../constants/errorCodes.js';
import { renderOrJson } from '../middlewares/errors/index.js';
import { ROLES } from "../constants/index.js";

// Get all lawyers
// @route   GET /api/lawyers
export const getAllLawyers = async (req, res, next) => {
  try {
    let whereClause = {};

    // Non-senior-partners only see active lawyers
    if (req.user.role !== ROLES.SENIOR_PARTNER) {
      whereClause.is_active = true;
    }

    const lawyers = await Lawyer.findAll({
      where: whereClause,
      order: [['full_name', 'ASC']],
    });

    renderOrJson(res, req, HTTP.OK, {
      success: true,
      count: lawyers.length,
      data: lawyers,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single lawyer by ID
// @route   GET /api/lawyers/:id
export const getLawyerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lawyer = await Lawyer.findByPk(id);

    if (!lawyer) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, {
        success: false,
        message: 'Lawyer not found',
        data: null,
      });
    }

    // Senior partners can see inactive lawyers; others cannot
    if (!lawyer.is_active && req.user.role !== ROLES.SENIOR_PARTNER) {
      return renderOrJson(res, req, HTTP.FORBIDDEN, {
        success: false,
        message: 'You are not authorized to view this lawyer',
        data: null,
      });
    }

    renderOrJson(res, req, HTTP.OK, {
      success: true,
      data: lawyer,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new lawyer
// @route   POST /api/lawyers
export const createLawyer = async (req, res, next) => {
  try {
    const { full_name, email, password, role, phone, specialty } = req.body;

    const existingLawyer = await Lawyer.findOne({ where: { email } });
    if (existingLawyer) {
      return renderOrJson(res, req, HTTP.CONFLICT, {
        success: false,
        message: 'Lawyer with this email already exists',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newLawyer = await Lawyer.create({
      full_name, email, password: hashedPassword, role, phone, specialty, is_active: true,
    });

    renderOrJson(res, req, HTTP.CREATED, {
      success: true,
      message: 'Lawyer created successfully',
      data: newLawyer,
    });
  } catch (error) {
    next(error);
  }
};

// Update a lawyer
// @route   PUT /api/lawyers/:id
export const updateLawyer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lawyer = await Lawyer.findByPk(id);

    if (!lawyer) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, {
        success: false,
        message: 'Lawyer not found',
        data: null,
      });
    }

    const { full_name, role, phone, specialty } = req.body;
    await lawyer.update({
      full_name:  full_name  || lawyer.full_name,
      role:       role       || lawyer.role,
      phone:      phone      !== undefined ? phone      : lawyer.phone,
      specialty: specialty || lawyer.specialty,
    });

    renderOrJson(res, req, HTTP.OK, {
      success: true,
      message: 'Lawyer updated successfully',
      data: lawyer,
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate a lawyer
// @route   PATCH /api/lawyers/:id/deactivate
export const deactivateLawyer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return renderOrJson(res, req, HTTP.BAD_REQUEST, {
        success: false,
        message: 'You cannot deactivate your own account',
        data: null,
      });
    }

    const lawyer = await Lawyer.findByPk(id);
    if (!lawyer) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, {
        success: false,
        message: 'Lawyer not found',
        data: null,
      });
    }

    if (!lawyer.is_active) {
      return renderOrJson(res, req, HTTP.BAD_REQUEST, {
        success: false,
        message: 'Lawyer is already deactivated',
        data: null,
      });
    }

    await lawyer.update({ is_active: false });
    renderOrJson(res, req, HTTP.OK, {
      success: true,
      message: 'Lawyer deactivated successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Reactivate a lawyer
// @route   PATCH /api/lawyers/:id/reactivate
export const reactivateLawyer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lawyer = await Lawyer.findByPk(id);

    if (!lawyer) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, {
        success: false,
        message: 'Lawyer not found',
        data: null,
      });
    }

    if (lawyer.is_active) {
      return renderOrJson(res, req, HTTP.BAD_REQUEST, {
        success: false,
        message: 'Lawyer is already active',
        data: null,
      });
    }

    await lawyer.update({ is_active: true });
    renderOrJson(res, req, HTTP.OK, {
      success: true,
      message: 'Lawyer reactivated successfully',
      data: lawyer,
    });
  } catch (error) {
    next(error);
  }
};
