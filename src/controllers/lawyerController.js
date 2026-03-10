import Lawyer from "../models/Lawyer.js";
import bcrypt from "bcrypt";
import { HTTP, ERR } from "../constants/errorCodes.js";
import { ROLES } from "../constants/index.js";



// Get all lawyers
// @route   GET /api/lawyers
export const getAllLawyers = async (req, res, next) => { 
    try {

        let whereClause = {};

        // If the user is not a senior partner, they can only see themselves
        if (req.user.role !== ROLES.SENIOR_PARTNER) {
            whereClause.is_active = true; // Only show active lawyers
        }

        const lawyers = await Lawyer.findAll({
            where: whereClause,
            order: [['full_name', 'ASC']],

        });


        res.status(HTTP.OK).json({
            success: true,
            count: lawyers.length,
            data: lawyers
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

        // Check if lawyer exists and if the user has permission to view it
        if(!lawyer) {
            return res.status(HTTP.NOT_FOUND).json({
                success: false,
                message: 'Lawyer not found'
            });
        }
        //  Senior partners can see all lawyers, others can only see active lawyers
        if (!lawyer.is_active && req.user.role !== ROLES.SENIOR_PARTNER) {
            return res.status(HTTP.FORBIDDEN).json({
                success: false,
                message: 'You are not authorized to view this lawyer'
            });
        }

        res.status(HTTP.OK).json({
            success: true,
            data: lawyer
        });
        

    } catch (error) {
        next(error);
    }
}



// Create a new lawyer
// @route   POST /api/lawyers
export const createLawyer = async (req, res, next) => {
    try {
        const { full_name, email, password, role, phone, speciality } = req.body;


        const existingLawyer = await Lawyer.findOne({ where: { email } });

        // Check if lawyer with the same email already exists
        if (existingLawyer) {
            return res.status(HTTP.CONFLICT).json({
                success: false,
                message: 'Lawyer with this email already exists'
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newLawyer = await Lawyer.create({
          full_name,
          email,
          password: hashedPassword,
          role,
          phone,
          speciality,
          is_active: true
        });

        res.status(HTTP.CREATED).json({
            success: true,
            message: 'Lawyer created successfully',
            data: newLawyer
        });

    } catch (error) {
        next(error);
    }
};
 


// Update a lawyer
// @route   PUT /api/lawyers/:id

export const updateLawyer = async (req, res, next) => { 
    try {
        // Find the lawyer by ID
        const { id } = req.params;
        const lawyer = await Lawyer.findByPk(id);

        if (!lawyer) { 
            return res.status(HTTP.NOT_FOUND).json({
                success: false,
                message: 'Lawyer not found'
            });
        }

        // Update the lawyer's fields except password

        const { full_name, role, phone, speciality } = req.body;

        // handle update and if the field is not provided, keep the existing value
        await lawyer.update({
            full_name: full_name || lawyer.full_name,
            role: role || lawyer.role,
            phone: phone !== undefined ? phone : lawyer.phone,
            speciality: speciality || lawyer.speciality
        });

        


        res.status(HTTP.OK).json({
            success: true,
            message: 'Lawyer updated successfully',
            data: lawyer
        });

    } catch (error) {
        next(error);
    }
}


// Deactivate a lawyer
// @route   PATCH /api/lawyers/:id/deactivate
// @access  Private (Senior Partner only)

export const deactivateLawyer = async (req, res, next) => { 

    try {
      // Find the lawyer by ID
      const { id } = req.params;

      // Prevent lawyers from deactivating themselves
      if (id === req.user.id) {
        return res.status(HTTP.BAD_REQUEST).json({
          success: false,
          message: "You cannot deactivate your own account",
        });
      }

      const lawyer = await Lawyer.findByPk(id);

      // Check if lawyer exists
      if (!lawyer) {
        return res.status(HTTP.NOT_FOUND).json({
          success: false,
          message: "Lawyer not found",
        });
      }

      // Check if already inactive
      if (!lawyer.is_active) {
        return res.status(HTTP.BAD_REQUEST).json({
          success: false,
          message: "Lawyer is already deactivated",
        });
      }

      // Set is_active to false to deactivate the lawyer
      await lawyer.update({ is_active: false });

      res.status(HTTP.OK).json({
        success: true,
        message: "Lawyer deactivated successfully",
      });
    } catch (error) {
        next(error);
    }
}


export const reactivateLawyer = async (req, res, next) => { 
    try {
        const { id } = req.params;
        const lawyer = await Lawyer.findByPk(id);

        // Check if lawyer exists
        if (!lawyer) { 
            return res.status(HTTP.NOT_FOUND).json({
                success: false,
                message: 'Lawyer not found'
            });
        }

        // Check if already active
        if (lawyer.is_active) { 
            return res.status(HTTP.BAD_REQUEST).json({
                success: false,
                message: 'Lawyer is already active'
            });
        }

        // Set is_active to true to reactivate the lawyer
        await lawyer.update({ is_active: true });
        res.status(HTTP.OK).json({
            success: true,
            message: 'Lawyer reactivated successfully',
            data: lawyer
        });
    } catch (error) {
        next(error);
    }
}


