'use strict';

const CLIENTS = [
  { id: '660f9500-f39c-42e5-b827-557766550001', full_name: 'Obiageli Ventures Ltd',  email: 'obiageli@ventures.com',   phone: '+2348012345678', address: '14 Broad Street, Lagos',         client_type: 'corporate'  },
  { id: '660f9500-f39c-42e5-b827-557766550002', full_name: 'Marcus Johnson',          email: 'marcus.j@gmail.com',       phone: '+2348023456789', address: '7 Awolowo Road, Ikoyi',          client_type: 'individual' },
  { id: '660f9500-f39c-42e5-b827-557766550003', full_name: 'TechBridge Nigeria',      email: 'info@techbridge.ng',        phone: '+2348034567890', address: '23 Adeola Odeku, Victoria Island', client_type: 'corporate'  },
  { id: '660f9500-f39c-42e5-b827-557766550004', full_name: 'Amaka Osei',              email: 'amaka.osei@yahoo.com',      phone: '+2348045678901', address: '5 Ogun Street, Surulere',        client_type: 'individual' },
  { id: '660f9500-f39c-42e5-b827-557766550005', full_name: 'Zenith Properties Ltd',   email: 'legal@zenithprop.com',      phone: '+2348056789012', address: '1 Zenith House, Lekki Phase 1',  client_type: 'corporate'  },
  { id: '660f9500-f39c-42e5-b827-557766550006', full_name: 'David Ike',               email: 'david.ike@gmail.com',       phone: '+2348067890123', address: '18 Palm Avenue, Mushin',         client_type: 'individual' },
  { id: '660f9500-f39c-42e5-b827-557766550007', full_name: 'Sunrise Logistics',       email: 'ops@sunriselog.ng',          phone: '+2348078901234', address: '9 Apapa Road, Lagos',            client_type: 'corporate'  },
  { id: '660f9500-f39c-42e5-b827-557766550008', full_name: 'Chisom Nwachukwu',        email: 'chisom.n@hotmail.com',      phone: '+2348089012345', address: '31 Enugu Road, Ikeja',           client_type: 'individual' },
  { id: '660f9500-f39c-42e5-b827-557766550009', full_name: 'Continental Foods Ltd',   email: 'legal@contfoods.com',       phone: '+2348090123456', address: '3 Industrial Estate, Ogba',      client_type: 'corporate'  },
  { id: '660f9500-f39c-42e5-b827-557766550010', full_name: 'Babatunde Adeleke',       email: 'baba.adeleke@gmail.com',    phone: '+2348001234567', address: '12 Bode Thomas Street, Surulere', client_type: 'individual' },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const records = CLIENTS.map((c) => ({
      ...c,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('clients', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clients', null, {});
  },
};
