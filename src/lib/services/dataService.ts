import {
  Trip,
  Operator,
  Bus,
  RouteItem,
  Booking,
  PaymentTransaction,
  Coupon,
  SupportTicket,
  SeatHold,
  SeatInventoryItem,
  PassengerInfo
} from '@/types';
import {
  INITIAL_OPERATORS,
  INITIAL_ROUTES,
  INITIAL_BUSES,
  INITIAL_COUPONS,
  generateSampleTrips,
  generateInitialSeats
} from '@/lib/data/mockData';

// Storage keys
const STORAGE_KEYS = {
  TRIPS: 'esj_trips',
  OPERATORS: 'esj_operators',
  ROUTES: 'esj_routes',
  BUSES: 'esj_buses',
  BOOKINGS: 'esj_bookings',
  PAYMENTS: 'esj_payments',
  COUPONS: 'esj_coupons',
  HOLDS: 'esj_seat_holds',
  TICKETS: 'esj_support_tickets',
  USER: 'esj_current_user',
};

// In-memory cache when running in SSR or when LocalStorage is empty
let memoryTrips: Trip[] = [];
let memoryOperators: Operator[] = [...INITIAL_OPERATORS];
let memoryRoutes: RouteItem[] = [...INITIAL_ROUTES];
let memoryBuses: Bus[] = [...INITIAL_BUSES];
let memoryBookings: Booking[] = [];
let memoryPayments: PaymentTransaction[] = [];
let memoryCoupons: Coupon[] = [...INITIAL_COUPONS];
let memoryHolds: SeatHold[] = [];
let memoryTickets: SupportTicket[] = [];

// Seed sample initial confirmed bookings
function generateInitialBookings(): Booking[] {
  const sampleRef = 'ESJ-2026-X9K4';
  const today = '2026-11-02';
  return [
    {
      id: 'book-init-1',
      bookingReference: sampleRef,
      userId: 'usr_passenger_demo',
      tripId: 'trip-1',
      operatorId: 'op-greenline',
      operatorName: 'Green Line Paribahan',
      busName: 'MAN Double Decker Multi-Axle AC',
      busType: 'AC',
      category: 'Business Class',
      origin: 'Dhaka',
      destination: 'Chattogram',
      journeyDate: today,
      departureTime: '07:30 AM',
      arrivalTime: '01:00 PM',
      boardingPoint: 'Sayedabad (07:30 AM)',
      droppingPoint: 'Dampara Bus Counter',
      passengerDetails: [
        { seatNumber: 'B3', name: 'Tanvir Hossain', gender: 'male', age: 29, checkedIn: true },
        { seatNumber: 'B4', name: 'Sadia Rahman', gender: 'female', age: 26, checkedIn: false }
      ],
      primaryContact: {
        fullName: 'Tanvir Hossain',
        mobile: '01712345678',
        email: 'passenger@eksathejabo.com',
      },
      selectedSeats: ['B3', 'B4'],
      seatCount: 2,
      subtotal: 2800,
      seatCharge: 100,
      discount: 100,
      couponCode: 'SAVE100',
      totalAmount: 2800,
      paymentStatus: 'VERIFIED',
      bookingStatus: 'CONFIRMED',
      qrCodeToken: `ESJ_VERIFY_TOKEN_X9K4_${Date.now()}`,
      paymentId: 'pay-sample-01',
      transactionReference: 'TRX-BKASH-9X882194',
      paymentMethod: 'bkash',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}

// Initializer helper
function initializeStore() {
  if (typeof window === 'undefined') {
    if (memoryTrips.length === 0) {
      memoryTrips = generateSampleTrips();
      memoryBookings = generateInitialBookings();
    }
    return;
  }

  try {
    // Trips
    const savedTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (savedTrips) {
      memoryTrips = JSON.parse(savedTrips);
    } else {
      memoryTrips = generateSampleTrips();
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(memoryTrips));
    }

    // Operators
    const savedOps = localStorage.getItem(STORAGE_KEYS.OPERATORS);
    if (savedOps) {
      memoryOperators = JSON.parse(savedOps);
    } else {
      localStorage.setItem(STORAGE_KEYS.OPERATORS, JSON.stringify(memoryOperators));
    }

    // Routes
    const savedRoutes = localStorage.getItem(STORAGE_KEYS.ROUTES);
    if (savedRoutes) {
      memoryRoutes = JSON.parse(savedRoutes);
    } else {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(memoryRoutes));
    }

    // Buses
    const savedBuses = localStorage.getItem(STORAGE_KEYS.BUSES);
    if (savedBuses) {
      memoryBuses = JSON.parse(savedBuses);
    } else {
      localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(memoryBuses));
    }

    // Bookings
    const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (savedBookings) {
      memoryBookings = JSON.parse(savedBookings);
    } else {
      memoryBookings = generateInitialBookings();
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(memoryBookings));
    }

    // Payments
    const savedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (savedPayments) {
      memoryPayments = JSON.parse(savedPayments);
    }

    // Coupons
    const savedCoupons = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (savedCoupons) {
      memoryCoupons = JSON.parse(savedCoupons);
    } else {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(memoryCoupons));
    }

    // Holds
    const savedHolds = localStorage.getItem(STORAGE_KEYS.HOLDS);
    if (savedHolds) {
      memoryHolds = JSON.parse(savedHolds);
    }

    // Tickets
    const savedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (savedTickets) {
      memoryTickets = JSON.parse(savedTickets);
    }
  } catch (err) {
    console.error('Storage initialization fallback:', err);
  }
}

