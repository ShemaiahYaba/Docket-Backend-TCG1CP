'use strict';

const bcrypt = require('bcrypt');

// Hardcoded UUIDs — deterministic across every fresh seed run
const LAWYERS = [
  { id: '550e8400-e29b-41d4-a716-446655440001', full_name: 'Adaeze Okonkwo',  email: 'senior@docket.com',     role: 'senior_partner', specialty: 'Corporate Law', phone: '+2348011111111' },
  { id: '550e8400-e29b-41d4-a716-446655440002', full_name: 'Emeka Nwosu',      email: 'associate@docket.com',  role: 'associate',      specialty: 'Criminal Law',  phone: '+2348022222222' },
  { id: '550e8400-e29b-41d4-a716-446655440003', full_name: 'Fatima Bello',     email: 'associate2@docket.com', role: 'associate',      specialty: 'Family Law',    phone: '+2348033333333' },
  { id: '550e8400-e29b-41d4-a716-446655440004', full_name: 'Chidi Obi',        email: 'associate3@docket.com', role: 'associate',      specialty: 'Civil Law',     phone: '+2348044444444' },
  { id: '550e8400-e29b-41d4-a716-446655440005', full_name: 'Ngozi Eze',        email: 'secretary@docket.com',  role: 'secretary',      specialty: null,            phone: '+2348055555555' },
  { id: '550e8400-e29b-41d4-a716-446655440006', full_name: 'Tunde Alabi',      email: 'secretary2@docket.com', role: 'secretary',      specialty: null,            phone: '+2348066666666' },
];

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const now = new Date();

    const records = LAWYERS.map((l) => ({
      ...l,
      password:   hashedPassword,
      is_active:  true,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('lawyers', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('lawyers', null, {});
  },
};
