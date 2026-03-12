import { Case, Hearing, Lawyer, Client } from '../models/index.js';
import { HTTP, ERR, ROLES, CASE_TYPE } from '../constants/index.js';
import { renderOrJson } from '../middlewares/errors/index.js';

// Generate next SLT-XXX case ID
const generateCaseId = async () => {
  const count = await Case.count();
  return `SLT-${String(count + 1).padStart(3, '0')}`;
};

// Create new case
// POST /api/cases
export const createCase = async (req, res, next) => {
  try {
    const { title, description, case_type, status, client_id, lawyer_id, filed_date } = req.body;
    const id = await generateCaseId();
    const newCase = await Case.create({ id, title, description, case_type, status, client_id, lawyer_id, filed_date });
    return renderOrJson(res, req, HTTP.CREATED, { success: true, message: 'Case created successfully', data: newCase });
  } catch (error) {
    next(error);
  }
};

// Get all cases (with optional filters)
// GET /api/cases
export const getAllCases = async (req, res, next) => {
  try {
    const { status, caseType } = req.query;
    const whereClause = {};
    if (status) whereClause.status = status;
    if (caseType) whereClause.case_type = caseType;

    // Associates can only see their own assigned cases
    if (req.user.role === ROLES.ASSOCIATE) {
      whereClause.lawyer_id = req.user.id;
    }

    const cases = await Case.findAll({ where: whereClause });
    return renderOrJson(res, req, HTTP.OK, { success: true, count: cases.length, data: cases });
  } catch (error) {
    next(error);
  }
};

// Get all valid case types
// GET /api/cases/types
export const getCaseTypes = (req, res) => {
  return renderOrJson(res, req, HTTP.OK, { success: true, data: Object.values(CASE_TYPE) });
};

// Get recent cases (last 10 by updated_at)
// GET /api/cases/recent
export const getRecentCases = async (req, res, next) => {
  try {
    const whereClause = {};
    if (req.user.role === ROLES.ASSOCIATE) {
      whereClause.lawyer_id = req.user.id;
    }
    const cases = await Case.findAll({
      where: whereClause,
      order: [['updated_at', 'DESC']],
      limit: 10,
      include: [
        { model: Client, as: 'client', attributes: ['id', 'full_name', 'email'] },
        { model: Lawyer, as: 'lawyer', attributes: ['id', 'full_name', 'specialty'] },
      ],
    });
    return renderOrJson(res, req, HTTP.OK, { success: true, count: cases.length, data: cases });
  } catch (error) {
    next(error);
  }
};

// Get a case by ID (basic)
// GET /api/cases/:id
export const getCaseById = async (req, res, next) => {
  try {
    const caseItem = await Case.findByPk(req.params.id);
    if (!caseItem) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: 'Case not found', data: null });
    }
    return renderOrJson(res, req, HTTP.OK, { success: true, data: caseItem });
  } catch (error) {
    next(error);
  }
};

// Get full case detail with associations
// GET /api/cases/:id/detail
export const getCaseDetail = async (req, res, next) => {
  try {
    const caseItem = await Case.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'full_name', 'email', 'phone'] },
        { model: Lawyer, as: 'lawyer', attributes: ['id', 'full_name', 'email', 'specialty'] },
        { model: Hearing, as: 'hearings' },
      ],
    });
    if (!caseItem) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: 'Case not found', data: null });
    }
    return renderOrJson(res, req, HTTP.OK, { success: true, data: caseItem });
  } catch (error) {
    next(error);
  }
};

// Update a case
// PUT /api/cases/:id
export const updateCase = async (req, res, next) => {
  try {
    const caseItem = await Case.findByPk(req.params.id);
    if (!caseItem) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: 'Case not found', data: null });
    }
    const { title, description, case_type, client_id, lawyer_id, filed_date, closed_date } = req.body;
    await caseItem.update({ title, description, case_type, client_id, lawyer_id, filed_date, closed_date });
    return renderOrJson(res, req, HTTP.OK, { success: true, message: 'Case updated successfully', data: caseItem });
  } catch (error) {
    next(error);
  }
};

// Delete a case
// DELETE /api/cases/:id
export const deleteCase = async (req, res, next) => {
  try {
    const caseItem = await Case.findByPk(req.params.id);
    if (!caseItem) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: 'Case not found', data: null });
    }
    await caseItem.destroy();
    return renderOrJson(res, req, HTTP.OK, { success: true, message: 'Case deleted successfully', data: null });
  } catch (error) {
    next(error);
  }
};

// Assign a lawyer to a case
// PATCH /api/cases/:id/assign
export const assignLawyer = async (req, res, next) => {
  try {
    const caseItem = await Case.findByPk(req.params.id);
    if (!caseItem) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: 'Case not found', data: null });
    }
    const { lawyer_id } = req.body;
    await caseItem.update({ lawyer_id });
    return renderOrJson(res, req, HTTP.OK, { success: true, message: 'Lawyer assigned successfully', data: caseItem });
  } catch (error) {
    next(error);
  }
};

// Update case status
// PATCH /api/cases/:id/status
export const updateCaseStatus = async (req, res, next) => {
  try {
    const caseItem = await Case.findByPk(req.params.id);
    if (!caseItem) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: 'Case not found', data: null });
    }
    const { status } = req.body;
    await caseItem.update({ status });
    return renderOrJson(res, req, HTTP.OK, { success: true, message: 'Case status updated', data: caseItem });
  } catch (error) {
    next(error);
  }
};

// Get hearings for a case
// GET /api/cases/:id/hearings
export const getCaseHearings = async (req, res, next) => {
  try {
    const caseItem = await Case.findByPk(req.params.id, {
      include: [{ model: Hearing, as: 'hearings' }],
    });
    if (!caseItem) {
      return renderOrJson(res, req, HTTP.NOT_FOUND, { success: false, message: 'Case not found', data: null });
    }
    return renderOrJson(res, req, HTTP.OK, { success: true, count: caseItem.hearings.length, data: caseItem.hearings });
  } catch (error) {
    next(error);
  }
};
