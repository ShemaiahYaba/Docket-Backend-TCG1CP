/**
 * Domain type constants — single source of truth for all ENUM values.
 * Use these in models, validators, and business logic instead of raw strings.
 */

const ROLES = {
  SENIOR_PARTNER: "senior_partner",
  ASSOCIATE: "associate",
  SECRETARY: "secretary",
};

const CASE_STATUS = {
  ACTIVE: "Active",
  PENDING: "Pending",
  IN_REVIEW: "In Review",
  URGENT: "Urgent",
  CLOSED: "Closed",
};

const CASE_TYPE = {
  CIVIL: "Civil",
  CRIMINAL: "Criminal",
  CORPORATE: "Corporate",
  FAMILY: "Family",
  PROPERTY: "Property",
};

const CLIENT_TYPE = {
  INDIVIDUAL: "individual",
  CORPORATE: "corporate",
};

const URGENCY = {
  RED: "red",
  ORANGE: "orange",
  GREEN: "green",
};

export { ROLES, CASE_STATUS, CASE_TYPE, CLIENT_TYPE, URGENCY };
