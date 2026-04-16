import { useState } from "react";

export default function ClearBid() {
  const [sqft, setSqft] = useState(50000);
  const [rate, setRate] = useState(75);
  const [frequency, setFrequency] = useState(3);
  const [profit, setProfit] = useState(10);

  const WEEKS_PER_MONTH = 4.33;

  const productionRate = 3500; // sqft per hour baseline

  const hoursPerVisit = sqft / productionRate;
  const visitsPerMonth = frequency * WEEKS_PER_MONTH;
  const monthlyHours = hoursPerVisit * visitsPerMonth;
  const laborCost = monthlyHours * rate;

  const profitAmount = laborCost * (profit / 100);
  const monthlyTotal = laborCost + profitAmount;
  const perVisit = monthlyTotal / visitsPerMonth;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>ClearBid</h1>

      <div>
        <label>Square Footage</label><br />
        <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} />
      </div>

      <div>
        <label>Labor Rate ($/hr)</label><br />
        <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
      </div>

      <div>
        <label>Visits Per Week</label><br />
        <input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
      </div>

      <div>
        <label>Profit %</label><br />
        <input type="number" value={profit} onChange={(e) => setProfit(e.target.value)} />
      </div>

      <hr />

      <h2>Results</h2>
      <p>Hours per Visit: {hoursPerVisit.toFixed(2)}</p>
      <p>Monthly Hours: {monthlyHours.toFixed(2)}</p>
      <p>Monthly Cost: ${monthlyTotal.toFixed(2)}</p>
      <p>Per Visit: ${perVisit.toFixed(2)}</p>
    </div>
  );
}
