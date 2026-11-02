import { Operator, Bus, RouteItem, Trip, Coupon, SeatInventoryItem } from '@/types';

export const BANGLADESH_CITIES = [
  'Dhaka',
  'Chattogram',
  "Cox's Bazar",
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Rangpur',
  'Barishal',
  'Cumilla',
  'Bogura',
  'Mymensingh',
  'Jessore',
  'Sreemangal',
  'Bandarban',
  'Kushtia',
  'Feni'
];

export const INITIAL_OPERATORS: Operator[] = [
  {
    id: 'op-greenline',
    operatorName: 'Green Line Paribahan',
    slug: 'green-line',
    logoURL: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
    contactPhone: '+880 1711-547788',
    contactEmail: 'support@greenlinebd.com',
    address: '9/2 Outer Circular Road, Rajarbagh, Dhaka',
    status: 'active',
    rating: 4.8,
    busCategories: ['Double Decker', 'Scania Multi-Axle', 'Sleeper Coach'],
    popularRoutes: ['Dhaka - Chattogram', "Dhaka - Cox's Bazar", 'Dhaka - Sylhet'],
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'op-shohagh',
    operatorName: 'Shohagh Paribahan',
    slug: 'shohagh',
    logoURL: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=120&auto=format&fit=crop&q=80',
    contactPhone: '+880 1711-612433',
    contactEmail: 'care@shohagh.com',
    address: '63 DIT Road, Malibagh, Dhaka',
    status: 'active',
    rating: 4.9,
    busCategories: ['Scania Multi-Axle', 'Hyundai Universe Suite'],
    popularRoutes: ['Dhaka - Chattogram', "Dhaka - Cox's Bazar", 'Dhaka - Khulna'],
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'op-hanif',
    operatorName: 'Hanif Enterprise',
    slug: 'hanif',
    logoURL: 'https://images.unsplash.com/photo-1596706918840-7cf1615f7958?w=120&auto=format&fit=crop&q=80',
    contactPhone: '+880 1713-049533',
    contactEmail: 'info@hanifenterprise.com',
    address: 'Panthapath, Green Road, Dhaka',
    status: 'active',
    rating: 4.6,
    busCategories: ['Volvo B11R AC', 'Hino 1J Non-AC'],
    popularRoutes: ['Dhaka - Rajshahi', 'Dhaka - Rangpur', 'Dhaka - Chattogram'],
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'op-shyamoli',
    operatorName: 'Shyamoli Paribahan (NR)',
    slug: 'shyamoli',
    logoURL: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=120&auto=format&fit=crop&q=80',
    contactPhone: '+880 1711-304746',
    contactEmail: 'contact@shyamolibd.com',
    address: 'Sayedabad Bus Terminal, Dhaka',
    status: 'active',
    rating: 4.7,
    busCategories: ['Volvo Multi-Axle', 'Hyundai AC'],
    popularRoutes: ['Dhaka - Sylhet', 'Dhaka - Barishal', 'Dhaka - Rajshahi'],
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'op-desh',
    operatorName: 'Desh Travels',
    slug: 'desh-travels',
    logoURL: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=120&auto=format&fit=crop&q=80',
    contactPhone: '+880 1762-684400',
    contactEmail: 'support@deshtravelsbd.com',
    address: 'Gabtoli Interdistrict Bus Terminal, Dhaka',
    status: 'active',
    rating: 4.7,
    busCategories: ['Hyundai Universe Luxury Class'],
    popularRoutes: ['Dhaka - Rajshahi', 'Dhaka - Rangpur', 'Dhaka - Kushtia'],
    createdAt: '2025-02-12T00:00:00Z',
  },
  {
    id: 'op-saintmartin',
    operatorName: 'Saintmartin Paribahan',
    slug: 'saintmartin',
    logoURL: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
    contactPhone: '+880 1819-338877',
    contactEmail: 'booking@saintmartinparibahan.com',
    address: 'Fakirapool, Motijheel, Dhaka',
    status: 'active',
    rating: 4.8,
    busCategories: ['Scania Sleeper Coach', 'Mercedes-Benz AC'],
    popularRoutes: ["Dhaka - Cox's Bazar", 'Dhaka - Chattogram', 'Chattogram - Cox\'s Bazar'],
    createdAt: '2025-03-01T00:00:00Z',
  }
];

