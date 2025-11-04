"use client";
import { useMemo, useState } from "react";
import { useAgent } from "./AgentContext";

export default function Planner() {
  const { persona, setPersona, flights, hotels, planTrip, trips } = useAgent();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<string>("");
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "error" | "success" | "info">("idle");

  const matchingFlights = useMemo(() => {
    return flights.filter(f =>
      (!origin || f.origin.toLowerCase().includes(origin.toLowerCase())) &&
      (!destination || f.destination.toLowerCase().includes(destination.toLowerCase())) &&
      (!date || f.date === date)
    );
  }, [flights, origin, destination, date]);

  const hotelsForDestination = useMemo(() => {
    if (!destination) return hotels;
    return hotels.filter(h => h.city.toLowerCase().includes(destination.toLowerCase()));
  }, [hotels, destination]);

  const canSubmit = !!selectedFlight && (persona === "business" || !!selectedHotel);

  function handlePlan() {
    const res = planTrip({ flightId: selectedFlight, hotelId: selectedHotel || undefined });
    if (!res.ok) {
      setStatus("error");
      setMessage(res.error || "Failed to plan trip");
      return;
    }
    const trip = res.trip!;
    const fl = flights.find(f => f.id === trip.flightId)!;
    const ht = hotels.find(h => h.id === trip.hotelId!);
    const msg = persona === "rich"
      ? `Booked luxury trip: ${fl.origin} ? ${fl.destination} on ${fl.date}${ht ? ` with ${ht.name}` : ""}.`
      : `Booked business trip: ${fl.origin} ? ${fl.destination} on ${fl.date}${ht ? ` + ${ht.name}` : ""}.`;
    setStatus("success");
    setMessage(msg);
    setSelectedFlight("");
    setSelectedHotel("");
  }

  return (
    <div className="card">
      <div className="tabs">
        <button className={`tab ${persona === "business" ? "active" : ""}`} onClick={() => setPersona("business")}>Business Persona</button>
        <button className={`tab ${persona === "rich" ? "active" : ""}`} onClick={() => setPersona("rich")}>Rich Persona</button>
      </div>

      <div className="notice" style={{ marginBottom: 12 }}>
        {persona === "rich" ? (
          <span>Rich persona requires hotel selection for any flight.</span>
        ) : (
          <span>Business persona prioritizes available flights; hotel optional.</span>
        )}
      </div>

      <div className="controls">
        <label>
          Origin
          <input className="input" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Filter by origin" />
        </label>
        <label>
          Destination
          <input className="input" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Filter by destination" />
        </label>
        <label>
          Date
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <h4>Select Flight</h4>
          <div className="list">
            {matchingFlights.length ? matchingFlights.map(f => (
              <label key={f.id} className="item" style={{ cursor: "pointer" }}>
                <div>
                  <strong>{f.origin} ? {f.destination}</strong> <small>{f.date} ? {f.airline}</small>
                  <div><small>${f.price}</small></div>
                </div>
                <input type="radio" name="flight" checked={selectedFlight === f.id} onChange={() => setSelectedFlight(f.id)} />
              </label>
            )) : <div className="notice">No matching flights. Add some in "Available Flights".</div>}
          </div>
        </div>

        <div className="card">
          <h4>{persona === "rich" ? "Select Required Hotel" : "Select Optional Hotel"}</h4>
          <div className="list">
            {hotelsForDestination.length ? hotelsForDestination.map(h => (
              <label key={h.id} className="item" style={{ cursor: "pointer" }}>
                <div>
                  <strong>{h.name}</strong> <small>{h.city} ? {h.stars}?</small>
                  <div><small>{h.checkIn} ? {h.checkOut} ? ${h.nightlyRate}/night</small></div>
                </div>
                <input type="radio" name="hotel" checked={selectedHotel === h.id} onChange={() => setSelectedHotel(h.id)} />
              </label>
            )) : <div className="notice">No hotels yet. Add some in "Hotels".</div>}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={handlePlan} disabled={!canSubmit}>Plan Trip</button>
        {!canSubmit && selectedFlight && persona === "rich" && (
          <span className="badge">Hotel required for rich persona</span>
        )}
      </div>

      {status !== "idle" && (
        <div className={`notice ${status === "success" ? "success" : status === "error" ? "error" : ""}`} style={{ marginTop: 12 }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <h4>Recent Plans</h4>
        <div className="list">
          {trips.length ? trips.slice().reverse().slice(0, 5).map(t => {
            const f = flights.find(x => x.id === t.flightId);
            const h = hotels.find(x => x.id === t.hotelId!);
            return (
              <div key={t.id} className="item">
                <div>
                  <strong>{t.persona.toUpperCase()}</strong> <small>{new Date(t.createdAt).toLocaleString()}</small>
                  <div className="kv">
                    <div>Flight</div><div>{f ? `${f.origin} ? ${f.destination} ? ${f.date}` : "(deleted)"}</div>
                    <div>Hotel</div><div>{h ? `${h.name} ? ${h.city}` : (t.persona === "rich" ? "(required, missing)" : "(none)")}</div>
                  </div>
                </div>
              </div>
            );
          }) : <div className="notice">No trips yet.</div>}
        </div>
      </div>
    </div>
  );
}
