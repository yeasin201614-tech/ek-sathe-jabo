export type UserRole = 'passenger' | 'operator' | 'admin';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  operatorId?: string; // If role is operator
  photoURL?: string;
  preferredLanguage?: 'en' | 'bn';
  createdAt: string;
  updatedAt: string;
}

export interface Operator {
  id: string;
  operatorName: string;
  slug: string;
  logoURL: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  status: 'active' | 'suspended' | 'pending';
  rating: number;
  busCategories: string[];
  popularRoutes: string[];
  createdAt: string;
}

export interface Bus {
  id: string;
  operatorId: string;
  operatorName: string;
  busName: string;
  registrationNumber: string;
  busType: 'AC' | 'Non-AC';
  category: 'Business Class' | 'Sleeper Coach' | 'Executive Chair' | 'Economy Seater';
  seatLayout: '2x2' | '2x1';
  totalSeats: number;
  amenities: string[];
  status: 'active' | 'maintenance';
  createdAt: string;
}

export interface RouteItem {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  durationFormatted: string;
  boardingPoints: string[];
  droppingPoints: string[];
  baseFare: number;
  status: 'active' | 'inactive';
}

export type SeatStatus = 'available' | 'selected' | 'booked' | 'reserved' | 'ladies';

export interface SeatInventoryItem {
  seatNumber: string;
  status: SeatStatus;
  genderPref?: 'male' | 'female' | 'any';
  price: number;
  deck?: 'lower' | 'upper';
  heldBy?: string;
  holdExpiresAt?: number;
}

export interface Trip {
  id: string;
  busId: string;
  operatorId: string;
  operatorName: string;
  operatorLogo?: string;
  routeId: string;
  origin: string;
  destination: string;
  journeyDate: string; // YYYY-MM-DD
  departureTime: string; // e.g. "07:30 AM"
  arrivalTime: string; // e.g. "01:30 PM"
  durationFormatted: string;
  busName: string;
  busType: 'AC' | 'Non-AC';
  category: 'Business Class' | 'Sleeper Coach' | 'Executive Chair' | 'Economy Seater';
  fare: number;
  seatInventory: Record<string, SeatInventoryItem>;
  availableSeatCount: number;
  totalSeats: number;
  amenities: string[];
  boardingPoints: string[];
  droppingPoints: string[];
  status: 'scheduled' | 'running' | 'completed' | 'cancelled';
  rating: number;
  createdAt: string;
}

export interface SeatHold {
  id: string;
  tripId: string;
  seatNumbers: string[];
  userId: string;
  userSession: string;
  expiresAt: number; // Unix timestamp in ms
  status: 'active' | 'expired' | 'converted' | 'released';
}

export interface PassengerInfo {
  seatNumber: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age?: number;
  checkedIn?: boolean;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. ESJ-2026-X9K4
  userId: string;
  tripId: string;
  operatorId: string;
  operatorName: string;
  busName: string;
  busType: 'AC' | 'Non-AC';
  category: string;
  origin: string;
  destination: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  boardingPoint: string;
  droppingPoint: string;
  passengerDetails: PassengerInfo[];
  primaryContact: {
    fullName: string;
    mobile: string;
    email: string;
    emergencyContact?: string;
  };
  selectedSeats: string[];
  seatCount: number;
  subtotal: number;
  seatCharge: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentStatus: 'UNPAID' | 'VERIFIED' | 'FAILED' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  qrCodeToken: string;
  paymentId?: string;
  transactionReference?: string;
  paymentMethod?: 'bkash' | 'nagad' | 'rocket' | 'card' | 'demo';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingReference: string;
  userId: string;
  provider: 'bkash' | 'nagad' | 'rocket' | 'card' | 'demo';
  amount: number;
  currency: 'BDT';
  transactionReference: string;
  accountNumber?: string;
  paymentStatus: 'VERIFIED' | 'FAILED' | 'PENDING' | 'REFUNDED';
  verifiedAt: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumPurchase: number;
  maximumDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  active: boolean;
  description: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookingReference?: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system' | 'offer';
  read: boolean;
  createdAt: string;
}

export interface SearchQueryParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers?: number;
}