export const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'route-dhk-ctg',
    origin: 'Dhaka',
    destination: 'Chattogram',
    distanceKm: 248,
    durationMinutes: 330,
    durationFormatted: '5h 30m',
    boardingPoints: ['Sayedabad', 'Arambagh', 'Kalabagan', 'Abdullahpur'],
    droppingPoints: ['Dampara', 'AK Khan', 'Cinema Palace', 'GEC Circle'],
    baseFare: 900,
    status: 'active'
  },
  {
    id: 'route-dhk-cox',
    origin: 'Dhaka',
    destination: "Cox's Bazar",
    distanceKm: 395,
    durationMinutes: 540,
    durationFormatted: '9h 00m',
    boardingPoints: ['Sayedabad', 'Arambagh', 'Fakirapool', 'Abdullahpur'],
    droppingPoints: ['Kolatoli Beach', 'Jhawtola', 'Dolphin Circle', 'Bus Terminal'],
    baseFare: 1400,
    status: 'active'
  },
  {
    id: 'route-dhk-syl',
    origin: 'Dhaka',
    destination: 'Sylhet',
    distanceKm: 240,
    durationMinutes: 360,
    durationFormatted: '6h 00m',
    boardingPoints: ['Sayedabad', 'MohaKhali', 'Uttara House Building'],
    droppingPoints: ['Kadamtoli', 'Humayun Rashid Chattar', 'Subidbazar'],
    baseFare: 850,
    status: 'active'
  },
  {
    id: 'route-dhk-raj',
    origin: 'Dhaka',
    destination: 'Rajshahi',
    distanceKm: 255,
    durationMinutes: 330,
    durationFormatted: '5h 30m',
    boardingPoints: ['Kalyanpur', 'Gabtoli', 'Abdullahpur'],
    droppingPoints: ['Shirothoil', 'Railway Gate', 'Alupatti', 'Natore Road'],
    baseFare: 800,
    status: 'active'
  },
  {
    id: 'route-dhk-khu',
    origin: 'Dhaka',
    destination: 'Khulna',
    distanceKm: 210,
    durationMinutes: 270,
    durationFormatted: '4h 30m (Padma Bridge)',
    boardingPoints: ['Sayedabad', 'Jatrabari', 'Postagola'],
    droppingPoints: ['Sonadanga Bus Terminal', 'Royal Moor', 'Shibbari'],
    baseFare: 750,
    status: 'active'
  },
  {
    id: 'route-dhk-rng',
    origin: 'Dhaka',
    destination: 'Rangpur',
    distanceKm: 305,
    durationMinutes: 420,
    durationFormatted: '7h 00m',
    boardingPoints: ['Kalyanpur', 'Gabtoli', 'Mohakhali'],
    droppingPoints: ['Kamarkhmar', 'Medical Mor', 'Jahaj Company Mor'],
    baseFare: 900,
    status: 'active'
  },
  {
    id: 'route-dhk-bar',
    origin: 'Dhaka',
    destination: 'Barishal',
    distanceKm: 180,
    durationMinutes: 240,
    durationFormatted: '4h 00m (Padma Bridge)',
    boardingPoints: ['Sayedabad', 'Jatrabari', 'Abdullahpur'],
    droppingPoints: ['Nathullabad Bus Terminal', 'Rupatali Mor', 'C&B Road'],
    baseFare: 700,
    status: 'active'
  },
  {
    id: 'route-dhk-cum',
    origin: 'Dhaka',
    destination: 'Cumilla',
    distanceKm: 98,
    durationMinutes: 120,
    durationFormatted: '2h 00m',
    boardingPoints: ['Sayedabad', 'Jatrabari'],
    droppingPoints: ['Paduar Bazar', 'Shasongachha', 'Alekharchar'],
    baseFare: 350,
    status: 'active'
  }
];

