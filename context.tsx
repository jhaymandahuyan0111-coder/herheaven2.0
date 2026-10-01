import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Page, User, Room, Bed, Lease, Bill, Request, Booking, Toast } from './types';
import { initialUsers, initialRooms, initialBeds, initialLeases, initialBills, initialRequests, initialBookings } from './data';

interface AppContextType {
  page: Page;
  setPage: (p: Page) => void;
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  beds: Bed[];
  setBeds: React.Dispatch<React.SetStateAction<Bed[]>>;
  leases: Lease[];
  setLeases: React.Dispatch<React.SetStateAction<Lease[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  requests: Request[];
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [leases, setLeases] = useState<Lease[]>(initialLeases);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setPage('home');
  }, []);

  return (
    <AppContext.Provider value={{
      page, setPage, currentUser, setCurrentUser,
      users, setUsers, rooms, setRooms, beds, setBeds,
      leases, setLeases, bills, setBills, requests, setRequests,
      bookings, setBookings, toasts, addToast, removeToast, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
