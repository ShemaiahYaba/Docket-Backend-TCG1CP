'use strict';

// Lawyer IDs from seeder 1
const SENIOR   = '550e8400-e29b-41d4-a716-446655440001';
const ASSOC_1  = '550e8400-e29b-41d4-a716-446655440002';
const ASSOC_2  = '550e8400-e29b-41d4-a716-446655440003';
const ASSOC_3  = '550e8400-e29b-41d4-a716-446655440004';

// Client IDs from seeder 2
const C1  = '660f9500-f39c-42e5-b827-557766550001';
const C2  = '660f9500-f39c-42e5-b827-557766550002';
const C3  = '660f9500-f39c-42e5-b827-557766550003';
const C4  = '660f9500-f39c-42e5-b827-557766550004';
const C5  = '660f9500-f39c-42e5-b827-557766550005';
const C6  = '660f9500-f39c-42e5-b827-557766550006';
const C7  = '660f9500-f39c-42e5-b827-557766550007';
const C8  = '660f9500-f39c-42e5-b827-557766550008';
const C9  = '660f9500-f39c-42e5-b827-557766550009';
const C10 = '660f9500-f39c-42e5-b827-557766550010';

// 18 cases — all statuses (Active×5, Pending×4, In Review×3, Urgent×3, Closed×3)
// All case types covered, some unassigned (lawyer_id null)
const CASES = [
  // Active (5)
  { id: 'SLT-001', title: 'Obiageli Ventures Corporate Restructuring',        case_type: 'Corporate', status: 'Active',    client_id: C1,  lawyer_id: ASSOC_1, filed_date: '2026-01-10', closed_date: null },
  { id: 'SLT-002', title: 'Marcus Johnson v. Employer — Wrongful Dismissal',  case_type: 'Civil',     status: 'Active',    client_id: C2,  lawyer_id: ASSOC_2, filed_date: '2026-01-15', closed_date: null },
  { id: 'SLT-003', title: 'TechBridge Nigeria IP Dispute',                    case_type: 'Corporate', status: 'Active',    client_id: C3,  lawyer_id: ASSOC_3, filed_date: '2026-01-20', closed_date: null },
  { id: 'SLT-004', title: 'Amaka Osei Divorce Proceedings',                   case_type: 'Family',    status: 'Active',    client_id: C4,  lawyer_id: ASSOC_1, filed_date: '2026-02-01', closed_date: null },
  { id: 'SLT-005', title: 'Zenith Properties Land Acquisition',               case_type: 'Property',  status: 'Active',    client_id: C5,  lawyer_id: SENIOR,  filed_date: '2026-02-05', closed_date: null },

  // Pending (4)
  { id: 'SLT-006', title: 'David Ike Road Traffic Offence',                   case_type: 'Criminal',  status: 'Pending',   client_id: C6,  lawyer_id: ASSOC_2, filed_date: '2026-02-10', closed_date: null },
  { id: 'SLT-007', title: 'Sunrise Logistics Contract Breach',                case_type: 'Corporate', status: 'Pending',   client_id: C7,  lawyer_id: null,    filed_date: '2026-02-12', closed_date: null },
  { id: 'SLT-008', title: 'Chisom Nwachukwu Child Custody',                   case_type: 'Family',    status: 'Pending',   client_id: C8,  lawyer_id: null,    filed_date: '2026-02-18', closed_date: null },
  { id: 'SLT-009', title: 'Continental Foods Regulatory Compliance',          case_type: 'Corporate', status: 'Pending',   client_id: C9,  lawyer_id: null,    filed_date: '2026-02-20', closed_date: null },

  // In Review (3)
  { id: 'SLT-010', title: 'Babatunde Adeleke Property Dispute',               case_type: 'Property',  status: 'In Review', client_id: C10, lawyer_id: ASSOC_3, filed_date: '2026-02-22', closed_date: null },
  { id: 'SLT-011', title: 'Obiageli Ventures Employment Tribunal',            case_type: 'Civil',     status: 'In Review', client_id: C1,  lawyer_id: ASSOC_1, filed_date: '2026-02-25', closed_date: null },
  { id: 'SLT-012', title: 'TechBridge Nigeria Software Licensing Dispute',    case_type: 'Corporate', status: 'In Review', client_id: C3,  lawyer_id: SENIOR,  filed_date: '2026-03-01', closed_date: null },

  // Urgent (3)
  { id: 'SLT-013', title: 'Zenith Properties Emergency Injunction',           case_type: 'Property',  status: 'Urgent',    client_id: C5,  lawyer_id: SENIOR,  filed_date: '2026-03-03', closed_date: null },
  { id: 'SLT-014', title: 'David Ike Assault Charge — Bail Application',      case_type: 'Criminal',  status: 'Urgent',    client_id: C6,  lawyer_id: ASSOC_2, filed_date: '2026-03-05', closed_date: null },
  { id: 'SLT-015', title: 'Sunrise Logistics Urgent Debt Recovery',           case_type: 'Civil',     status: 'Urgent',    client_id: C7,  lawyer_id: ASSOC_3, filed_date: '2026-03-07', closed_date: null },

  // Closed (3)
  { id: 'SLT-016', title: 'Marcus Johnson Personal Injury — Settled',         case_type: 'Civil',     status: 'Closed',    client_id: C2,  lawyer_id: ASSOC_1, filed_date: '2025-10-01', closed_date: '2026-01-30' },
  { id: 'SLT-017', title: 'Amaka Osei Estate Administration — Completed',     case_type: 'Family',    status: 'Closed',    client_id: C4,  lawyer_id: ASSOC_2, filed_date: '2025-11-01', closed_date: '2026-02-14' },
  { id: 'SLT-018', title: 'Continental Foods Contract Dispute — Resolved',    case_type: 'Corporate', status: 'Closed',    client_id: C9,  lawyer_id: SENIOR,  filed_date: '2025-12-01', closed_date: '2026-03-01' },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const records = CASES.map((c) => ({
      ...c,
      description: null,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('cases', records, { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('cases', null, {});
  },
};