export const INITIAL_BUSES: Bus[] = [
  {
    id: 'bus-gl-01',
    operatorId: 'op-greenline',
    operatorName: 'Green Line Paribahan',
    busName: 'MAN 24.460 Double Decker Multiaxle',
    registrationNumber: 'DHAKA-METRO-BA-15-2244',
    busType: 'AC',
    category: 'Business Class',
    seatLayout: '2x2',
    totalSeats: 36,
    amenities: ['High-Speed Wi-Fi', 'USB Charging Port', 'Mineral Water', 'Air Conditioning', 'Emergency GPS', 'Soft Blanket'],
    status: 'active',
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'bus-sh-01',
    operatorId: 'op-shohagh',
    operatorName: 'Shohagh Paribahan',
    busName: 'Scania K410IB Multi-Axle Suite',
    registrationNumber: 'DHAKA-METRO-BA-14-8899',
    busType: 'AC',
    category: 'Business Class',
    seatLayout: '2x2',
    totalSeats: 36,
    amenities: ['High-Speed Wi-Fi', 'USB Charging Port', 'Mineral Water', 'Air Conditioning', 'Reclining Seats', 'Reading Light'],
    status: 'active',
    createdAt: '2025-01-22T00:00:00Z',
  },
  {
    id: 'bus-sm-01',
    operatorId: 'op-saintmartin',
    operatorName: 'Saintmartin Paribahan',
    busName: 'Scania Luxury Sleeper Coach 2+1',
    registrationNumber: 'DHAKA-METRO-BA-16-7711',
    busType: 'AC',
    category: 'Sleeper Coach',
    seatLayout: '2x1',
    totalSeats: 28,
    amenities: ['Full Sleeper Berth', 'Curtain Privacy', 'High-Speed Wi-Fi', 'USB Port', 'Snacks & Water', 'Pillow & Blanket'],
    status: 'active',
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'bus-hn-01',
    operatorId: 'op-hanif',
    operatorName: 'Hanif Enterprise',
    busName: 'Volvo B11R I-Shift Executive',
    registrationNumber: 'DHAKA-METRO-BA-11-9923',
    busType: 'AC',
    category: 'Executive Chair',
    seatLayout: '2x2',
    totalSeats: 40,
    amenities: ['Air Conditioning', 'Charging Outlets', 'Mineral Water', 'Music & Entertainment'],
    status: 'active',
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'bus-desh-01',
    operatorId: 'op-desh',
    operatorName: 'Desh Travels',
    busName: 'Hyundai Universe Express Prime',
    registrationNumber: 'DHAKA-METRO-BA-13-4411',
    busType: 'AC',
    category: 'Executive Chair',
    seatLayout: '2x2',
    totalSeats: 36,
    amenities: ['Fast Wi-Fi', 'Phone Charger', 'Mineral Water', 'Comfort Footrest'],
    status: 'active',
    createdAt: '2025-02-15T00:00:00Z',
  },
  {
    id: 'bus-shyam-01',
    operatorId: 'op-shyamoli',
    operatorName: 'Shyamoli Paribahan (NR)',
    busName: 'Hino 1J Non-AC Economy Coach',
    registrationNumber: 'DHAKA-METRO-BA-09-5566',
    busType: 'Non-AC',
    category: 'Economy Seater',
    seatLayout: '2x2',
    totalSeats: 40,
    amenities: ['Emergency Exit', 'First Aid Box', 'Luggage Compartment'],
    status: 'active',
    createdAt: '2025-02-18T00:00:00Z',
  }
];

// Helper to generate seat inventory
export function generateInitialSeats(layout: '2x2' | '2x1', totalSeats: number, basePrice: number): Record<string, SeatInventoryItem> {
  const seats: Record<string, SeatInventoryItem> = {};
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = layout === '2x1' ? ['1', '2', '3'] : ['1', '2', '3', '4'];
  
  let count = 0;
  for (const r of rows) {
    for (const c of cols) {
      if (count >= totalSeats) break;
      const seatNo = `${r}${c}`;
      
      // Mark some seats naturally for realism:
      // A1, A2 often ladies/booked; C1, C2 booked; etc.
      let status: any = 'available';
      let genderPref: any = 'any';

      if (['A1', 'A2', 'B1'].includes(seatNo)) {
        status = 'ladies';
        genderPref = 'female';
      } else if (['B3', 'B4', 'D1', 'D2', 'F3'].includes(seatNo)) {
        status = 'booked';
      } else if (['E1'].includes(seatNo)) {
        status = 'reserved';
      }

      seats[seatNo] = {
        seatNumber: seatNo,
        status,
        genderPref,
        price: basePrice,
      };
      count++;
    }
  }
  return seats;
}

