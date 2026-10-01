import type { User, Room, Bed, Lease, Bill, Request, Booking } from './types';

export const initialUsers: User[] = [
  { id: 'admin-1', username: 'admin', password: 'admin123', name: 'HiveStay Admin', role: 'admin', email: 'admin@hivestay.com', active: true },
  { id: 'staff-1', username: 'staff1', password: 'staff123', name: 'Anna Cruz', role: 'staff', email: 'anna.cruz@hivestay.com', alias: 'acruz', contact: '09171234567', active: true },
  { id: 'staff-2', username: 'staff2', password: 'staff456', name: 'Ben Santos', role: 'staff', email: 'ben.santos@hivestay.com', alias: 'bsantos', contact: '09187654321', active: true },
  { id: 'staff-3', username: 'staff3', password: 'staff789', name: 'Clara Reyes', role: 'staff', email: 'clara.reyes@hivestay.com', alias: 'creyes', contact: '09199876543', active: false },
  { id: 'res-1', username: 'maria_s', password: 'res123', name: 'Maria Santos', role: 'resident', email: 'maria@gmail.com', active: true },
  { id: 'res-2', username: 'juan_d', password: 'res456', name: 'Juan Dela Cruz', role: 'resident', email: 'juan@gmail.com', active: true },
  { id: 'res-3', username: 'ana_r', password: 'res789', name: 'Ana Reyes', role: 'resident', email: 'ana@gmail.com', active: true },
  { id: 'res-4', username: 'pedro_g', password: 'res000', name: 'Pedro Garcia', role: 'resident', email: 'pedro@gmail.com', active: true },
];

export const initialRooms: Room[] = [
  { id: 'room-1', number: '101', capacity: 4, rentPerBed: 3500, category: 'Standard' },
  { id: 'room-2', number: '102', capacity: 4, rentPerBed: 3500, category: 'Standard' },
  { id: 'room-3', number: '201', capacity: 2, rentPerBed: 5500, category: 'Premium' },
  { id: 'room-4', number: '202', capacity: 2, rentPerBed: 5500, category: 'Premium' },
  { id: 'room-5', number: '301', capacity: 1, rentPerBed: 7500, category: 'Studio' },
];

export const initialBeds: Bed[] = [
  { id: 'bed-1', roomId: 'room-1', label: '101-A', status: 'occupied', residentId: 'res-1' },
  { id: 'bed-2', roomId: 'room-1', label: '101-B', status: 'available' },
  { id: 'bed-3', roomId: 'room-1', label: '101-C', status: 'available' },
  { id: 'bed-4', roomId: 'room-1', label: '101-D', status: 'available' },
  { id: 'bed-5', roomId: 'room-2', label: '102-A', status: 'occupied', residentId: 'res-2' },
  { id: 'bed-6', roomId: 'room-2', label: '102-B', status: 'available' },
  { id: 'bed-7', roomId: 'room-2', label: '102-C', status: 'available' },
  { id: 'bed-8', roomId: 'room-2', label: '102-D', status: 'occupied', residentId: 'res-3' },
  { id: 'bed-9', roomId: 'room-3', label: '201-A', status: 'available' },
  { id: 'bed-10', roomId: 'room-3', label: '201-B', status: 'available' },
  { id: 'bed-11', roomId: 'room-4', label: '202-A', status: 'available' },
  { id: 'bed-12', roomId: 'room-4', label: '202-B', status: 'occupied', residentId: 'res-4' },
  { id: 'bed-13', roomId: 'room-5', label: '301-A', status: 'available' },
];

export const initialLeases: Lease[] = [
  { id: 'lease-1', residentId: 'res-1', bedId: 'bed-1', roomId: 'room-1', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
  { id: 'lease-2', residentId: 'res-2', bedId: 'bed-5', roomId: 'room-2', startDate: '2024-02-01', endDate: '2024-12-31', status: 'active' },
  { id: 'lease-3', residentId: 'res-3', bedId: 'bed-8', roomId: 'room-2', startDate: '2024-03-01', endDate: '2024-12-31', status: 'active' },
  { id: 'lease-4', residentId: 'res-4', bedId: 'bed-12', roomId: 'room-4', startDate: '2024-04-01', endDate: '2024-12-31', status: 'active' },
];

export const initialBills: Bill[] = [
  { id: 'bill-1', residentId: 'res-1', roomId: 'room-1', bedId: 'bed-1', billingPeriod: 'January 2024', amount: 4200, status: 'paid', essentialBills: 'Electricity: ₱500, Water: ₱200', utilityConsumption: '45 kWh' },
  { id: 'bill-2', residentId: 'res-1', roomId: 'room-1', bedId: 'bed-1', billingPeriod: 'February 2024', amount: 4400, status: 'unpaid', essentialBills: 'Electricity: ₱650, Water: ₱250', utilityConsumption: '52 kWh' },
  { id: 'bill-3', residentId: 'res-2', roomId: 'room-2', bedId: 'bed-5', billingPeriod: 'January 2024', amount: 4130, status: 'paid', essentialBills: 'Electricity: ₱450, Water: ₱180', utilityConsumption: '38 kWh' },
  { id: 'bill-4', residentId: 'res-2', roomId: 'room-2', bedId: 'bed-5', billingPeriod: 'February 2024', amount: 4230, status: 'unpaid', essentialBills: 'Electricity: ₱530, Water: ₱200', utilityConsumption: '43 kWh' },
  { id: 'bill-5', residentId: 'res-3', roomId: 'room-2', bedId: 'bed-8', billingPeriod: 'January 2024', amount: 4230, status: 'unpaid', essentialBills: 'Electricity: ₱520, Water: ₱210', utilityConsumption: '41 kWh' },
  { id: 'bill-6', residentId: 'res-4', roomId: 'room-4', bedId: 'bed-12', billingPeriod: 'January 2024', amount: 6180, status: 'paid', essentialBills: 'Electricity: ₱480, Water: ₱200', utilityConsumption: '39 kWh' },
];

export const initialRequests: Request[] = [
  { id: 'req-1', residentId: 'res-1', type: 'room-related', description: 'Air conditioning unit in Room 101 is not cooling properly.', status: 'pending', createdAt: '2024-02-10' },
  { id: 'req-2', residentId: 'res-2', type: 'general', description: 'Need access card replacement. Lost mine at the cafeteria.', status: 'responded', response: 'Please come to the admin office Monday 9AM–12PM with valid ID.', createdAt: '2024-02-08' },
  { id: 'req-3', residentId: 'res-3', type: 'room-related', description: 'Bathroom faucet is leaking in Room 102.', status: 'pending', createdAt: '2024-02-12' },
];

export const initialBookings: Booking[] = [
  { id: 'booking-1', residentId: 'res-1', bedId: 'bed-1', roomId: 'room-1', startDate: '2024-01-01', endDate: '2024-12-31', status: 'confirmed' },
  { id: 'booking-2', residentId: 'res-2', bedId: 'bed-5', roomId: 'room-2', startDate: '2024-02-01', endDate: '2024-12-31', status: 'confirmed' },
  { id: 'booking-3', residentId: 'res-3', bedId: 'bed-8', roomId: 'room-2', startDate: '2024-03-01', endDate: '2024-12-31', status: 'confirmed' },
  { id: 'booking-4', residentId: 'res-4', bedId: 'bed-12', roomId: 'room-4', startDate: '2024-04-01', endDate: '2024-12-31', status: 'confirmed' },
];
