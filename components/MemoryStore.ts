export type Persona = "rich" | "business";

export type Flight = {
  id: string;
  origin: string;
  destination: string;
  date: string; // ISO date
  price: number;
  airline: string;
};

export type Hotel = {
  id: string;
  city: string;
  name: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  nightlyRate: number;
  stars: number; // 1-5
};

export type Trip = {
  id: string;
  persona: Persona;
  flightId: string;
  hotelId?: string;
  createdAt: string;
};

const PERSONA_KEY = "agentic_persona";
const FLIGHTS_KEY = "agentic_flights";
const HOTELS_KEY = "agentic_hotels";
const TRIPS_KEY = "agentic_trips";

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const MemoryStore = {
  getPersona(): Persona {
    return readLocal<Persona>(PERSONA_KEY, "business");
  },
  setPersona(persona: Persona) {
    writeLocal(PERSONA_KEY, persona);
  },
  getFlights(): Flight[] {
    return readLocal<Flight[]>(FLIGHTS_KEY, []);
  },
  saveFlight(f: Flight) {
    const list = MemoryStore.getFlights();
    const updated = [...list.filter(x => x.id !== f.id), f];
    writeLocal(FLIGHTS_KEY, updated);
  },
  deleteFlight(id: string) {
    const updated = MemoryStore.getFlights().filter(f => f.id !== id);
    writeLocal(FLIGHTS_KEY, updated);
  },
  getHotels(): Hotel[] {
    return readLocal<Hotel[]>(HOTELS_KEY, []);
  },
  saveHotel(h: Hotel) {
    const list = MemoryStore.getHotels();
    const updated = [...list.filter(x => x.id !== h.id), h];
    writeLocal(HOTELS_KEY, updated);
  },
  deleteHotel(id: string) {
    const updated = MemoryStore.getHotels().filter(h => h.id !== id);
    writeLocal(HOTELS_KEY, updated);
  },
  getTrips(): Trip[] {
    return readLocal<Trip[]>(TRIPS_KEY, []);
  },
  saveTrip(t: Trip) {
    const list = MemoryStore.getTrips();
    const updated = [...list.filter(x => x.id !== t.id), t];
    writeLocal(TRIPS_KEY, updated);
  }
};

export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}