export function generateSampleTrips(): Trip[] {
  // Deterministic dates safe for Next.js prerender and hydration
  const today = '2026-11-02';
  const tomorrow = '2026-11-03';
  const dayAfter = '2026-11-04';

  const dates = [today, tomorrow, dayAfter];

  const trips: Trip[] = [];
  let idCounter = 1;

  dates.forEach(date => {
    // 1. Dhaka to Chattogram
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-gl-01',
      operatorId: 'op-greenline',
      operatorName: 'Green Line Paribahan',
      operatorLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-ctg',
      origin: 'Dhaka',
      destination: 'Chattogram',
      journeyDate: date,
      departureTime: '07:30 AM',
      arrivalTime: '01:00 PM',
      durationFormatted: '5h 30m',
      busName: 'MAN Double Decker Multi-Axle AC',
      busType: 'AC',
      category: 'Business Class',
      fare: 1400,
      seatInventory: generateInitialSeats('2x2', 36, 1400),
      availableSeatCount: 29,
      totalSeats: 36,
      amenities: ['High-Speed Wi-Fi', 'USB Charging Port', 'Mineral Water', 'Air Conditioning', 'Soft Blanket'],
      boardingPoints: ['Sayedabad (07:30 AM)', 'Arambagh (07:00 AM)', 'Kalabagan (06:30 AM)'],
      droppingPoints: ['Dampara Bus Counter', 'AK Khan Mor', 'GEC Circle'],
      status: 'scheduled',
      rating: 4.9,
      createdAt: '2025-03-01T00:00:00Z',
    });

    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-sh-01',
      operatorId: 'op-shohagh',
      operatorName: 'Shohagh Paribahan',
      operatorLogo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-ctg',
      origin: 'Dhaka',
      destination: 'Chattogram',
      journeyDate: date,
      departureTime: '11:15 AM',
      arrivalTime: '04:45 PM',
      durationFormatted: '5h 30m',
      busName: 'Scania Multi-Axle Suite Class',
      busType: 'AC',
      category: 'Business Class',
      fare: 1350,
      seatInventory: generateInitialSeats('2x2', 36, 1350),
      availableSeatCount: 30,
      totalSeats: 36,
      amenities: ['High-Speed Wi-Fi', 'USB Charging Port', 'Mineral Water', 'Air Conditioning'],
      boardingPoints: ['Malibagh Counter (11:15 AM)', 'Sayedabad (11:45 AM)'],
      droppingPoints: ['AK Khan', 'Dampara Counter'],
      status: 'scheduled',
      rating: 4.8,
      createdAt: '2025-03-01T00:00:00Z',
    });

    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-shyam-01',
      operatorId: 'op-shyamoli',
      operatorName: 'Shyamoli Paribahan (NR)',
      operatorLogo: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-ctg',
      origin: 'Dhaka',
      destination: 'Chattogram',
      journeyDate: date,
      departureTime: '02:30 PM',
      arrivalTime: '08:30 PM',
      durationFormatted: '6h 00m',
      busName: 'Hino 1J Non-AC Economy Coach',
      busType: 'Non-AC',
      category: 'Economy Seater',
      fare: 680,
      seatInventory: generateInitialSeats('2x2', 40, 680),
      availableSeatCount: 34,
      totalSeats: 40,
      amenities: ['Emergency Exit', 'Luggage Compartment'],
      boardingPoints: ['Sayedabad (02:30 PM)', 'Arambagh (02:00 PM)'],
      droppingPoints: ['Cinema Palace', 'Dampara'],
      status: 'scheduled',
      rating: 4.5,
      createdAt: '2025-03-01T00:00:00Z',
    });

    // 2. Dhaka to Cox's Bazar
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-sm-01',
      operatorId: 'op-saintmartin',
      operatorName: 'Saintmartin Paribahan',
      operatorLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-cox',
      origin: 'Dhaka',
      destination: "Cox's Bazar",
      journeyDate: date,
      departureTime: '09:00 PM',
      arrivalTime: '06:00 AM',
      durationFormatted: '9h 00m',
      busName: 'Scania Luxury Sleeper 2+1 Berth',
      busType: 'AC',
      category: 'Sleeper Coach',
      fare: 2200,
      seatInventory: generateInitialSeats('2x1', 28, 2200),
      availableSeatCount: 22,
      totalSeats: 28,
      amenities: ['Full Sleeper Berth', 'Curtain Privacy', 'High-Speed Wi-Fi', 'Snacks & Water', 'Pillow & Blanket'],
      boardingPoints: ['Fakirapool (09:00 PM)', 'Sayedabad (09:30 PM)', 'Abdullahpur (08:00 PM)'],
      droppingPoints: ['Kolatoli Beach Main Point', 'Jhawtola Mor', 'Dolphin Circle'],
      status: 'scheduled',
      rating: 4.9,
      createdAt: '2025-03-01T00:00:00Z',
    });

    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-gl-01',
      operatorId: 'op-greenline',
      operatorName: 'Green Line Paribahan',
      operatorLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-cox',
      origin: 'Dhaka',
      destination: "Cox's Bazar",
      journeyDate: date,
      departureTime: '10:30 PM',
      arrivalTime: '07:30 AM',
      durationFormatted: '9h 00m',
      busName: 'Scania Multi-Axle Business Executive',
      busType: 'AC',
      category: 'Business Class',
      fare: 1800,
      seatInventory: generateInitialSeats('2x2', 36, 1800),
      availableSeatCount: 28,
      totalSeats: 36,
      amenities: ['High-Speed Wi-Fi', 'USB Charging Port', 'Mineral Water', 'Soft Blanket'],
      boardingPoints: ['Rajarbagh Head Office (10:00 PM)', 'Sayedabad (10:30 PM)'],
      droppingPoints: ['Kolatoli Point', 'Dolphin Circle'],
      status: 'scheduled',
      rating: 4.8,
      createdAt: '2025-03-01T00:00:00Z',
    });

    // 3. Dhaka to Sylhet
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-sh-01',
      operatorId: 'op-shohagh',
      operatorName: 'Shohagh Paribahan',
      operatorLogo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-syl',
      origin: 'Dhaka',
      destination: 'Sylhet',
      journeyDate: date,
      departureTime: '08:00 AM',
      arrivalTime: '02:00 PM',
      durationFormatted: '6h 00m',
      busName: 'Hyundai Universe Elegance AC',
      busType: 'AC',
      category: 'Executive Chair',
      fare: 1100,
      seatInventory: generateInitialSeats('2x2', 36, 1100),
      availableSeatCount: 29,
      totalSeats: 36,
      amenities: ['High-Speed Wi-Fi', 'Mineral Water', 'Air Conditioning', 'USB Charging'],
      boardingPoints: ['Sayedabad (08:00 AM)', 'Mohakhali (07:15 AM)'],
      droppingPoints: ['Kadamtoli Main Terminal', 'Humayun Rashid Chattar'],
      status: 'scheduled',
      rating: 4.7,
      createdAt: '2025-03-01T00:00:00Z',
    });

    // 4. Dhaka to Rajshahi
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-desh-01',
      operatorId: 'op-desh',
      operatorName: 'Desh Travels',
      operatorLogo: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-raj',
      origin: 'Dhaka',
      destination: 'Rajshahi',
      journeyDate: date,
      departureTime: '08:30 AM',
      arrivalTime: '02:00 PM',
      durationFormatted: '5h 30m',
      busName: 'Hyundai Universe Prime VIP',
      busType: 'AC',
      category: 'Executive Chair',
      fare: 1050,
      seatInventory: generateInitialSeats('2x2', 36, 1050),
      availableSeatCount: 30,
      totalSeats: 36,
      amenities: ['Fast Wi-Fi', 'Phone Charger', 'Mineral Water', 'Comfort Footrest'],
      boardingPoints: ['Kalyanpur (08:30 AM)', 'Gabtoli (08:45 AM)', 'Abdullahpur (08:00 AM)'],
      droppingPoints: ['Shirothoil Counter', 'Railway Gate', 'Alupatti'],
      status: 'scheduled',
      rating: 4.8,
      createdAt: '2025-03-01T00:00:00Z',
    });

    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-hn-01',
      operatorId: 'op-hanif',
      operatorName: 'Hanif Enterprise',
      operatorLogo: 'https://images.unsplash.com/photo-1596706918840-7cf1615f7958?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-raj',
      origin: 'Dhaka',
      destination: 'Rajshahi',
      journeyDate: date,
      departureTime: '11:45 PM',
      arrivalTime: '05:30 AM',
      durationFormatted: '5h 45m',
      busName: 'Volvo B11R Executive AC',
      busType: 'AC',
      category: 'Executive Chair',
      fare: 950,
      seatInventory: generateInitialSeats('2x2', 40, 950),
      availableSeatCount: 33,
      totalSeats: 40,
      amenities: ['Air Conditioning', 'Charging Outlets', 'Mineral Water'],
      boardingPoints: ['Panthapath (11:00 PM)', 'Gabtoli (11:45 PM)'],
      droppingPoints: ['Shirothoil', 'Railway Gate'],
      status: 'scheduled',
      rating: 4.6,
      createdAt: '2025-03-01T00:00:00Z',
    });

    // 5. Dhaka to Khulna (via Padma Bridge)
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-sh-01',
      operatorId: 'op-shohagh',
      operatorName: 'Shohagh Paribahan',
      operatorLogo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-khu',
      origin: 'Dhaka',
      destination: 'Khulna',
      journeyDate: date,
      departureTime: '09:30 AM',
      arrivalTime: '02:00 PM',
      durationFormatted: '4h 30m',
      busName: 'Scania Multi-Axle Express',
      busType: 'AC',
      category: 'Business Class',
      fare: 1200,
      seatInventory: generateInitialSeats('2x2', 36, 1200),
      availableSeatCount: 31,
      totalSeats: 36,
      amenities: ['High-Speed Wi-Fi', 'Air Conditioning', 'Mineral Water', 'USB Charging Port'],
      boardingPoints: ['Sayedabad (09:30 AM)', 'Jatrabari (09:45 AM)'],
      droppingPoints: ['Sonadanga Bus Terminal', 'Royal Moor'],
      status: 'scheduled',
      rating: 4.9,
      createdAt: '2025-03-01T00:00:00Z',
    });

    // 6. Dhaka to Barishal
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-shyam-01',
      operatorId: 'op-shyamoli',
      operatorName: 'Shyamoli Paribahan (NR)',
      operatorLogo: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-bar',
      origin: 'Dhaka',
      destination: 'Barishal',
      journeyDate: date,
      departureTime: '10:00 AM',
      arrivalTime: '02:00 PM',
      durationFormatted: '4h 00m',
      busName: 'Hyundai Comfort Express',
      busType: 'AC',
      category: 'Executive Chair',
      fare: 850,
      seatInventory: generateInitialSeats('2x2', 36, 850),
      availableSeatCount: 32,
      totalSeats: 36,
      amenities: ['Air Conditioning', 'Charging Outlets', 'Mineral Water'],
      boardingPoints: ['Sayedabad (10:00 AM)', 'Jatrabari (10:15 AM)'],
      droppingPoints: ['Nathullabad Bus Terminal', 'Rupatali'],
      status: 'scheduled',
      rating: 4.6,
      createdAt: '2025-03-01T00:00:00Z',
    });

    // 7. Dhaka to Rangpur
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-hn-01',
      operatorId: 'op-hanif',
      operatorName: 'Hanif Enterprise',
      operatorLogo: 'https://images.unsplash.com/photo-1596706918840-7cf1615f7958?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-rng',
      origin: 'Dhaka',
      destination: 'Rangpur',
      journeyDate: date,
      departureTime: '10:00 PM',
      arrivalTime: '05:00 AM',
      durationFormatted: '7h 00m',
      busName: 'Volvo B11R Luxury Sleeper/Seater',
      busType: 'AC',
      category: 'Executive Chair',
      fare: 1100,
      seatInventory: generateInitialSeats('2x2', 40, 1100),
      availableSeatCount: 35,
      totalSeats: 40,
      amenities: ['Air Conditioning', 'Charging Outlets', 'Mineral Water', 'Soft Blanket'],
      boardingPoints: ['Kalyanpur (09:45 PM)', 'Gabtoli (10:15 PM)'],
      droppingPoints: ['Kamarkhmar Mor', 'Medical Mor'],
      status: 'scheduled',
      rating: 4.7,
      createdAt: '2025-03-01T00:00:00Z',
    });

    // 8. Dhaka to Cumilla
    trips.push({
      id: `trip-${idCounter++}`,
      busId: 'bus-shyam-01',
      operatorId: 'op-shyamoli',
      operatorName: 'Shyamoli Paribahan (NR)',
      operatorLogo: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=120&auto=format&fit=crop&q=80',
      routeId: 'route-dhk-cum',
      origin: 'Dhaka',
      destination: 'Cumilla',
      journeyDate: date,
      departureTime: '01:00 PM',
      arrivalTime: '03:00 PM',
      durationFormatted: '2h 00m',
      busName: 'Hino 1J Air suspension Coach',
      busType: 'Non-AC',
      category: 'Economy Seater',
      fare: 350,
      seatInventory: generateInitialSeats('2x2', 40, 350),
      availableSeatCount: 36,
      totalSeats: 40,
      amenities: ['Emergency Exit', 'Luggage Compartment'],
      boardingPoints: ['Sayedabad (01:00 PM)', 'Jatrabari (01:15 PM)'],
      droppingPoints: ['Paduar Bazar Biswaroad', 'Shasongachha'],
      status: 'scheduled',
      rating: 4.5,
      createdAt: '2025-03-01T00:00:00Z',
    });
  });

  return trips;
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-first50',
    code: 'FIRST50',
    discountType: 'fixed',
    discountValue: 50,
    minimumPurchase: 500,
    usageLimit: 5000,
    usedCount: 312,
    expiryDate: '2027-12-31',
    active: true,
    description: 'Flat ৳50 discount for first-time bookings'
  },
  {
    id: 'c-save100',
    code: 'SAVE100',
    discountType: 'fixed',
    discountValue: 100,
    minimumPurchase: 1000,
    usageLimit: 3000,
    usedCount: 789,
    expiryDate: '2027-12-31',
    active: true,
    description: 'Flat ৳100 off on ticket orders of ৳1,000 or more'
  },
  {
    id: 'c-travel10',
    code: 'TRAVEL10',
    discountType: 'percentage',
    discountValue: 10,
    minimumPurchase: 800,
    maximumDiscount: 250,
    usageLimit: 2000,
    usedCount: 456,
    expiryDate: '2027-12-31',
    active: true,
    description: '10% instant discount up to ৳250'
  }
];

