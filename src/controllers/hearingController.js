import { Hearing } from '../models'; // Assuming Sequelize model is set up

// Create new hearing
export const createHearing = async (req, res) => {
  try {
    const hearing = await Hearing.create(req.body);
    return res.status(201).json(hearing);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all hearings (with optional filters)
export const getAllHearings = async (req, res) => {
  try {
    const { status, caseId } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (caseId) whereClause.caseId = caseId;

    const hearings = await Hearing.findAll({ where: whereClause });
    return res.json(hearings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a hearing by ID
export const getHearingById = async (req, res) => {
  try {
    const hearing = await Hearing.findByPk(req.params.id);
    if (!hearing) return res.status(404).json({ message: "Hearing not found" });
    return res.json(hearing);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a hearing
export const updateHearing = async (req, res) => {
  try {
    const hearing = await Hearing.findByPk(req.params.id);
    if (!hearing) return res.status(404).json({ message: "Hearing not found" });

    await hearing.update(req.body);
    return res.json(hearing);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a hearing
export const deleteHearing = async (req, res) => {
  try {
    const hearing = await Hearing.findByPk(req.params.id);
    if (!hearing) return res.status(404).json({ message: "Hearing not found" });

    await hearing.destroy();
    return res.status(204).json(); // No content after deletion
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get upcoming hearings (for dashboard)
export const getUpcomingHearings = async (req, res) => {
  try {
    const hearings = await Hearing.findAll({
      where: {
        hearingDate: {
          [Op.gte]: new Date(), // Only upcoming hearings
        },
        status: "scheduled",
      },
      order: [["hearingDate", "ASC"]],
      limit: 10,
    });
    return res.json(hearings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};