"use client";
import { useMemo, useState } from "react";
import { useAgent } from "./AgentContext";

export default function HotelForm() {
  const { addHotel, hotels, removeHotel } = useAgent();
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nightlyRate, setNightlyRate] = useState("");
  const [stars, setStars] = useState("5");

  const canAdd = city && name && checkIn && checkOut && nightlyRate;

  const averageRate = useMemo(() => {
    if (!hotels.length) return 0;
    return Math.round(hotels.reduce((a, h) => a + h.nightlyRate, 0) / hotels.length);
  }, [hotels]);

  return (
    <div className="card">
      <h3>Hotels</h3>
      <div className="controls">
        <label>
          City
          <input className="input" value={city} onChange={e => setCity(e.target.value)} placeholder="London" />
        </label>
        <label>
          Name
          <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="The Savoy" />
        </label>
        <label>
          Check-in
          <input className="input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
        </label>
        <label>
          Check-out
          <input className="input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        </label>
        <label>
          Nightly Rate
          <input className="input" type="number" min={1} value={nightlyRate} onChange={e => setNightlyRate(e.target.value)} />
        </label>
        <label>
          Stars
          <select value={stars} onChange={e => setStars(e.target.value)}>
            {[1,2,3,4,5].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <button
          onClick={() => {
            if (!canAdd) return;
            addHotel({ city, name, checkIn, checkOut, nightlyRate: Number(nightlyRate), stars: Number(stars) });
            setCity(""); setName(""); setCheckIn(""); setCheckOut(""); setNightlyRate(""); setStars("5");
          }}
          disabled={!canAdd}
        >Add Hotel</button>
      </div>

      <div className="notice" style={{ marginTop: 12 }}>
        {hotels.length ? (
          <span>{hotels.length} saved ? Avg ${averageRate}</span>
        ) : (
          <span>No hotels saved yet.</span>
        )}
      </div>

      <div className="list" style={{ marginTop: 12 }}>
        {hotels.map(h => (
          <div key={h.id} className="item">
            <div>
              <strong>{h.name}</strong> <small>{h.city} ? {h.stars}?</small>
              <div><small>{h.checkIn} ? {h.checkOut} ? ${h.nightlyRate}/night</small></div>
            </div>
            <div>
              <button className="secondary" onClick={() => removeHotel(h.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