export const POPULAR_ROUTES_SHOWCASE = [
  {
    origin: 'Dhaka',
    destination: 'Chattogram',
    startingFare: 680,
    duration: '5h 30m',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    operators: ['Green Line', 'Shohagh', 'Shyamoli', 'Hanif'],
    badge: 'Most Popular',
  },
  {
    origin: 'Dhaka',
    destination: "Cox's Bazar",
    startingFare: 1400,
    duration: '9h 00m',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    operators: ['Saintmartin', 'Green Line', 'Shohagh', 'Desh Travels'],
    badge: 'Beach Special',
  },
  {
    origin: 'Dhaka',
    destination: 'Sylhet',
    startingFare: 850,
    duration: '6h 00m',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    operators: ['Shohagh', 'Green Line', 'Ena', 'Shyamoli'],
    badge: 'Tea Capital',
  },
  {
    origin: 'Dhaka',
    destination: 'Rajshahi',
    startingFare: 800,
    duration: '5h 30m',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
    operators: ['Desh Travels', 'Hanif', 'National Travels'],
    badge: 'Silk City',
  },
  {
    origin: 'Dhaka',
    destination: 'Khulna',
    startingFare: 750,
    duration: '4h 30m',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80',
    operators: ['Shohagh', 'Green Line', 'Tungipara Express'],
    badge: 'Padma Bridge Route',
  },
  {
    origin: 'Dhaka',
    destination: 'Barishal',
    startingFare: 700,
    duration: '4h 00m',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80',
    operators: ['Sakura', 'Shyamoli', 'Hanif'],
    badge: 'Fastest Highway',
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Tanvir Hossain',
    role: 'Software Engineer, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    route: 'Dhaka → Chattogram',
    comment: 'Ek Sathe Jabo made booking Green Line Scania so seamless. The instant bKash payment and QR e-ticket on my phone meant zero counter hassles!',
    date: 'Verified Passenger'
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    role: 'University Student, Sylhet',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    route: 'Dhaka → Sylhet',
    comment: 'The interactive seat layout clearly showing Ladies seats gave me immense peace of mind. Very smooth booking experience.',
    date: 'Verified Passenger'
  },
  {
    id: 3,
    name: 'Rafiqul Islam',
    role: 'Corporate Executive, Cox\'s Bazar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    route: "Dhaka → Cox's Bazar",
    comment: 'Booked Saintmartin Sleeper coach for family vacation. The live seat hold timer and SMS confirmation were top-tier.',
    date: 'Verified Passenger'
  }
];
