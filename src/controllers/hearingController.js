import { Op } from 'sequelize';
import { Hearing } from '../models/index.js';
import { HTTP } from '../constants/index.js';

// Create new hearing
// POST /api/hearings
export const createHearing = async (req, res, next) => {
  try {
    const { case_id, hearing_date, hearing_time, court_name, notes } = req.body;
    const hearing = await Hearing.create({
      case_id,
      hearing_date,
      hearing_time,
      court_name,
      notes,
      created_by: req.user.id,
    });
    return res.status(HTTP.CREATED).json({ success: true, message: 'Hearing created successfully', data: hearing });
  } catch (error) {
    next(error);
  }
};

// Get all hearings (with optional case filter)
// GET /api/hearings
export const getAllHearings = async (req, res, next) => {
  try {
    const { case_id } = req.query;
    const whereClause = {};
    if (case_id) whereClause.case_id = case_id;

    const hearings = await Hearing.findAll({ where: whereClause, order: [['hearing_date', 'ASC']] });
    return res.status(HTTP.OK).json({ success: true, count: hearings.length, data: hearings });
  } catch (error) {
    next(error);
  }
};

// Get a hearing by ID
// GET /api/hearings/:id
export const getHearingById = async (req, res, next) => {
  try {
    const hearing = await Hearing.findByPk(req.params.id);
    if (!hearing) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, message: 'Hearing not found', data: null });
    }
    return res.status(HTTP.OK).json({ success: true, data: hearing });
  } catch (error) {
    next(error);
  }
};

// Update a hearing
// PUT /api/hearings/:id
export const updateHearing = async (req, res, next) => {
  try {
    const hearing = await Hearing.findByPk(req.params.id);
    if (!hearing) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, message: 'Hearing not found', data: null });
    }
    const { hearing_date, hearing_time, court_name, notes, outcome } = req.body;
    await hearing.update({ hearing_date, hearing_time, court_name, notes, outcome });
    return res.status(HTTP.OK).json({ success: true, message: 'Hearing updated successfully', data: hearing });
  } catch (error) {
    next(error);
  }
};

// Delete a hearing
// DELETE /api/hearings/:id
export const deleteHearing = async (req, res, next) => {
  try {
    const hearing = await Hearing.findByPk(req.params.id);
    if (!hearing) {
      return res.status(HTTP.NOT_FOUND).json({ success: false, message: 'Hearing not found', data: null });
    }
    await hearing.destroy();
    return res.status(HTTP.OK).json({ success: true, message: 'Hearing deleted successfully', data: null });
  } catch (error) {
    next(error);
  }
};

// Get upcoming hearings (today and future), ordered soonest first
// GET /api/hearings/upcoming
export const getUpcomingHearings = async (req, res, next) => {
  try {
    const hearings = await Hearing.findAll({
      where: {
        hearing_date: { [Op.gte]: new Date() },
      },
      order: [['hearing_date', 'ASC']],
      limit: 10,
    });
    return res.status(HTTP.OK).json({ success: true, count: hearings.length, data: hearings });
  } catch (error) {
    next(error);
  }
};
