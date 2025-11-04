"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MemoryStore, type Persona, type Flight, type Hotel, type Trip, generateId } from "./MemoryStore";

export type AgentContextValue = {
  persona: Persona;
  setPersona: (p: Persona) => void;
  flights: Flight[];
  addFlight: (f: Omit<Flight, "id">) => void;
  removeFlight: (id: string) => void;
  hotels: Hotel[];
  addHotel: (h: Omit<Hotel, "id">) => void;
  removeHotel: (id: string) => void;
  trips: Trip[];
  planTrip: (input: { flightId: string; hotelId?: string }) => { ok: boolean; error?: string; trip?: Trip };
};

const Ctx = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("business");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    setPersonaState(MemoryStore.getPersona());
    setFlights(MemoryStore.getFlights());
    setHotels(MemoryStore.getHotels());
    setTrips(MemoryStore.getTrips());
  }, []);

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    MemoryStore.setPersona(p);
  };

  const addFlight = (f: Omit<Flight, "id">) => {
    const nf: Flight = { id: generateId("flt"), ...f };
    MemoryStore.saveFlight(nf);
    setFlights(MemoryStore.getFlights());
  };
  const removeFlight = (id: string) => {
    MemoryStore.deleteFlight(id);
    setFlights(MemoryStore.getFlights());
  };

  const addHotel = (h: Omit<Hotel, "id">) => {
    const nh: Hotel = { id: generateId("htl"), ...h };
    MemoryStore.saveHotel(nh);
    setHotels(MemoryStore.getHotels());
  };
  const removeHotel = (id: string) => {
    MemoryStore.deleteHotel(id);
    setHotels(MemoryStore.getHotels());
  };

  const planTrip: AgentContextValue["planTrip"] = ({ flightId, hotelId }) => {
    const chosenFlight = flights.find(f => f.id === flightId);
    if (!chosenFlight) return { ok: false, error: "Flight not found" };

    if (persona === "rich" && !hotelId) {
      return { ok: false, error: "Rich persona requires a hotel selection" };
    }

    let chosenHotel: Hotel | undefined;
    if (hotelId) {
      chosenHotel = hotels.find(h => h.id === hotelId);
      if (!chosenHotel) return { ok: false, error: "Selected hotel not found" };
    }

    const newTrip: Trip = {
      id: generateId("trip"),
      persona,
      flightId,
      hotelId: chosenHotel?.id,
      createdAt: new Date().toISOString()
    };
    MemoryStore.saveTrip(newTrip);
    setTrips(MemoryStore.getTrips());
    return { ok: true, trip: newTrip };
  };

  const value = useMemo<AgentContextValue>(() => ({
    persona,
    setPersona,
    flights,
    addFlight,
    removeFlight,
    hotels,
    addHotel,
    removeHotel,
    trips,
    planTrip
  }), [persona, flights, hotels, trips]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAgent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}
