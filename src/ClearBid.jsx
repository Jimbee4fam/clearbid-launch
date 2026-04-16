import { useState } from "react";

const PRODUCTION_RATES = { office: 3500, medical: 2500, school: 4000 };
const BUILDING_LABELS = { office: "Office", medical: "Medical", school: "School" };
const FREQ_LABELS = { 1: "1x / week", 3: "3x / week", 5: "5x / week" };
const WEEKS_PER_MONTH = 4.33;

function fmt(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}
function fmtN(n, d = 1) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #F0EDE8;
    color: #1a1a1a;
    min-height: 100vh;
  }

  .app-wrap {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 4rem;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 2.5rem;
  }

  .logo-mark {
    width: 44px;
    height: 44px;
    background: #1a1a1a;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-name {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.5px;
    color: #1a1a1a;
  }

  .logo-tag {
    font-size: 13px;
    color: #888;
    margin-top: 1px;
  }

  .card {
    background: #fff;
    border-radius: 18px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(0,0,0,0.06);
  }

  .card-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-bottom: 1.25rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field { display: flex; flex-direction: column; gap: 7px; }
  .field.full { grid-column: 1 / -1; }

  label { font-size: 13px; font-weight: 500; color: #555; }

  .input-wrap { position: relative; }
  .input-wrap input { padding-right: 44px; }
  .input-suffix {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    color: #aaa;
    pointer-events: none;
  }

  input, select {
    width: 100%;
    height: 42px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    background: #fafafa;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    appearance: none;
    -webkit-appearance: none;
  }

  input:focus, select:focus {
    border-color: #1a1a1a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,26,26,0.08);
  }

  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23aaa' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
  }

  .btn-primary {
    width: 100%;
    height: 48px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    margin-top: 0.5rem;
    letter-spacing: -0.2px;
    transition: background 0.15s, transform 0.1s;
  }

  .btn-primary:hover { background: #333; }
  .btn-primary:active { transform: scale(0.99); }

  .error {
    font-size: 12px;
    color: #c0392b;
    margin-top: 6px;
  }

  .results-card {
    background: #1a1a1a;
    border-radius: 18px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  .results-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #666;
    margin-bottom: 1.25rem;
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 1.5rem;
  }

  .metric {
    background: rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 1rem;
  }

  .metric-label {
    font-size: 11px;
    color: #888;
    margin-bottom: 6px;
    font-weight: 500;
  }

  .metric-value {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .metric-sub {
    font-size: 11px;
    color: #555;
    margin-top: 3px;
    font-family: 'DM Mono', monospace;
  }

  .breakdown {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 1rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 13px;
  }

  .row:last-child {
    border-bottom: none;
    font-weight: 600;
    font-size: 15px;
    padding-top: 12px;
    margin-top: 4px;
    border-top: 1px solid rgba(255,255,255,0.12);
  }

  .row-label { color: #888; }
  .row-value { color: #fff; font-family: 'DM Mono', monospace; font-size: 12px; }
  .row:last-child .row-label { color: #ccc; }
  .row:last-child .row-value { font-size: 15px; font-family: 'DM Sans', sans-serif; color: #fff; }

  .tag {
    display: inline-block;
    background: rgba(255,255,255,0.1);
    color: #aaa;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 4px;
    margin-left: 6px;
    font-family: 'DM Mono', monospace;
    vertical-align: middle;
  }

  .btn-dl {
    width: 100%;
    height: 42px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    font-size: 14px;
    color: #ccc;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 1rem;
    transition: background 0.15s;
    font-weight: 500;
  }

  .btn-dl:hover { background: rgba(255,255,255,0.12); color: #fff; }

  @media (max-width: 480px) {
    .grid { grid-template-columns: 1fr; }
    .metrics { grid-template-columns: 1fr 1fr; }
    .metrics .metric:last-child { grid-column: 1 / -1; }
  }
`;

export default function ClearBid() {
  const [sqft, setSqft] = useState("");
  const [btype, setBtype] = useState("office");
  const [freq, setFreq] = useState("1");
  const [rate, setRate] = useState("");
  const [margin, setMargin] = useState("");
  const [error, setError] = useState("");
  const [bid, setBid] = useState(null);

  function generateBid() {
    const s = parseFloat(sqft);
    const r = parseFloat(rate);
    const m = parseFloat(margin);
    const f = parseInt(freq);

    if (!s || s < 100) return setError("Enter a valid square footage (min 100).");
    if (!r || r < 1) return setError("Enter a valid labor rate.");
    if (isNaN(m) || m < 0) return setError("Enter a valid profit margin (0 or more).");
    setError("");

    const prodRate = PRODUCTION_RATES[btype];
    const hpv = s / prodRate;
    const visitsPerMonth = f * WEEKS_PER_MONTH;
    const totalHours = hpv * visitsPerMonth;
    const laborCost = totalHours * r;
    const profitAmt = laborCost * (m / 100);
    const monthly = laborCost + profitAmt;
    const pricePerVisit = monthly / visitsPerMonth;
    const sqftCost = (monthly / s) * 100;

    setBid({ sqft: s, btype, freq: f, rate: r, margin: m, prodRate, hpv, visitsPerMonth, totalHours, laborCost, profitAmt, monthly, pricePerVisit, sqftCost });
  }

  function downloadBid() {
    if (!bid) return;
    const b = bid;
    const d = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ClearBid — Bid Proposal</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
  body{font-family:'DM Sans',sans-serif;max-width:640px;margin:48px auto;color:#1a1a1a;padding:0 24px;background:#F0EDE8}
  h1{font-size:28px;font-weight:600;letter-spacing:-0.5px;margin-bottom:4px}
  .sub{color:#888;font-size:13px;margin-bottom:36px}
  h2{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#aaa;border-bottom:1px solid #e0e0e0;padding-bottom:8px;margin:28px 0 14px}
  .metrics{display:flex;gap:12px;margin-bottom:8px}
  .m{flex:1;background:#fff;padding:16px;border-radius:14px;border:1px solid rgba(0,0,0,0.06)}
  .ml{font-size:11px;color:#aaa;margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.08em}
  .mv{font-size:22px;font-weight:600;letter-spacing:-0.5px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  td{padding:9px 4px;border-bottom:1px solid #f0f0f0;vertical-align:top}
  td:last-child{text-align:right;font-family:'DM Mono',monospace;font-size:12px}
  tr:last-child td{border-bottom:none;font-weight:600;font-size:15px;font-family:'DM Sans',sans-serif;border-top:2px solid #1a1a1a;padding-top:14px}
  tr:last-child td:last-child{font-family:'DM Sans',sans-serif}
  .footer{margin-top:48px;font-size:11px;color:#bbb;text-align:center}
</style></head><body>
<h1>Bid Proposal</h1>
<div class="sub">Prepared with ClearBid &mdash; ${d}</div>
<div class="metrics">
  <div class="m"><div class="ml">Hours / month</div><div class="mv">${fmtN(b.totalHours)}</div></div>
  <div class="m"><div class="ml">Monthly price</div><div class="mv">${fmt(b.monthly)}</div></div>
  <div class="m"><div class="ml">Price / visit</div><div class="mv">${fmt(b.pricePerVisit)}</div></div>
</div>
<h2>Scope of work</h2>
<table>
  <tr><td>Building type</td><td>${BUILDING_LABELS[b.btype]}</td></tr>
  <tr><td>Square footage</td><td>${b.sqft.toLocaleString()} sqft</td></tr>
  <tr><td>Cleaning frequency</td><td>${b.freq}x per week</td></tr>
  <tr><td>Visits per month</td><td>${fmtN(b.visitsPerMonth)}</td></tr>
</table>
<h2>Cost breakdown</h2>
<table>
  <tr><td>Production rate</td><td>${b.prodRate.toLocaleString()} sqft/hr</td></tr>
  <tr><td>Hours per visit</td><td>${fmtN(b.hpv)} hrs</td></tr>
  <tr><td>Total hours / month</td><td>${fmtN(b.totalHours)} hrs</td></tr>
  <tr><td>Labor rate</td><td>$${b.rate}/hr</td></tr>
  <tr><td>Labor cost</td><td>${fmt(b.laborCost)}</td></tr>
  <tr><td>Profit margin (${b.margin}%)</td><td>${fmt(b.profitAmt)}</td></tr>
  <tr><td>Monthly total</td><td>${fmt(b.monthly)}</td></tr>
</table>
<div class="footer">Generated with ClearBid &bull; This is an estimate based on standard production rates.</div>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clearbid-proposal.html";
    a.click();
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-wrap">
        <div className="header">
          <div className="logo-mark">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="9" width="3" height="9" rx="1" fill="white" opacity=".6"/>
              <rect x="8.5" y="5" width="3" height="13" rx="1" fill="white"/>
              <rect x="14" y="1" width="3" height="17" rx="1" fill="white" opacity=".6"/>
            </svg>
          </div>
          <div>
            <div className="logo-name">ClearBid</div>
            <div className="logo-tag">Janitorial bid calculator</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Building details</div>
          <div className="grid">
            <div className="field full">
              <label htmlFor="sqft">Square footage</label>
              <div className="input-wrap">
                <input id="sqft" type="number" placeholder="e.g. 10000" min="100" step="100" value={sqft} onChange={e => setSqft(e.target.value)} />
                <span className="input-suffix">sqft</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="btype">Building type</label>
              <select id="btype" value={btype} onChange={e => setBtype(e.target.value)}>
                <option value="office">Office (3,500 sqft/hr)</option>
                <option value="medical">Medical (2,500 sqft/hr)</option>
                <option value="school">School (4,000 sqft/hr)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="freq">Cleaning frequency</label>
              <select id="freq" value={freq} onChange={e => setFreq(e.target.value)}>
                <option value="1">1x / week</option>
                <option value="3">3x / week</option>
                <option value="5">5x / week</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Pricing inputs</div>
          <div className="grid">
            <div className="field">
              <label htmlFor="rate">Labor rate</label>
              <div className="input-wrap">
                <input id="rate" type="number" placeholder="e.g. 18" min="1" step="0.5" value={rate} onChange={e => setRate(e.target.value)} />
                <span className="input-suffix">$/hr</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="margin">Profit margin</label>
              <div className="input-wrap">
                <input id="margin" type="number" placeholder="e.g. 25" min="0" max="200" step="1" value={margin} onChange={e => setMargin(e.target.value)} />
                <span className="input-suffix">%</span>
              </div>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" onClick={generateBid}>Generate bid</button>
        </div>

        {bid && (
          <div className="results-card">
            <div className="results-title">Bid summary</div>
            <div className="metrics">
              <div className="metric">
                <div className="metric-label">Hours / month</div>
                <div className="metric-value">{fmtN(bid.totalHours)}</div>
                <div className="metric-sub">{fmtN(bid.hpv)} hrs/visit</div>
              </div>
              <div className="metric">
                <div className="metric-label">Monthly price</div>
                <div className="metric-value">{fmt(bid.monthly)}</div>
                <div className="metric-sub">{Math.round(bid.visitsPerMonth)} visits/mo</div>
              </div>
              <div className="metric">
                <div className="metric-label">Price / visit</div>
                <div className="metric-value">{fmt(bid.pricePerVisit)}</div>
                <div className="metric-sub">${(bid.sqftCost).toFixed(3)}/sqft</div>
              </div>
            </div>
            <div className="breakdown">
              <div className="row"><span className="row-label">Square footage</span><span className="row-value">{bid.sqft.toLocaleString()} sqft</span></div>
              <div className="row"><span className="row-label">Production rate</span><span className="row-value">{bid.prodRate.toLocaleString()} sqft/hr ({BUILDING_LABELS[bid.btype]})</span></div>
              <div className="row"><span className="row-label">Hours per visit</span><span className="row-value">{fmtN(bid.hpv)} hrs</span></div>
              <div className="row"><span className="row-label">Visits per month</span><span className="row-value">{fmtN(bid.visitsPerMonth)} ({bid.freq}x/wk × 4.33)</span></div>
              <div className="row"><span className="row-label">Total hours / month</span><span className="row-value">{fmtN(bid.totalHours)} hrs</span></div>
              <div className="row"><span className="row-label">Labor cost</span><span className="row-value">{fmt(bid.laborCost)}</span></div>
              <div className="row">
                <span className="row-label">Profit margin <span className="tag">{bid.margin}%</span></span>
                <span className="row-value">{fmt(bid.profitAmt)}</span>
              </div>
              <div className="row"><span className="row-label">Monthly total</span><span className="row-value">{fmt(bid.monthly)}</span></div>
            </div>
            <button className="btn-dl" onClick={downloadBid}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 7l3 3 3-3M1 10v1.5A1.5 1.5 0 002.5 13h9a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download bid
            </button>
          </div>
        )}
      </div>
    </>
  );
}
