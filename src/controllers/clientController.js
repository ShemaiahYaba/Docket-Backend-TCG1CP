import { Op } from 'sequelize';
import { Client, Case } from '../models/index.js';
import { HTTP, ERR } from '../constants/index.js';

// Get all clients
// @route   GET /api/clients
// @access  Authenticated
export const getAllClients = async (req, res, next) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          [Op.or]: [
            { full_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const clients = await Client.findAll({
      where: whereClause,
      order: [['full_name', 'ASC']],
    });

    res.status(HTTP.OK).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single client by ID
// @route   GET /api/clients/:id
// @access  Authenticated
export const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      include: [{ model: Case, as: 'cases' }],
    });

    if (!client) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Client not found',
        data: null,
      });
    }

    res.status(HTTP.OK).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new client
// @route   POST /api/clients
// @access  senior_partner, secretary
export const createClient = async (req, res, next) => {
  try {
    const { full_name, email, phone, address, client_type } = req.body;

    const existing = await Client.findOne({ where: { email } });
    if (existing) {
      return res.status(HTTP.CONFLICT).json({
        success: false,
        message: 'A client with this email already exists',
        data: null,
      });
    }

    const client = await Client.create({ full_name, email, phone, address, client_type });

    res.status(HTTP.CREATED).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// Update a client
// @route   PUT /api/clients/:id
// @access  senior_partner, secretary
export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Client not found',
        data: null,
      });
    }

    const { full_name, email, phone, address, client_type } = req.body;

    // If email is changing, check uniqueness
    if (email && email !== client.email) {
      const emailTaken = await Client.findOne({ where: { email } });
      if (emailTaken) {
        return res.status(HTTP.CONFLICT).json({
          success: false,
          message: 'A client with this email already exists',
          data: null,
        });
      }
    }

    await client.update({
      full_name:   full_name   !== undefined ? full_name   : client.full_name,
      email:       email       !== undefined ? email       : client.email,
      phone:       phone       !== undefined ? phone       : client.phone,
      address:     address     !== undefined ? address     : client.address,
      client_type: client_type !== undefined ? client_type : client.client_type,
    });

    res.status(HTTP.OK).json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a client
// @route   DELETE /api/clients/:id
// @access  senior_partner
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: 'Client not found',
        data: null,
      });
    }

    await client.destroy();

    res.status(HTTP.OK).json({
      success: true,
      message: 'Client deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
