import { Op } from 'sequelize';
import { Case, Hearing, Client, Lawyer } from '../models/index.js';
import { renderOrJson } from '../middlewares/errors/index.js';
import AppError from '../middlewares/errors/appError.js';
import { HTTP, ERR, ROLES, CASE_STATUS, CASE_TYPE } from '../constants/index.js';

// ─── Helper: build where clause scoped to the requesting user ────────────────
// Associates only see data for cases assigned to them.
// Senior partners and secretaries see everything.
const caseScope = (user) =>
  user.role === ROLES.ASSOCIATE ? { lawyer_id: user.id } : {};


// ─── GET /dashboard/stats ────────────────────────────────────────────────────
// Returns aggregate counts broken down by status and case type.
// Associates only see counts for their own cases.
export const getStats = async (req, res, next) => {
  try {
    const where = caseScope(req.user);

    // Run all count queries in parallel with Promise.all for speed
    const [
      total,
      byStatusRows,
      byTypeRows,
      totalClients,
      upcomingHearings,
    ] = await Promise.all([
      // Total case count
      Case.count({ where }),

      // Count grouped by status
      Case.findAll({
        where,
        attributes: [
          'status',
          [Case.sequelize.fn('COUNT', Case.sequelize.col('id')), 'count'],
        ],
        group: ['status'],
        raw: true,
      }),

      // Count grouped by case_type
      Case.findAll({
        where,
        attributes: [
          'case_type',
          [Case.sequelize.fn('COUNT', Case.sequelize.col('id')), 'count'],
        ],
        group: ['case_type'],
        raw: true,
      }),

      // Total clients (always firm-wide regardless of role)
      Client.count(),

      // Hearings from today onwards
      Hearing.count({
        where: {
          hearing_date: { [Op.gte]: new Date() },
        },
      }),
    ]);

    // Transform the grouped rows into flat objects:
    // [{ status: 'Active', count: '5' }] → { Active: 5, Pending: 3, ... }
    const by_status = Object.fromEntries(
      Object.values(CASE_STATUS).map((s) => {
        const row = byStatusRows.find((r) => r.status === s);
        return [s, row ? parseInt(row.count, 10) : 0];
      })
    );

    const by_type = Object.fromEntries(
      Object.values(CASE_TYPE).map((t) => {
        const row = byTypeRows.find((r) => r.case_type === t);
        return [t, row ? parseInt(row.count, 10) : 0];
      })
    );

    renderOrJson(res, req, HTTP.OK, {
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: {
        total_cases      : total,
        total_clients    : totalClients,
        upcoming_hearings: upcomingHearings,
        by_status,
        by_type,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ─── GET /dashboard/upcoming-hearings ────────────────────────────────────────
// Returns the next 10 hearings from today, sorted soonest first.
// Includes nested case (with client) and the lawyer who scheduled it.
export const getUpcomingHearings = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Associates only see hearings for their assigned cases
    const caseWhere = caseScope(req.user);

    const hearings = await Hearing.findAll({
      where: {
        hearing_date: { [Op.gte]: today },
      },
      include: [
        {
          model: Case,
          as: 'case',
          where: caseWhere,       // filter hearings by case ownership for associates
          attributes: ['id', 'title', 'status'],
          include: [
            {
              model: Client,
              as: 'client',
              attributes: ['id', 'full_name'],
            },
          ],
        },
        {
          model: Lawyer,
          as: 'scheduledBy',
          attributes: ['id', 'full_name'],
        },
      ],
      order: [['hearing_date', 'ASC'], ['hearing_time', 'ASC']],
      limit: 10,
    });

    renderOrJson(res, req, HTTP.OK, {
      success: true,
      message: 'Upcoming hearings retrieved successfully',
      count: hearings.length,
      data: hearings,
    });
  } catch (error) {
    next(error);
  }
};


// ─── GET /dashboard/recent-cases ─────────────────────────────────────────────
// Returns the 10 most recently updated cases, sorted by updated_at descending.
// Includes nested client and assigned lawyer.
export const getRecentCases = async (req, res, next) => {
  try {
    const where = caseScope(req.user);

    const cases = await Case.findAll({
      where,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'full_name', 'email', 'client_type'],
        },
        {
          model: Lawyer,
          as: 'lawyer',
          attributes: ['id', 'full_name', 'specialty'],
        },
      ],
      order: [['updated_at', 'DESC']],
      limit: 10,
    });

    renderOrJson(res, req, HTTP.OK, {
      success: true,
      message: 'Recent cases retrieved successfully',
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    next(error);
  }
};
