import { Case } from "../models";

// Create new case
// POST /api/cases
export const createCase = async (req, res) => {
    try {
        const newCase = await Case.create(req.body);
        return res.status(201).json(newCase);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }   
};

// Get all cases (with optional filters)
// GET /api/cases

export const getAllCases = async (req, res) => {
    try {
        const { status, caseType } = req.query;
        const whereClause = {};
        if (status) whereClause.status = status;
        if (caseType) whereClause.case_type = caseType;
        const cases = await Case.findAll({ where: whereClause });
        return res.json(cases);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get a case by ID
// GET /api/cases/:id
export const getCaseById = async (req, res) => {
    try {
        const caseItem = await Case.findByPk(req.params.id);
        if (!caseItem) return res.status(404).json({ message: "Case not found" });
        return res.json(caseItem);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }       
};

// Update a case
// PUT /api/cases/:id	Updates case details, senior_partner/secretary only
export const updateCase = async (req, res) => {
    try {
        const caseItem = await Case.findByPk(req.params.id);
        if (!caseItem) return res.status(404).json({ message: "Case not found" });
        await caseItem.update(req.body);
        return res.json(caseItem);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a case
// @route   DELETE /api/cases/:id
export const deleteCase = async (req, res) => {
    try {
        const caseItem = await Case.findByPk(req.params.id);
        if (!caseItem) return res.status(404).json({ message: "Case not found" });
        await caseItem.destroy();
        return res.json({ message: "Case deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PATCH /api/cases/:id/assign	Assigns/reassigns lawyer, senior_partner/secretary only
export const assignLawyer = async (req, res) => {
    try {
        const caseItem = await Case.findByPk(req.params.id);
        if (!caseItem) return res.status(404).json({ message: "Case not found" });
        const { lawyer_id } = req.body;
        await caseItem.update({ lawyer_id });
        return res.json(caseItem);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PATCH /api/cases/:id/status	Updates status with lifecycle enforcement
export const updateCaseStatus = async (req, res) => {
    try {
        const caseItem = await Case.findByPk(req.params.id);
        if (!caseItem) return res.status(404).json({ message: "Case not found" });
        const { status } = req.body;
        await caseItem.update({ status });
        return res.json(caseItem);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// GET /api/cases/:id/hearings	Lists all hearings for a case
export const getCaseHearings = async (req, res) => {
    try {      
        const caseItem = await Case.findByPk(req.params.id, {
            include: [{ model: Hearing, as: 'hearings' }]
        });
        if (!caseItem) return res.status(404).json({ message: "Case not found" });
        return res.json(caseItem.hearings);
    } catch (error) {
        return res.status(500).json({ message: error.message });    

    }
};