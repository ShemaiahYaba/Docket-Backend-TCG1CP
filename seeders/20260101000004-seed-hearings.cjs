'use strict';

// Lawyer IDs from seeder 1
const SENIOR  = '550e8400-e29b-41d4-a716-446655440001';
const ASSOC_1 = '550e8400-e29b-41d4-a716-446655440002';
const ASSOC_2 = '550e8400-e29b-41d4-a716-446655440003';
const ASSOC_3 = '550e8400-e29b-41d4-a716-446655440004';

// Hearings only on non-closed cases (SLT-001 through SLT-015)
// Urgency is computed at query time — seeder sets dates to produce all 3 bands:
//   Red   (≤ 3 days from 2026-03-12): 2026-03-13, 2026-03-14, 2026-03-15
//   Orange(≤ 7 days from 2026-03-12): 2026-03-16, 2026-03-17, 2026-03-18, 2026-03-19
//   Green (> 7 days from 2026-03-12): 2026-03-20 and beyond

const HEARINGS = [
  // ── Red band (3 hearings) ──────────────────────────────────────────────────
  {
    id: '770e0400-039d-43f6-9938-668877660001',
    case_id: 'SLT-013', hearing_date: '2026-03-13', hearing_time: '09:00',
    court_name: 'Lagos High Court — Court 3', notes: 'Emergency injunction hearing', outcome: null,
    created_by: SENIOR,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660002',
    case_id: 'SLT-014', hearing_date: '2026-03-14', hearing_time: '10:30',
    court_name: 'Lagos Magistrate Court — Court 7', notes: 'Bail application hearing', outcome: null,
    created_by: ASSOC_2,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660003',
    case_id: 'SLT-015', hearing_date: '2026-03-15', hearing_time: '14:00',
    court_name: 'Federal High Court — Court 1', notes: 'Debt recovery preliminary', outcome: null,
    created_by: ASSOC_3,
  },

  // ── Orange band (4 hearings) ──────────────────────────────────────────────
  {
    id: '770e0400-039d-43f6-9938-668877660004',
    case_id: 'SLT-001', hearing_date: '2026-03-16', hearing_time: '09:00',
    court_name: 'Federal High Court — Court 5', notes: 'Document review session', outcome: null,
    created_by: ASSOC_1,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660005',
    case_id: 'SLT-005', hearing_date: '2026-03-17', hearing_time: '11:00',
    court_name: 'Lagos Land Tribunal', notes: 'Land title verification', outcome: null,
    created_by: SENIOR,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660006',
    case_id: 'SLT-010', hearing_date: '2026-03-18', hearing_time: '14:30',
    court_name: 'Abuja High Court — Court 2', notes: 'Property boundary dispute review', outcome: null,
    created_by: ASSOC_3,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660007',
    case_id: 'SLT-012', hearing_date: '2026-03-19', hearing_time: '10:00',
    court_name: 'Federal High Court — Court 9', notes: 'Software licensing hearing', outcome: null,
    created_by: SENIOR,
  },

  // ── Green band (5 hearings) ───────────────────────────────────────────────
  {
    id: '770e0400-039d-43f6-9938-668877660008',
    case_id: 'SLT-002', hearing_date: '2026-03-25', hearing_time: '09:30',
    court_name: 'National Industrial Court', notes: 'Wrongful dismissal main hearing', outcome: null,
    created_by: ASSOC_2,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660009',
    case_id: 'SLT-003', hearing_date: '2026-03-28', hearing_time: '11:00',
    court_name: 'Federal High Court — Court 4', notes: 'IP dispute preliminary injunction', outcome: null,
    created_by: ASSOC_3,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660010',
    case_id: 'SLT-004', hearing_date: '2026-04-02', hearing_time: '09:00',
    court_name: 'Lagos High Court — Family Division', notes: 'Divorce mediation session', outcome: null,
    created_by: ASSOC_1,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660011',
    case_id: 'SLT-011', hearing_date: '2026-04-07', hearing_time: '14:00',
    court_name: 'National Industrial Court', notes: 'Employment tribunal main sitting', outcome: null,
    created_by: ASSOC_1,
  },
  {
    id: '770e0400-039d-43f6-9938-668877660012',
    case_id: 'SLT-006', hearing_date: '2026-04-10', hearing_time: '10:00',
    court_name: 'Lagos Magistrate Court — Court 2', notes: 'Traffic offence plea', outcome: null,
    created_by: ASSOC_2,
  },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const records = HEARINGS.map((h) => ({
      ...h,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('hearings', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('hearings', null, {});
  },
};
