// js/challan.js

import { PROFILES, SVG_FN, TYPE_LABEL } from './data/profiles.js';

// Global variables for the Challan state
let currentPayId = null;
const paidChallans = new Set(); // Remembers payments during the session

// Your original Hash Function
function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = Math.imul(h, 33) ^ s.charCodeAt(i);
  return Math.abs(h);
}

// Ensure window.toast exists (it's defined in your UI logic)
function triggerToast(msg) {
  if (window.toast) window.toast(msg);
}

export function lookupChallan(val) {
  let q = val || document.getElementById('reg-inp').value;
  q = q.toUpperCase().trim();
  
  if (!q) { triggerToast("Please enter a vehicle number."); return; }
  if (q.length < 4) { triggerToast("Invalid registration number."); return; }

  const out = document.getElementById('ch-result');
  out.innerHTML = `<div style="text-align:center; padding:40px; color:var(--t2)">
    <div class="load-spin"></div><br>Searching RTO database for ${q}...
  </div>`;

  setTimeout(() => {
    // Original profile lookup logic
    const idx = hashStr(q) % PROFILES.length;
    const p = PROFILES[idx];
    
    const profile = {
      ...p,
      registration: q,
      challans: p.challans.map((ch, i) => {
        // Deterministic ID so it remembers paid state correctly
        const challanId = `${q}-${i}-${hashStr(ch.reason)}`;
        const isPaid = paidChallans.has(challanId) || ch.status === 'paid';
        
        return { 
          ...ch, 
          _id: challanId,
          status: isPaid ? 'paid' : 'pending' 
        };
      })
    };
    renderResult(profile, q, out);
  }, 600 + Math.random() * 600);
}

export function quickLook(reg) {
  document.getElementById('reg-inp').value = reg;
  lookupChallan(reg);
  setTimeout(() => document.getElementById('ch-result').scrollIntoView({ behavior:'smooth', block:'start' }), 150);
}

// Your exact original HTML rendering algorithm
function renderResult(d, plate, out) {
  const pending  = d.challans.filter(c => c.status === 'pending');
  const totalAmt = pending.reduce((s, c) => s + c.amount, 0);
  const svgFn    = SVG_FN[d.type] || SVG_FN.bike;

  const cards = d.challans.length === 0
    ? `<div class="no-res" style="padding:24px 0">
         <div style="font-size:42px; margin-bottom:12px">🎉</div>
         <div style="color:var(--green); font-weight:700">No Pending Challans!</div>
         <div style="font-size:12px; margin-top:4px; opacity:.6">Ride safe.</div>
       </div>`
    : d.challans.map(c => `
      <div class="card ch-card ch-${c.status}" id="card-${c._id}">
        <div class="cch-top">
          <div class="cch-ico">${c.icon}</div>
          <div>
            <div class="cch-rsn">${c.reason}</div>
            <div class="cch-id">ID: ${c._id.toUpperCase()} · ${c.law}</div>
          </div>
          <span class="sbadge s-${c.status}">${c.status === 'pending' ? '⚠️ Pending' : '✅ Paid'}</span>
        </div>
        <div class="cch-meta"><div class="cch-mc">📍 ${c.zone}</div></div>
        <div class="cch-amt-row">
          <div>
            <div style="font-size:11px;color:var(--t2);margin-bottom:2px">Fine Amount</div>
            <div class="cch-amt ${c.status === 'paid' ? 'cch-amt-paid' : ''}">₹${c.amount.toLocaleString('en-IN')}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;color:var(--t2);margin-bottom:2px">Under</div>
            <div style="font-size:12px;color:var(--t3)">${c.law}</div>
          </div>
        </div>
        <div class="cch-actions">
          ${c.status === 'pending'
            ? `<button class="btn btn-accent" onclick="openPay('${c._id}',${c.amount},'${c.reason.replace(/'/g, "\\'")}')">💳 Pay Now</button>
               <button class="btn btn-ghost" onclick="disputeIt('${c._id}')">⚠️ Dispute</button>`
            : `<button class="btn btn-green" disabled>✅ Paid</button>
               <button class="btn btn-ghost" onclick="toast('🧾 Receipt sent to registered email!')">🧾 Receipt</button>`
          }
        </div>
      </div>`).join('');

  out.innerHTML = `
    <div class="veh-card card">
      <div class="veh-banner" style="background:linear-gradient(135deg,${d.color}28 0%,${d.color}44 100%)">
        ${svgFn(d.color)}
        <div class="veh-banner-grad"></div>
      </div>
      <div class="veh-info">
        <div class="veh-name">${d.vehicle}</div>
        <div class="veh-own">👤 ${d.name} &nbsp;·&nbsp; 📞 ${d.phone}</div>
        <div class="veh-meta">
          <div class="vm-chip">🔖 ${plate}</div>
          <div class="vm-chip">${TYPE_LABEL[d.type] || '🚗 Vehicle'}</div>
          ${pending.length > 0
            ? `<div class="vm-pend">⚠️ ${pending.length} Pending · ₹${totalAmt.toLocaleString('en-IN')} Due</div>`
            : `<div class="vm-chip" style="color:var(--green)">✅ No Pending Challans</div>`}
        </div>
      </div>
    </div>
    <div class="sec-label">Challan History</div>
    <div class="ch-cards">${cards}</div>`;
}

// Payment Modal Logic
export function openPay(id, amt, rsn) {
  currentPayId = id;
  document.getElementById('ps-ttl').textContent = 'Pay Challan';
  document.getElementById('ps-amt').textContent = `₹${Number(amt).toLocaleString('en-IN')}`;
  document.getElementById('ps-rsn').textContent = rsn;
  document.getElementById('pay-ov').classList.add('on');
}

export function closePay() { 
  document.getElementById('pay-ov').classList.remove('on'); 
}

export function selPM(el) {
  document.querySelectorAll('.pm').forEach(m => m.classList.remove('sel'));
  el.classList.add('sel');
}

export function confirmPay() {
  closePay();
  triggerToast('✅ Payment successful! Challan cleared.');
  if (!currentPayId) return;
  
  // Record the payment
  paidChallans.add(currentPayId);
  
  const card = document.getElementById('card-' + currentPayId);
  if (!card) return;
  
  card.classList.replace('ch-pend', 'ch-paid');
  card.querySelector('.sbadge').className = 'sbadge s-paid';
  card.querySelector('.sbadge').textContent = '✅ Paid';
  const amt = card.querySelector('.cch-amt');
  if (amt) amt.classList.add('cch-amt-paid');
  const acts = card.querySelector('.cch-actions');
  if (acts) acts.innerHTML = `
    <button class="btn btn-green" disabled>✅ Paid</button>
    <button class="btn btn-ghost" onclick="toast('🧾 Receipt sent to registered email!')">🧾 Receipt</button>`;
}

export function disputeIt(id) { 
  triggerToast('📝 Dispute filed for ' + id.toUpperCase() + '. You will hear back in 7 working days.'); 
}
