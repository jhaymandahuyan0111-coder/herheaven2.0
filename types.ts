export type Page =
  | 'home'
  | 'select-role'
  | 'admin-login'
  | 'resident-login'
  | 'resident-signup'
  | 'admin-dashboard'
  | 'staff-dashboard'
  | 'resident-dashboard'
  | 'goodbye';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'staff' | 'resident';
  email?: string;
  alias?: string;
  contact?: string;
  active?: boolean;
}

export interface Room {
  id: string;
  number: string;
  capacity: number;
  rentPerBed: number;
  category: string;
}

export interface Bed {
  id: string;
  roomId: string;
  label: string;
  status: 'available' | 'occupied';
  residentId?: string;
}

export interface Lease {
  id: string;
  residentId: string;
  bedId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'terminated';
}

export interface Bill {
  id: string;
  residentId: string;
  roomId: string;
  bedId: string;
  billingPeriod: string;
  amount: number;
  status: 'paid' | 'unpaid';
  essentialBills: string;
  utilityConsumption?: string;
}

export interface Request {
  id: string;
  residentId: string;
  type: 'room-related' | 'general';
  description: string;
  status: 'pending' | 'responded';
  response?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  residentId: string;
  bedId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'cancelled';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