// Persist helper
function saveStore(key: string, data: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }
}

export const DataService = {
  // --- TRIPS & SEARCH ---
  getTrips(params?: { from?: string; to?: string; date?: string; busType?: string }): Trip[] {
    initializeStore();
    this.cleanExpiredHoldsAll();

    let list = [...memoryTrips];

    if (params?.from && params.from.trim()) {
      list = list.filter(t => t.origin.toLowerCase().includes(params.from!.toLowerCase().trim()));
    }
    if (params?.to && params.to.trim()) {
      list = list.filter(t => t.destination.toLowerCase().includes(params.to!.toLowerCase().trim()));
    }
    if (params?.date && params.date.trim()) {
      // In demo, if no direct match for that exact date, show trips with adjusted journeyDate or all matching routes
      const exactMatch = list.filter(t => t.journeyDate === params.date);
      if (exactMatch.length > 0) {
        list = exactMatch;
      }
    }
    if (params?.busType && params.busType !== 'all') {
      list = list.filter(t => t.busType.toLowerCase() === params.busType!.toLowerCase());
    }

    return list;
  },

  getTripById(tripId: string): Trip | null {
    initializeStore();
    this.cleanExpiredHolds(tripId);
    return memoryTrips.find(t => t.id === tripId) || null;
  },

  // --- SEAT HOLD LOGIC (CRITICAL CONCURRENCY SAFEGUARD) ---
  createSeatHold(tripId: string, seatNumbers: string[], userId: string, sessionToken: string): { success: boolean; hold?: SeatHold; error?: string } {
    initializeStore();
    this.cleanExpiredHolds(tripId);

    const trip = memoryTrips.find(t => t.id === tripId);
    if (!trip) return { success: false, error: 'Trip not found' };

    // Check if any seat is already booked or held by someone else
    const now = Date.now();
    for (const seatNo of seatNumbers) {
      const seat = trip.seatInventory[seatNo];
      if (!seat) {
        return { success: false, error: `Seat ${seatNo} does not exist.` };
      }
      if (seat.status === 'booked') {
        return { success: false, error: `Seat ${seatNo} has already been booked by another passenger.` };
      }
      if (seat.status === 'reserved' && seat.heldBy && seat.heldBy !== sessionToken && seat.holdExpiresAt && seat.holdExpiresAt > now) {
        return { success: false, error: `Seat ${seatNo} is temporarily reserved by another passenger. Please choose another seat.` };
      }
    }

    // 5-minute hold expiration
    const holdDurationMs = 5 * 60 * 1000;
    const expiresAt = now + holdDurationMs;

    const newHold: SeatHold = {
      id: `hold-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tripId,
      seatNumbers,
      userId,
      userSession: sessionToken,
      expiresAt,
      status: 'active',
    };

    // Update trip seat inventory
    seatNumbers.forEach(seatNo => {
      if (trip.seatInventory[seatNo]) {
        trip.seatInventory[seatNo].status = 'reserved';
        trip.seatInventory[seatNo].heldBy = sessionToken;
        trip.seatInventory[seatNo].holdExpiresAt = expiresAt;
      }
    });

    memoryHolds = memoryHolds.filter(h => h.userSession !== sessionToken || h.tripId !== tripId);
    memoryHolds.push(newHold);

    saveStore(STORAGE_KEYS.HOLDS, memoryHolds);
    saveStore(STORAGE_KEYS.TRIPS, memoryTrips);

    return { success: true, hold: newHold };
  },

  cleanExpiredHolds(tripId: string) {
    const now = Date.now();
    const trip = memoryTrips.find(t => t.id === tripId);
    if (!trip) return;

    let modified = false;
    Object.keys(trip.seatInventory).forEach(seatNo => {
      const seat = trip.seatInventory[seatNo];
      if (seat.status === 'reserved' && seat.holdExpiresAt && seat.holdExpiresAt <= now) {
        seat.status = 'available';
        seat.heldBy = undefined;
        seat.holdExpiresAt = undefined;
        modified = true;
      }
    });

    if (modified) {
      saveStore(STORAGE_KEYS.TRIPS, memoryTrips);
    }
  },

  cleanExpiredHoldsAll() {
    const now = Date.now();
    let modified = false;
    memoryTrips.forEach(trip => {
      Object.keys(trip.seatInventory).forEach(seatNo => {
        const seat = trip.seatInventory[seatNo];
        if (seat.status === 'reserved' && seat.holdExpiresAt && seat.holdExpiresAt <= now) {
          seat.status = 'available';
          seat.heldBy = undefined;
          seat.holdExpiresAt = undefined;
          modified = true;
        }
      });
    });
    if (modified) {
      saveStore(STORAGE_KEYS.TRIPS, memoryTrips);
    }
  },

  releaseSeatHold(holdId: string) {
    initializeStore();
    const hold = memoryHolds.find(h => h.id === holdId);
    if (!hold) return;

    const trip = memoryTrips.find(t => t.id === hold.tripId);
    if (trip) {
      hold.seatNumbers.forEach(s => {
        if (trip.seatInventory[s] && trip.seatInventory[s].status === 'reserved') {
          trip.seatInventory[s].status = 'available';
          trip.seatInventory[s].heldBy = undefined;
          trip.seatInventory[s].holdExpiresAt = undefined;
        }
      });
      saveStore(STORAGE_KEYS.TRIPS, memoryTrips);
    }

    hold.status = 'released';
    saveStore(STORAGE_KEYS.HOLDS, memoryHolds);
  },

  // --- BOOKING CREATION & VALIDATION ---
  createPendingBooking(data: {
    tripId: string;
    userId: string;
    selectedSeats: string[];
    passengerDetails: PassengerInfo[];
    primaryContact: { fullName: string; mobile: string; email: string; emergencyContact?: string };
    boardingPoint: string;
    droppingPoint: string;
    couponCode?: string;
    sessionToken: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    initializeStore();
    const trip = memoryTrips.find(t => t.id === data.tripId);
    if (!trip) return { success: false, error: 'Trip not found' };

    // Validate that seats are still held by this session
    const now = Date.now();
    for (const seatNo of data.selectedSeats) {
      const seat = trip.seatInventory[seatNo];
      if (!seat) return { success: false, error: `Invalid seat ${seatNo}` };
      if (seat.status === 'booked') {
        return { success: false, error: `Seat ${seatNo} has already been purchased.` };
      }
      if (seat.status === 'reserved' && seat.heldBy && seat.heldBy !== data.sessionToken && seat.holdExpiresAt && seat.holdExpiresAt > now) {
        return { success: false, error: `Hold expired or held by another session for seat ${seatNo}.` };
      }
    }

    // Pricing calculation
    const baseFare = trip.fare;
    const seatCount = data.selectedSeats.length;
    const subtotal = baseFare * seatCount;
    const seatCharge = seatCount * 50; // ৳50 reservation/insurance fee per seat
    let discount = 0;

    if (data.couponCode) {
      const couponVal = this.validateCoupon(data.couponCode, subtotal);
      if (couponVal.valid && couponVal.discount) {
        discount = couponVal.discount;
      }
    }

    const totalAmount = Math.max(0, subtotal + seatCharge - discount);
    const bookingRef = `ESJ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;
    const bookingId = `book-${Date.now()}`;
    const qrToken = `ESJ_${bookingRef}_${Date.now()}`;

    const newBooking: Booking = {
      id: bookingId,
      bookingReference: bookingRef,
      userId: data.userId || 'guest_user',
      tripId: trip.id,
      operatorId: trip.operatorId,
      operatorName: trip.operatorName,
      busName: trip.busName,
      busType: trip.busType,
      category: trip.category,
      origin: trip.origin,
      destination: trip.destination,
      journeyDate: trip.journeyDate,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      boardingPoint: data.boardingPoint,
      droppingPoint: data.droppingPoint,
      passengerDetails: data.passengerDetails,
      primaryContact: data.primaryContact,
      selectedSeats: data.selectedSeats,
      seatCount,
      subtotal,
      seatCharge,
      discount,
      couponCode: data.couponCode,
      totalAmount,
      paymentStatus: 'UNPAID',
      bookingStatus: 'PENDING',
      qrCodeToken: qrToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryBookings.unshift(newBooking);
    saveStore(STORAGE_KEYS.BOOKINGS, memoryBookings);

    return { success: true, booking: newBooking };
  },

  // --- PAYMENT CONFIRMATION (IDEMPOTENT & STRICT) ---
  verifyAndConfirmPayment(params: {
    bookingId: string;
    bookingReference: string;
    provider: 'bkash' | 'nagad' | 'rocket' | 'card' | 'demo';
    accountNumber?: string;
    transactionReference: string;
    amount: number;
  }): { success: boolean; booking?: Booking; payment?: PaymentTransaction; error?: string } {
    initializeStore();

    const booking = memoryBookings.find(b => b.id === params.bookingId || b.bookingReference === params.bookingReference);
    if (!booking) return { success: false, error: 'Booking reference not found.' };

    if (booking.paymentStatus === 'VERIFIED' && booking.bookingStatus === 'CONFIRMED') {
      // Idempotent: already confirmed
      return { success: true, booking };
    }

    // Verify amount match
    if (Math.abs(booking.totalAmount - params.amount) > 1) {
      return { success: false, error: 'Payment amount mismatch detected. Transaction rejected.' };
    }

    const trip = memoryTrips.find(t => t.id === booking.tripId);
    if (trip) {
      // Mark seats permanently as booked
      booking.selectedSeats.forEach(seatNo => {
        if (trip.seatInventory[seatNo]) {
          trip.seatInventory[seatNo].status = 'booked';
          trip.seatInventory[seatNo].heldBy = undefined;
          trip.seatInventory[seatNo].holdExpiresAt = undefined;
        }
      });
      // Recalculate available seats
      const bookedCount = Object.values(trip.seatInventory).filter(s => s.status === 'booked').length;
      trip.availableSeatCount = Math.max(0, trip.totalSeats - bookedCount);
      saveStore(STORAGE_KEYS.TRIPS, memoryTrips);
    }

    // Record verified payment
    const paymentId = `pay-${Date.now()}`;
    const paymentRecord: PaymentTransaction = {
      id: paymentId,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      userId: booking.userId,
      provider: params.provider,
      amount: params.amount,
      currency: 'BDT',
      transactionReference: params.transactionReference,
      accountNumber: params.accountNumber ? `${params.accountNumber.slice(0, 3)}****${params.accountNumber.slice(-3)}` : undefined,
      paymentStatus: 'VERIFIED',
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    memoryPayments.unshift(paymentRecord);
    saveStore(STORAGE_KEYS.PAYMENTS, memoryPayments);

    // Update booking status
    booking.paymentStatus = 'VERIFIED';
    booking.bookingStatus = 'CONFIRMED';
    booking.paymentId = paymentId;
    booking.transactionReference = params.transactionReference;
    booking.paymentMethod = params.provider;
    booking.updatedAt = new Date().toISOString();

    // Release any holds
    memoryHolds = memoryHolds.filter(h => h.tripId !== booking.tripId || !h.seatNumbers.some(s => booking.selectedSeats.includes(s)));
    saveStore(STORAGE_KEYS.HOLDS, memoryHolds);
    saveStore(STORAGE_KEYS.BOOKINGS, memoryBookings);

    return { success: true, booking, payment: paymentRecord };
  },

  getBookingByRef(bookingRef: string): Booking | null {
    initializeStore();
    return memoryBookings.find(b => b.bookingReference.toLowerCase() === bookingRef.toLowerCase()) || null;
  },

  getUserBookings(userId: string): Booking[] {
    initializeStore();
    return memoryBookings.filter(b => b.userId === userId || userId === 'all_admin');
  },

  cancelBooking(bookingId: string, reason?: string): { success: boolean; error?: string } {
    initializeStore();
    const booking = memoryBookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    if (booking.bookingStatus === 'CANCELLED') {
      return { success: false, error: 'Booking is already cancelled.' };
    }

    booking.bookingStatus = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    booking.updatedAt = new Date().toISOString();

    // Free up seats in trip
    const trip = memoryTrips.find(t => t.id === booking.tripId);
    if (trip) {
      booking.selectedSeats.forEach(seatNo => {
        if (trip.seatInventory[seatNo]) {
          trip.seatInventory[seatNo].status = 'available';
        }
      });
      const bookedCount = Object.values(trip.seatInventory).filter(s => s.status === 'booked').length;
      trip.availableSeatCount = Math.max(0, trip.totalSeats - bookedCount);
      saveStore(STORAGE_KEYS.TRIPS, memoryTrips);
    }

    saveStore(STORAGE_KEYS.BOOKINGS, memoryBookings);
    return { success: true };
  },

  // --- COUPON VALIDATION ---
  validateCoupon(code: string, subtotal: number): { valid: boolean; discount?: number; message: string; coupon?: Coupon } {
    initializeStore();
    const cleanCode = code.toUpperCase().trim();
    const coupon = memoryCoupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, message: 'Invalid or expired promo coupon code.' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'This coupon has expired.' };
    }

    if (subtotal < coupon.minimumPurchase) {
      return { valid: false, message: `Minimum purchase of ৳${coupon.minimumPurchase} required for this coupon.` };
    }

    let discount = 0;
    if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    }

    return {
      valid: true,
      discount,
      message: `Coupon ${coupon.code} applied! Saved ৳${discount}.`,
      coupon,
    };
  },

  // --- OPERATOR FUNCTIONS ---
  getOperators(): Operator[] {
    initializeStore();
    return memoryOperators;
  },

  getOperatorTrips(operatorId: string): Trip[] {
    initializeStore();
    return memoryTrips.filter(t => t.operatorId === operatorId);
  },

  checkInPassenger(bookingRef: string, seatNumber: string): { success: boolean; error?: string } {
    initializeStore();
    const booking = memoryBookings.find(b => b.bookingReference === bookingRef);
    if (!booking) return { success: false, error: 'Booking not found' };

    const passenger = booking.passengerDetails.find(p => p.seatNumber === seatNumber);
    if (!passenger) return { success: false, error: 'Seat passenger not found' };

    passenger.checkedIn = true;
    saveStore(STORAGE_KEYS.BOOKINGS, memoryBookings);
    return { success: true };
  },

  // --- ADMIN FUNCTIONS ---
  getAdminStats() {
    initializeStore();
    const totalBookings = memoryBookings.length;
    const confirmedBookings = memoryBookings.filter(b => b.bookingStatus === 'CONFIRMED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPassengers = confirmedBookings.reduce((sum, b) => sum + b.seatCount, 0);
    const activeOperators = memoryOperators.filter(o => o.status === 'active').length;
    const upcomingTrips = memoryTrips.length;
    const pendingPayments = memoryBookings.filter(b => b.paymentStatus === 'UNPAID').length;
    const cancellationRequests = memoryBookings.filter(b => b.bookingStatus === 'CANCELLED').length;

    return {
      totalBookings,
      totalRevenue,
      totalPassengers,
      activeOperators,
      upcomingTrips,
      pendingPayments,
      cancellationRequests,
    };
  },

  getAllBookings(): Booking[] {
    initializeStore();
    return memoryBookings;
  },

  getAllRoutes(): RouteItem[] {
    initializeStore();
    return memoryRoutes;
  },

  getAllBuses(): Bus[] {
    initializeStore();
    return memoryBuses;
  },

  getAllCoupons(): Coupon[] {
    initializeStore();
    return memoryCoupons;
  },

  createRoute(route: Omit<RouteItem, 'id'>): RouteItem {
    initializeStore();
    const newRoute: RouteItem = {
      ...route,
      id: `route-${Date.now()}`,
    };
    memoryRoutes.push(newRoute);
    saveStore(STORAGE_KEYS.ROUTES, memoryRoutes);
    return newRoute;
  },

  createBus(bus: Omit<Bus, 'id' | 'createdAt'>): Bus {
    initializeStore();
    const newBus: Bus = {
      ...bus,
      id: `bus-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    memoryBuses.push(newBus);
    saveStore(STORAGE_KEYS.BUSES, memoryBuses);
    return newBus;
  },

  createTrip(tripData: {
    busId: string;
    operatorId: string;
    routeId: string;
    journeyDate: string;
    departureTime: string;
    arrivalTime: string;
    fare: number;
  }): Trip {
    initializeStore();
    const op = memoryOperators.find(o => o.id === tripData.operatorId) || memoryOperators[0];
    const bus = memoryBuses.find(b => b.id === tripData.busId) || memoryBuses[0];
    const route = memoryRoutes.find(r => r.id === tripData.routeId) || memoryRoutes[0];

    const seatInventory = generateInitialSeats(bus.seatLayout, bus.totalSeats, tripData.fare);

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      busId: bus.id,
      operatorId: op.id,
      operatorName: op.operatorName,
      operatorLogo: op.logoURL,
      routeId: route.id,
      origin: route.origin,
      destination: route.destination,
      journeyDate: tripData.journeyDate,
      departureTime: tripData.departureTime,
      arrivalTime: tripData.arrivalTime,
      durationFormatted: route.durationFormatted,
      busName: bus.busName,
      busType: bus.busType,
      category: bus.category,
      fare: tripData.fare,
      seatInventory,
      availableSeatCount: bus.totalSeats,
      totalSeats: bus.totalSeats,
      amenities: bus.amenities,
      boardingPoints: route.boardingPoints,
      droppingPoints: route.droppingPoints,
      status: 'scheduled',
      rating: 4.8,
      createdAt: new Date().toISOString(),
    };

    memoryTrips.unshift(newTrip);
    saveStore(STORAGE_KEYS.TRIPS, memoryTrips);
    return newTrip;
  },

  createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    initializeStore();
    const newCoupon: Coupon = {
      ...couponData,
      id: `c-${Date.now()}`,
      usedCount: 0,
    };
    memoryCoupons.push(newCoupon);
    saveStore(STORAGE_KEYS.COUPONS, memoryCoupons);
    return newCoupon;
  },

  toggleCoupon(id: string) {
    initializeStore();
    const c = memoryCoupons.find(item => item.id === id);
    if (c) {
      c.active = !c.active;
      saveStore(STORAGE_KEYS.COUPONS, memoryCoupons);
    }
  },

  // --- SUPPORT TICKETS ---
  getSupportTickets(userId?: string): SupportTicket[] {
    initializeStore();
    if (userId && userId !== 'all_admin') {
      return memoryTickets.filter(t => t.userId === userId);
    }
    return memoryTickets;
  },

  createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>): SupportTicket {
    initializeStore();
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryTickets.unshift(newTicket);
    saveStore(STORAGE_KEYS.TICKETS, memoryTickets);
    return newTicket;
  },

  updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved', reply?: string) {
    initializeStore();
    const ticket = memoryTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      if (reply) ticket.adminReply = reply;
      ticket.updatedAt = new Date().toISOString();
      saveStore(STORAGE_KEYS.TICKETS, memoryTickets);
    }
  }
};
