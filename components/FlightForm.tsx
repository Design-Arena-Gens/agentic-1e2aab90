"use client";
import { useMemo, useState } from "react";
import { useAgent } from "./AgentContext";

export default function FlightForm() {
  const { addFlight, flights, removeFlight } = useAgent();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [airline, setAirline] = useState("");

  const canAdd = origin && destination && date && price && airline;

  const totalFlights = flights.length;
  const averagePrice = useMemo(() => {
    if (!flights.length) return 0;
    return Math.round(flights.reduce((a, f) => a + f.price, 0) / flights.length);
  }, [flights]);

  return (
    <div className="card">
      <h3>Available Flights</h3>
      <div className="controls">
        <label>
          Origin
          <input className="input" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="SFO" />
        </label>
        <label>
          Destination
          <input className="input" value={destination} onChange={e => setDestination(e.target.value)} placeholder="LHR" />
        </label>
        <label>
          Date
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Price (USD)
          <input className="input" type="number" min={1} value={price} onChange={e => setPrice(e.target.value)} />
        </label>
        <label>
          Airline
          <input className="input" value={airline} onChange={e => setAirline(e.target.value)} placeholder="United" />
        </label>
        <button
          onClick={() => {
            if (!canAdd) return;
            addFlight({ origin, destination, date, price: Number(price), airline });
            setOrigin(""); setDestination(""); setDate(""); setPrice(""); setAirline("");
          }}
          disabled={!canAdd}
        >Add Flight</button>
      </div>

      <div className="notice" style={{ marginTop: 12 }}>
        {totalFlights ? (
          <span>{totalFlights} saved ? Avg ${averagePrice}</span>
        ) : (
          <span>No flights saved yet.</span>
        )}
      </div>

      <div className="list" style={{ marginTop: 12 }}>
        {flights.map(f => (
          <div key={f.id} className="item">
            <div>
              <strong>{f.origin} ? {f.destination}</strong> <small>{f.date} ? {f.airline}</small>
              <div><small>${f.price}</small></div>
            </div>
            <div>
              <button className="secondary" onClick={() => removeFlight(f.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
