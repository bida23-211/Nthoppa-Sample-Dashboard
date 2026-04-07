import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  black: "#0A0A0A", dark: "#111111", card: "#161616", border: "#232323",
  borderLight: "#2C2C2C", orange: "#FF6B00", orangeHover: "#FF8533",
  orangeDim: "rgba(255,107,0,0.10)", orangeMid: "rgba(255,107,0,0.18)",
  white: "#FFFFFF", offWhite: "#F0F0F0", muted: "#777777", mutedMid: "#555555",
  green: "#16A34A", greenDim: "rgba(22,163,74,0.12)", greenBright: "#22C55E",
  red: "#DC2626", redDim: "rgba(220,38,38,0.12)",
  yellow: "#CA8A04", yellowDim: "rgba(202,138,4,0.12)", yellowBright: "#EAB308",
  blue: "#2563EB", blueDim: "rgba(37,99,235,0.12)",
};

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const loanApplications = [
  { id: "L-101", group: "Tshwaragano Savings Group", purpose: "Inventory purchase for retail business", amount: 12000, duration: 6, risk: "Low", score: 85, requested: "Aug 20, 2023", status: "pending", lender: "BrightFund", votes: "8/12" },
  { id: "L-102", group: "Kopano Women's Collective", purpose: "Equipment for catering business", amount: 8000, duration: 4, risk: "Medium", score: 72, requested: "Aug 18, 2023", status: "pending", lender: "GrowCapital", votes: "6/8" },
  { id: "L-103", group: "Unity Farmers Association", purpose: "Agricultural machinery purchase", amount: 15000, duration: 8, risk: "High", score: 48, requested: "Aug 15, 2023", status: "pending", lender: "SeedFund", votes: "9/15" },
];
const mMotshelo = [
  { id: "MG-01", name: "Tshwaragano Savings Group", members: 12, fund: 146235, nextPayment: "Sep 3, 2023", loans: 2, health: 88, liquid: 87741, hold: 58494, contributed: 120000, interest: 26235, growth: "+12%" },
  { id: "MG-02", name: "Kopano Women's Collective", members: 8, fund: 89420, nextPayment: "Sep 10, 2023", loans: 1, health: 74, liquid: 53652, hold: 35768, contributed: 80000, interest: 9420, growth: "+8%" },
  { id: "MG-03", name: "Boiteko Progress Group", members: 15, fund: 203000, nextPayment: "Aug 28, 2023", loans: 3, health: 92, liquid: 121800, hold: 81200, contributed: 175000, interest: 28000, growth: "+16%" },
];
const savingsData = [
  { month: "Mar", amount: 4200 }, { month: "Apr", amount: 5100 },
  { month: "May", amount: 4800 }, { month: "Jun", amount: 6300 },
  { month: "Jul", amount: 7200 }, { month: "Aug", amount: 8500 },
];
const liveActivity = [
  { icon: "💰", text: "Tshwaragano Group contributed P5,000", time: "2m ago", type: "deposit" },
  { icon: "✅", text: "Loan #L-102 was approved by members", time: "8m ago", type: "approval" },
  { icon: "📤", text: "BWP 8,000 disbursed to Kopano Women's", time: "15m ago", type: "disburse" },
  { icon: "🔔", text: "Unity Farmers payment due in 3 days", time: "1h ago", type: "reminder" },
  { icon: "👤", text: "New member joined Boiteko Group", time: "2h ago", type: "member" },
  { icon: "📊", text: "AI risk assessment completed for L-103", time: "3h ago", type: "ai" },
];
const LOAN_STAGES = ["Applied", "Under Review", "Disbursed", "Repaying", "Closed"];
const finTips = [
  { title: "Save First", tip: "Save 10% of all income before spending anything else.", icon: "🏦" },
  { title: "Rule of 72", tip: "Divide 72 by your interest rate to find how fast money doubles.", icon: "⚡" },
  { title: "Loan Discipline", tip: "Only borrow for assets that generate income — not consumption.", icon: "🎯" },
  { title: "Motshelo Power", tip: "Collective savings grow 3x faster through group accountability.", icon: "👥" },
];
const partnerBadges = [
  { name: "Visa", type: "Payment", color: "#1A1FE8", icon: "💳" },
  { name: "Orange Money", type: "Mobile Money", color: "#FF6B00", icon: "📱" },
  { name: "Core Banking API", type: "Banking", color: "#16A34A", icon: "🏛️" },
  { name: "Smile ID", type: "KYC", color: "#7C3AED", icon: "🪪" },
  { name: "CRB Connect", type: "Credit", color: "#CA8A04", icon: "📈" },
  { name: "AWS", type: "Infrastructure", color: "#2563EB", icon: "☁️" },
];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ children, variant = "orange" }) => {
  const variants = {
    orange: { bg: C.orangeDim, color: C.orange, border: "rgba(255,107,0,0.25)" },
    green: { bg: C.greenDim, color: C.greenBright, border: "rgba(34,197,94,0.25)" },
    red: { bg: C.redDim, color: "#F87171", border: "rgba(239,68,68,0.25)" },
    yellow: { bg: C.yellowDim, color: C.yellowBright, border: "rgba(234,179,8,0.25)" },
    blue: { bg: C.blueDim, color: "#60A5FA", border: "rgba(96,165,250,0.25)" },
    muted: { bg: "rgba(255,255,255,0.05)", color: C.muted, border: C.border },
  };
  const v = variants[variant] || variants.orange;
  return (
    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700,
      letterSpacing:"0.02em", background:v.bg, color:v.color, border:`1px solid ${v.border}` }}>
      {children}
    </span>
  );
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16,
    padding:22, transition:"all 0.2s", cursor:onClick?"pointer":undefined,
    ...(onClick ? {} : {}), ...style }}
    onMouseEnter={e => { if(onClick) e.currentTarget.style.borderColor = "rgba(255,107,0,0.35)"; }}
    onMouseLeave={e => { if(onClick) e.currentTarget.style.borderColor = C.border; }}>
    {children}
  </div>
);

const ProgressBar = ({ value, max = 100, color = C.orange, height = 6 }) => (
  <div style={{ background:C.border, borderRadius:99, overflow:"hidden", height }}>
    <div style={{ width:`${Math.min((value/max)*100, 100)}%`, height:"100%", borderRadius:99,
      background:`linear-gradient(90deg, ${color}, ${color}bb)`, transition:"width 0.8s ease" }} />
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom:20 }}>
    <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:700, color:C.white, marginBottom:sub?4:0 }}>{children}</h2>
    {sub && <p style={{ color:C.muted, fontSize:12 }}>{sub}</p>}
  </div>
);

const OrangeBtn = ({ children, onClick, style = {}, small }) => (
  <button onClick={onClick} style={{ background:C.orange, color:"#fff", border:"none", borderRadius:10,
    padding:small?"7px 14px":"10px 22px", fontSize:small?12:13, fontWeight:700, cursor:"pointer",
    fontFamily:"inherit", transition:"all 0.18s", ...style }}
    onMouseEnter={e => e.currentTarget.style.background = C.orangeHover}
    onMouseLeave={e => e.currentTarget.style.background = C.orange}>
    {children}
  </button>
);

const GhostBtn = ({ children, onClick, style = {}, small }) => (
  <button onClick={onClick} style={{ background:"transparent", color:C.muted, border:`1px solid ${C.borderLight}`,
    borderRadius:10, padding:small?"7px 14px":"10px 22px", fontSize:small?12:13, fontWeight:600,
    cursor:"pointer", fontFamily:"inherit", transition:"all 0.18s", ...style }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = "#F87171"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.muted; }}>
    {children}
  </button>
);

// ─── LOAN STAGE TRACKER ───────────────────────────────────────────────────────
const LoanStageTracker = ({ stage = 1 }) => (
  <div style={{ display:"flex", alignItems:"center", gap:0, margin:"12px 0" }}>
    {LOAN_STAGES.map((s, i) => (
      <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:0 }}>
          <div style={{ width:26, height:26, borderRadius:"50%", border:`2px solid ${i<=stage?C.orange:C.border}`,
            background:i<stage?C.orange:i===stage?C.orangeDim:"transparent",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700,
            color:i<stage?"#fff":i===stage?C.orange:C.mutedMid, flexShrink:0 }}>
            {i < stage ? "✓" : i+1}
          </div>
          <span style={{ fontSize:9, color:i<=stage?C.orange:C.muted, marginTop:4, textAlign:"center",
            fontWeight:i===stage?700:400, whiteSpace:"nowrap" }}>{s}</span>
        </div>
        {i < LOAN_STAGES.length-1 && (
          <div style={{ flex:1, height:2, background:i<stage?C.orange:C.border, margin:"0 2px", marginBottom:16 }} />
        )}
      </div>
    ))}
  </div>
);

// ─── RISK METER ───────────────────────────────────────────────────────────────
const RiskMeter = ({ score, risk }) => {
  const color = risk==="Low"?C.greenBright:risk==="Medium"?C.yellowBright:"#F87171";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative", width:44, height:44 }}>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke={C.border} strokeWidth="4"/>
          <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${(score/100)*113} 113`}
            strokeLinecap="round" transform="rotate(-90 22 22)"/>
        </svg>
        <span style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          fontSize:9, fontWeight:800, color }}>{score}</span>
      </div>
      <div>
        <div style={{ fontSize:11, fontWeight:700, color }}>{risk} Risk</div>
        <div style={{ fontSize:10, color:C.muted }}>AI Score</div>
      </div>
    </div>
  );
};

// ─── LIVE ACTIVITY FEED ───────────────────────────────────────────────────────
const LiveFeed = () => {
  const [items, setItems] = useState(liveActivity);
  const [flash, setFlash] = useState(null);
  useEffect(() => {
    const t = setInterval(() => {
      const newItem = { icon:"🔄", text:`Transaction #TXN-${Math.floor(Math.random()*9000+1000)} processed`, time:"just now", type:"tx" };
      setItems(prev => [newItem, ...prev.slice(0,5)]);
      setFlash(0);
      setTimeout(()=>setFlash(null), 1000);
    }, 8000);
    return ()=>clearInterval(t);
  }, []);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {items.map((item,i) => (
        <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px", borderRadius:10,
          background:i===flash?"rgba(255,107,0,0.08)":C.black, border:`1px solid ${i===flash?C.orange:C.border}`,
          transition:"all 0.5s" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ color:C.offWhite, fontSize:12, fontWeight:500, margin:0 }}>{item.text}</p>
            <p style={{ color:C.muted, fontSize:10, margin:"2px 0 0" }}>{item.time}</p>
          </div>
          {i===0&&flash===0&&<span style={{ fontSize:9, fontWeight:700, color:C.orange, flexShrink:0 }}>LIVE</span>}
        </div>
      ))}
    </div>
  );
};

// ─── FUND FLOW MAP ────────────────────────────────────────────────────────────
const FundFlowMap = ({ onClose }) => {
  const steps = [
    { icon:"👤", label:"You", sub:"Member / Lender" },
    { icon:"💳", label:"Payment Channel", sub:"Visa / Orange Money" },
    { icon:"🏦", label:"Nthoppa Wallet", sub:"Custody: Partner Bank" },
    { icon:"🔒", label:"Motshelo Pool", sub:"60% Liquid / 40% Hold" },
    { icon:"📤", label:"Loan Disbursed", sub:"To Group Member" },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:999,
      display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.dark, border:`1px solid ${C.border}`,
        borderRadius:20, padding:32, maxWidth:640, width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:700, color:C.white }}>Fund Flow Map</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:0, overflowX:"auto", paddingBottom:8 }}>
          {steps.map((s,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", flex:1, minWidth:0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:C.orangeDim,
                  border:`1px solid rgba(255,107,0,0.3)`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:22, marginBottom:8 }}>{s.icon}</div>
                <p style={{ color:C.white, fontSize:11, fontWeight:700, textAlign:"center", margin:0 }}>{s.label}</p>
                <p style={{ color:C.muted, fontSize:10, textAlign:"center", margin:"2px 0 0" }}>{s.sub}</p>
              </div>
              {i<steps.length-1&&<div style={{ width:24, height:2, background:`linear-gradient(90deg,${C.orange},${C.orangeDim})`,
                flexShrink:0, margin:"0 2px 24px" }}/>}
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, padding:"12px 16px", borderRadius:10, background:"rgba(255,107,0,0.06)",
          border:`1px solid ${C.orangeDim}` }}>
          <p style={{ color:C.muted, fontSize:12, margin:0 }}>
            🔒 Funds are held in a <strong style={{color:C.white}}>regulated trust account</strong> until disbursed. 
            All movements are fully auditable and reported to NBFIRA.
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── LOAN CALCULATOR ─────────────────────────────────────────────────────────
const LoanCalculator = () => {
  const [amount, setAmount] = useState(10000);
  const [months, setMonths] = useState(6);
  const interest = 0.05;
  const total = amount * (1 + interest);
  const monthly = total / months;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div>
        <label style={{ color:C.muted, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Loan Amount (BWP)</label>
        <input type="range" min={1000} max={50000} step={500} value={amount}
          onChange={e=>setAmount(+e.target.value)}
          style={{ width:"100%", accentColor:C.orange }} />
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted, fontSize:11 }}>BWP 1,000</span>
          <span style={{ color:C.orange, fontWeight:700, fontSize:14 }}>BWP {amount.toLocaleString()}</span>
          <span style={{ color:C.muted, fontSize:11 }}>BWP 50,000</span>
        </div>
      </div>
      <div>
        <label style={{ color:C.muted, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Duration (months)</label>
        <div style={{ display:"flex", gap:8 }}>
          {[1,2,3,4,6,8].map(m=>(
            <button key={m} onClick={()=>setMonths(m)}
              style={{ flex:1, padding:"8px 0", borderRadius:8, border:`1px solid ${m===months?C.orange:C.border}`,
                background:m===months?C.orangeDim:"transparent", color:m===months?C.orange:C.muted,
                fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>{m}m</button>
          ))}
        </div>
      </div>
      <div style={{ background:C.black, borderRadius:12, padding:"16px", border:`1px solid ${C.border}` }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          {[
            { label:"Principal", val:`BWP ${amount.toLocaleString()}`, color:C.white },
            { label:"5% Interest", val:`BWP ${(amount*0.05).toLocaleString()}`, color:C.yellowBright },
            { label:"Total Repay", val:`BWP ${total.toLocaleString()}`, color:C.orange },
          ].map((r,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <p style={{ color:C.muted, fontSize:10, marginBottom:4 }}>{r.label}</p>
              <p style={{ color:r.color, fontWeight:800, fontSize:13 }}>{r.val}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, textAlign:"center" }}>
          <p style={{ color:C.muted, fontSize:11 }}>Monthly payment: <strong style={{color:C.white}}>BWP {monthly.toFixed(0)}</strong></p>
        </div>
      </div>
    </div>
  );
};

// ─── SAVINGS GOAL SETTER ──────────────────────────────────────────────────────
const SavingsGoalSetter = () => {
  const [goal, setGoal] = useState("School Fees");
  const [target, setTarget] = useState(20000);
  const [weeks, setWeeks] = useState(52);
  const weekly = (target / weeks).toFixed(0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div>
        <label style={{ color:C.muted, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Goal Name</label>
        <select value={goal} onChange={e=>setGoal(e.target.value)}
          style={{ width:"100%", background:C.black, border:`1px solid ${C.border}`, borderRadius:8,
            padding:"8px 12px", color:C.white, fontSize:13, fontFamily:"inherit", outline:"none" }}>
          {["School Fees","Emergency Fund","Business Capital","Car","Home Deposit","Wedding"].map(g=>(
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={{ color:C.muted, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Target Amount (BWP)</label>
        <input type="number" value={target} onChange={e=>setTarget(+e.target.value)}
          style={{ width:"100%", background:C.black, border:`1px solid ${C.border}`, borderRadius:8,
            padding:"8px 12px", color:C.white, fontSize:13, fontFamily:"inherit", outline:"none" }}/>
      </div>
      <div>
        <label style={{ color:C.muted, fontSize:11, fontWeight:600, display:"block", marginBottom:6 }}>Save Over (weeks)</label>
        <input type="range" min={4} max={156} step={4} value={weeks}
          onChange={e=>setWeeks(+e.target.value)} style={{ width:"100%", accentColor:C.orange }} />
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted, fontSize:11 }}>4 weeks</span>
          <span style={{ color:C.orange, fontWeight:700, fontSize:13 }}>{weeks} weeks ({(weeks/52).toFixed(1)}y)</span>
          <span style={{ color:C.muted, fontSize:11 }}>3 years</span>
        </div>
      </div>
      <div style={{ background:C.orangeDim, border:`1px solid rgba(255,107,0,0.25)`, borderRadius:12, padding:14, textAlign:"center" }}>
        <p style={{ color:C.muted, fontSize:11, margin:"0 0 4px" }}>Save this much every week</p>
        <p style={{ color:C.orange, fontWeight:800, fontSize:24, margin:0 }}>BWP {Number(weekly).toLocaleString()}</p>
        <p style={{ color:C.muted, fontSize:11, margin:"4px 0 0" }}>to reach your {goal} goal of BWP {target.toLocaleString()}</p>
      </div>
    </div>
  );
};

// ─── KYC PROFILE BADGE ────────────────────────────────────────────────────────
const KYCBadge = ({ level }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:10,
    background:level>=1?C.greenDim:"rgba(255,255,255,0.04)", border:`1px solid ${level>=1?"rgba(34,197,94,0.25)":C.border}` }}>
    <span style={{ fontSize:16 }}>{level>=2?"🛡️":level>=1?"✅":"⏳"}</span>
    <div>
      <p style={{ color:C.white, fontSize:12, fontWeight:700, margin:0 }}>
        KYC Level {level} {level>=1?"(Verified)":"(Pending)"}
      </p>
      <p style={{ color:C.muted, fontSize:10, margin:0 }}>via Smile ID • {level>=2?"Full Access":"Basic Access"}</p>
    </div>
    {level < 2 && <OrangeBtn small style={{ marginLeft:"auto" }}>Upgrade ›</OrangeBtn>}
  </div>
);

// ─── AUTO SAVE RULE ───────────────────────────────────────────────────────────
const AutoSaveRule = () => {
  const [enabled, setEnabled] = useState(true);
  const [pct, setPct] = useState(10);
  const [dest, setDest] = useState("Personal Savings");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ color:C.white, fontSize:13, fontWeight:600, margin:0 }}>Auto-Save Active</p>
          <p style={{ color:C.muted, fontSize:11, margin:"2px 0 0" }}>On every incoming deposit</p>
        </div>
        <div onClick={()=>setEnabled(!enabled)} style={{ width:44, height:24, borderRadius:99,
          background:enabled?C.orange:C.border, cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute",
            top:3, left:enabled?23:3, transition:"left 0.2s" }} />
        </div>
      </div>
      {enabled && (
        <>
          <div>
            <label style={{ color:C.muted, fontSize:11, marginBottom:4, display:"block" }}>Auto-save percentage</label>
            <input type="range" min={1} max={50} value={pct} onChange={e=>setPct(+e.target.value)}
              style={{ width:"100%", accentColor:C.orange }} />
            <div style={{ textAlign:"center", color:C.orange, fontWeight:800, fontSize:18 }}>{pct}%</div>
          </div>
          <div>
            <label style={{ color:C.muted, fontSize:11, marginBottom:4, display:"block" }}>Destination</label>
            <select value={dest} onChange={e=>setDest(e.target.value)}
              style={{ width:"100%", background:C.black, border:`1px solid ${C.border}`, borderRadius:8,
                padding:"8px 12px", color:C.white, fontSize:13, fontFamily:"inherit", outline:"none" }}>
              <option>Personal Savings</option>
              <option>Tshwaragano Motshelo</option>
              <option>Emergency Fund</option>
            </select>
          </div>
          <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(255,107,0,0.06)", border:`1px solid ${C.orangeDim}` }}>
            <p style={{ color:C.muted, fontSize:11, margin:0 }}>
              On a deposit of <strong style={{color:C.white}}>BWP 1,000</strong>, 
              <strong style={{color:C.orange}}> BWP {(1000*pct/100).toFixed(0)}</strong> will automatically go to <strong style={{color:C.white}}>{dest}</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ─── MOTSHELO RULES ───────────────────────────────────────────────────────────
const MotsheloRules = () => (
  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
    {[
      { icon:"📋", title:"Borrowing Rules", color:C.blue,
        text:"Micro-lenders can borrow up to 3× their contributed capital from the group pool. All loans require a 70% vote from active members." },
      { icon:"💸", title:"Repayment & Interest", color:C.yellowBright,
        text:"Loans incur a flat 5% interest. Repayment is mandatory within 1–6 months. Late payments incur a 1% daily penalty (capped at 25%)." },
      { icon:"⚠️", title:"Default Management", color:"#F87171",
        text:"In case of default, the member's savings are frozen and the group votes on restructuring or legal action." },
      { icon:"🔒", title:"Liquidity Split", color:C.greenBright,
        text:"Group funds maintain a 60/40 split: 60% liquid for loan disbursements, 40% in secure hold for stability." },
    ].map((r,i)=>(
      <div key={i} style={{ display:"flex", gap:14, padding:"14px 16px", borderRadius:12,
        background:C.black, border:`1px solid ${C.border}` }}>
        <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,0.04)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
          {r.icon}
        </div>
        <div>
          <p style={{ color:r.color, fontSize:13, fontWeight:700, margin:"0 0 4px" }}>{r.title}</p>
          <p style={{ color:C.muted, fontSize:12, margin:0, lineHeight:1.5 }}>{r.text}</p>
        </div>
      </div>
    ))}
  </div>
);

// ─── SYSTEM HEALTH ────────────────────────────────────────────────────────────
const SystemHealth = () => {
  const metrics = [
    { label:"Total Motshelo Fund Growth (MoM)", value:"+12%", color:C.greenBright, icon:"📈" },
    { label:"New Lender-Group Matches (7d)", value:"5 lenders ↔ 3 groups", color:C.orange, icon:"🔗" },
    { label:"Active Users", value:"1,240", color:C.white, icon:"👥" },
    { label:"New Groups (This Month)", value:"8", color:C.yellowBright, icon:"🏘️" },
    { label:"Avg. Lender Return", value:"12.5% APR", color:C.greenBright, icon:"⭐" },
    { label:"Avg. Cost per Active User", value:"$0.40", color:C.muted, icon:"💡" },
    { label:"Monthly Cloud Infrastructure", value:"$450", color:C.muted, icon:"☁️" },
    { label:"Transaction Fee Income", value:"1.5% per loan", color:C.orange, icon:"💰" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
      {metrics.map((m,i)=>(
        <div key={i} style={{ background:C.black, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px" }}>
          <p style={{ color:C.muted, fontSize:11, margin:"0 0 6px" }}><span style={{marginRight:6}}>{m.icon}</span>{m.label}</p>
          <p style={{ color:m.color, fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:20, margin:0 }}>{m.value}</p>
        </div>
      ))}
      <div style={{ gridColumn:"1/-1", padding:"12px 16px", borderRadius:12, background:C.greenDim,
        border:`1px solid rgba(34,197,94,0.2)`, display:"flex", alignItems:"center", gap:10 }}>
        <span style={{fontSize:18}}>✅</span>
        <p style={{ color:C.greenBright, fontSize:13, fontWeight:600, margin:0 }}>
          Platform is sustainable at current user volume. Break-even projected at 2,400 active users.
        </p>
      </div>
    </div>
  );
};

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const layers = [
    { layer:"Layer 1", name:"Access", items:["Web App","Mobile App (Android/iOS)"], color:C.orange },
    { layer:"Layer 2", name:"Security & KYC", items:["Auth0","Smile ID","Cloudflare WAF"], color:"#7C3AED" },
    { layer:"Layer 3", name:"Nthoppa Core Engine", items:["Loan Matching","Savings Manager","Motshelo Rules Engine"], color:C.orange },
    { layer:"Layer 4", name:"Payments", items:["Stripe Connect","Orange Money API","Visa Payment Rails"], color:C.greenBright },
    { layer:"Layer 5", name:"Infrastructure", items:["AWS / GCP","PostgreSQL","Redis Cache"], color:"#60A5FA" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {layers.map((l,i)=>(
        <div key={i} style={{ display:"flex", gap:16, alignItems:"stretch" }}>
          <div style={{ width:3, background:l.color, borderRadius:99, flexShrink:0 }} />
          <div style={{ flex:1, background:C.black, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
              <Badge variant={l.color===C.orange?"orange":l.color===C.greenBright?"green":"blue"}>{l.layer}</Badge>
              <h4 style={{ color:C.white, fontSize:14, fontWeight:700, margin:0 }}>{l.name}</h4>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {l.items.map(item=>(
                <span key={item} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8,
                  padding:"4px 10px", fontSize:11, color:C.muted }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const PAGES = ["Overview","Micro-Lender","Motshelo Groups","Personal Savings","Tools","Security","System Analytics","How It Works"];

export default function NthoppaEcosystem() {
  const [page, setPage] = useState("Overview");
  const [loanStatus, setLoanStatus] = useState({});
  const [showFundFlow, setShowFundFlow] = useState(false);
  const [showLiteracyHub, setShowLiteracyHub] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [kycLevel] = useState(1);
  const [twoFA, setTwoFA] = useState(true);
  const [motGroup, setMotGroup] = useState(0);
  const [motTab, setMotTab] = useState("Overview");
  const maxSav = Math.max(...savingsData.map(d=>d.amount));

  useEffect(()=>{
    const t = setInterval(()=>setTipIndex(p=>(p+1)%finTips.length), 5000);
    return ()=>clearInterval(t);
  },[]);

  const approveLoan = (id)=>setLoanStatus(s=>({...s,[id]:"approved"}));
  const declineLoan = (id)=>setLoanStatus(s=>({...s,[id]:"declined"}));
  const loanState = (id)=>loanStatus[id]||"pending";

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:${C.black};}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:${C.dark};}
    ::-webkit-scrollbar-thumb{background:${C.orange};border-radius:2px;}
    input[type=range]{-webkit-appearance:none;height:4px;border-radius:99px;background:${C.border};}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${C.orange};cursor:pointer;}
    select option{background:${C.dark};}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
    .fade-in{animation:fadeIn 0.3s ease;}
    .nav-item{cursor:pointer;padding:9px 14px;border-radius:10px;font-size:13px;font-weight:600;
      transition:all 0.18s;color:${C.muted};border:1px solid transparent;white-space:nowrap;display:flex;align-items:center;gap:8px;}
    .nav-item:hover{color:${C.white};background:rgba(255,255,255,0.04);}
    .nav-item.active{color:${C.orange};background:${C.orangeDim};border-color:rgba(255,107,0,0.2);}
    .stat-hover{transition:all 0.2s;}
    .stat-hover:hover{border-color:rgba(255,107,0,0.3)!important;transform:translateY(-1px);}
  `;

  const navIcons = {"Overview":"🏠","Micro-Lender":"🏦","Motshelo Groups":"👥","Personal Savings":"🐖",
    "Tools":"🛠️","Security":"🔒","System Analytics":"📊","How It Works":"🗺️"};

  // ── SIDEBAR ─────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{ width:220, flexShrink:0, background:C.dark, borderRight:`1px solid ${C.border}`,
      display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, overflowY:"auto" }}>
      {/* Logo */}
      <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, background:C.orange, borderRadius:10,
            display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif",
            fontWeight:800, fontSize:16, color:"#fff", flexShrink:0 }}>N</div>
          <div>
            <p style={{ color:C.white, fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:15, margin:0 }}>Nthoppa</p>
            <p style={{ color:C.muted, fontSize:10, margin:0 }}>Financial Ecosystem</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ padding:"12px 10px", flex:1 }}>
        {PAGES.map(p=>(
          <div key={p} className={`nav-item${page===p?" active":""}`} onClick={()=>{setPage(p);setMobileNav(false);}}>
            <span>{navIcons[p]}</span>{p}
          </div>
        ))}
      </nav>
      {/* KYC */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
        <KYCBadge level={kycLevel}/>
      </div>
      {/* Connected Services */}
      <div style={{ padding:"14px", borderTop:`1px solid ${C.border}` }}>
        <p style={{ color:C.muted, fontSize:10, fontWeight:700, letterSpacing:"0.08em", marginBottom:8, textTransform:"uppercase" }}>Connected Services</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {partnerBadges.map(pb=>(
            <div key={pb.name} title={`${pb.name} — ${pb.type}`}
              style={{ padding:"3px 8px", borderRadius:6, background:"rgba(255,255,255,0.04)",
                border:`1px solid ${C.border}`, fontSize:10, color:C.muted, cursor:"default" }}>
              {pb.icon} {pb.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── OVERVIEW PAGE ──────────────────────────────────────────────────────────
  const OverviewPage = () => (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Inclusion Banner */}
      <div style={{ padding:"14px 20px", borderRadius:14, background:`linear-gradient(135deg,rgba(255,107,0,0.12),rgba(255,107,0,0.04))`,
        border:`1px solid rgba(255,107,0,0.25)`, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <span style={{fontSize:22}}>🌍</span>
        <div style={{flex:1}}>
          <p style={{ color:C.orange, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13, margin:"0 0 2px" }}>
            Digitally linking you to the formal financial sector
          </p>
          <p style={{ color:C.muted, fontSize:12, margin:0 }}>100% transaction transparency guaranteed • Regulated by NBFIRA • FATF Compliant</p>
        </div>
        <OrangeBtn small onClick={()=>setShowFundFlow(true)}>View Fund Flow</OrangeBtn>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
        {[
          { label:"Total Wallet Balance", val:"BWP 43,000", sub:"↑ 5.2% vs last month", subColor:C.greenBright, icon:"💰" },
          { label:"Active Loans", val:"4", sub:"Across 2 lenders", subColor:C.muted, icon:"📋" },
          { label:"Total Invested", val:"BWP 17,500", sub:"↑ 12.3% ROI", subColor:C.greenBright, icon:"📈" },
          { label:"Avg. Return Rate", val:"12.5%", sub:"↑ 1.2% this month", subColor:C.greenBright, icon:"⭐" },
        ].map((s,i)=>(
          <Card key={i} style={{}} >
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <p style={{ color:C.muted, fontSize:12, fontWeight:500 }}>{s.label}</p>
              <span style={{fontSize:20}}>{s.icon}</span>
            </div>
            <p style={{ fontFamily:"'Sora',sans-serif", fontSize:24, fontWeight:800, color:C.white, marginBottom:4 }}>{s.val}</p>
            <p style={{ fontSize:11, color:s.subColor }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Mid row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16, flexWrap:"wrap" }}>
        {/* Savings Chart */}
        <Card>
          <SectionTitle>Monthly Savings Growth</SectionTitle>
          <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:140, paddingBottom:4 }}>
            {savingsData.map((d,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:"100%", borderRadius:"6px 6px 0 0",
                  background:`linear-gradient(180deg,${C.orangeHover},${C.orange})`,
                  height:`${(d.amount/maxSav)*120}px`, transition:"height 0.6s ease", minHeight:4 }}/>
                <span style={{color:C.muted,fontSize:10}}>{d.month}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`,
            display:"flex", gap:24 }}>
            {[{l:"Current",v:"BWP 8,500"},{l:"Total Saved",v:"BWP 36,100"},{l:"Goal",v:"BWP 50,000",c:C.orange}].map((x,i)=>(
              <div key={i}><p style={{color:C.muted,fontSize:11,marginBottom:2}}>{x.l}</p>
                <p style={{color:x.c||C.white,fontWeight:700,fontSize:15}}>{x.v}</p></div>
            ))}
          </div>
        </Card>

        {/* Live Activity */}
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <SectionTitle>Live Activity</SectionTitle>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.orange, animation:"pulse 2s infinite" }}/>
              <span style={{color:C.orange,fontSize:10,fontWeight:700}}>LIVE</span>
            </div>
          </div>
          <LiveFeed/>
        </Card>
      </div>

      {/* Auto-Save + Financial Tip */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <SectionTitle>Auto-Save Rules" sub="Configure automatic savings on deposits</SectionTitle>
          <AutoSaveRule/>
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <SectionTitle>Financial Literacy Hub</SectionTitle>
            <OrangeBtn small onClick={()=>setShowLiteracyHub(true)}>All Tips</OrangeBtn>
          </div>
          <div style={{ padding:"20px", borderRadius:14, background:C.black, border:`1px solid ${C.border}`, minHeight:120,
            display:"flex", flexDirection:"column", justifyContent:"center", transition:"all 0.5s" }}>
            <span style={{fontSize:28,display:"block",marginBottom:8}}>{finTips[tipIndex].icon}</span>
            <p style={{color:C.orange,fontWeight:700,fontSize:14,marginBottom:6}}>{finTips[tipIndex].title}</p>
            <p style={{color:C.muted,fontSize:13,lineHeight:1.5,margin:0}}>{finTips[tipIndex].tip}</p>
          </div>
          <div style={{display:"flex",gap:6,marginTop:12,justifyContent:"center"}}>
            {finTips.map((_,i)=>(
              <div key={i} onClick={()=>setTipIndex(i)} style={{width:i===tipIndex?20:6,height:6,borderRadius:99,
                background:i===tipIndex?C.orange:C.border,cursor:"pointer",transition:"all 0.3s"}}/>
            ))}
          </div>
          <OrangeBtn style={{width:"100%",marginTop:14}}>📚 Take a Financial Literacy Course</OrangeBtn>
        </Card>
      </div>
    </div>
  );

  // ─── MICRO-LENDER PAGE ──────────────────────────────────────────────────────
  const MicroLenderPage = () => (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Top row */}
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:16 }}>
        {/* Wallet */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:`linear-gradient(135deg,${C.card},${C.black})`, border:`1px solid ${C.border}`,
            borderRadius:18, padding:24, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%",
              background:"radial-gradient(circle,rgba(255,107,0,0.15) 0%,transparent 70%)" }}/>
            <p style={{color:C.muted,fontSize:12,marginBottom:4}}>Wallet Balance</p>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:800,color:C.white,marginBottom:12}}>BWP 25,000.00</p>
            <p style={{color:C.muted,fontSize:12,marginBottom:4}}>Available for Lending</p>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:700,color:C.orange,marginBottom:16}}>BWP 18,000.00</p>
            <OrangeBtn style={{width:"100%"}}>+ Fund Wallet</OrangeBtn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Card><p style={{color:C.muted,fontSize:11,marginBottom:6}}>Total Invested</p>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,color:C.white}}>BWP 17,500</p></Card>
            <Card style={{background:C.greenDim,borderColor:"rgba(34,197,94,0.2)"}}>
              <p style={{color:C.muted,fontSize:11,marginBottom:6}}>Earned</p>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:800,color:C.greenBright}}>BWP 1,250</p></Card>
          </div>
          {[{l:"Active Loans",v:"2",i:"📊"},{l:"Loan Applications",v:"3",i:"👥"},{l:"Avg. Return Rate",v:"12.5%",i:"⭐"}].map((s,i)=>(
            <Card key={i}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <p style={{color:C.muted,fontSize:12}}>{s.l}</p><span style={{fontSize:18}}>{s.i}</span>
              </div>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:800,color:C.white}}>{s.v}</p>
            </Card>
          ))}
        </div>

        {/* Loan Applications */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Loan Applications","Active Loans","Transactions"].map(t=>(
              <div key={t} style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${t==="Loan Applications"?C.orange:C.border}`,
                background:t==="Loan Applications"?C.orangeDim:"transparent",color:t==="Loan Applications"?C.orange:C.muted,
                fontSize:13,fontWeight:600,cursor:"pointer"}}>{t}</div>
            ))}
          </div>
          {loanApplications.map(loan=>{
            const st = loanState(loan.id);
            const riskColor = loan.risk==="Low"?C.greenBright:loan.risk==="Medium"?C.yellowBright:"#F87171";
            const riskDim = loan.risk==="Low"?C.greenDim:loan.risk==="Medium"?C.yellowDim:C.redDim;
            return (
              <Card key={loan.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <p style={{color:C.white,fontWeight:700,fontSize:15}}>{loan.group}</p>
                      <Badge variant={loan.risk==="Low"?"green":loan.risk==="Medium"?"yellow":"red"}>{loan.risk} Risk</Badge>
                    </div>
                    <p style={{color:C.muted,fontSize:12}}>{loan.purpose}</p>
                  </div>
                  <Badge variant={st==="approved"?"green":st==="declined"?"red":"yellow"}>
                    {st==="pending"?"Pending Approval":st==="approved"?"Approved":"Declined"}
                  </Badge>
                </div>

                {/* Stage Tracker */}
                <LoanStageTracker stage={st==="approved"?2:st==="declined"?1:1}/>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:14}}>
                  {[{l:"Loan ID",v:loan.id},{l:"Amount",v:`BWP ${loan.amount.toLocaleString()}`},
                    {l:"Duration",v:`${loan.duration} months`},{l:"Lender",v:loan.lender},
                    {l:"Member Vote",v:loan.votes},{l:"Requested",v:loan.requested}
                  ].map((f,i)=>(
                    <div key={i} style={{padding:"8px 10px",background:C.black,borderRadius:8,border:`1px solid ${C.border}`}}>
                      <p style={{color:C.muted,fontSize:10,marginBottom:2}}>{f.l}</p>
                      <p style={{color:C.white,fontWeight:600,fontSize:12}}>{f.v}</p>
                    </div>
                  ))}
                </div>

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 14px",borderRadius:10,background:riskDim,marginBottom:14}}>
                  <RiskMeter score={loan.score} risk={loan.risk}/>
                  <div style={{fontSize:12,color:C.muted,textAlign:"right"}}>
                    <p>🤖 AI KYC Verified</p>
                    <p>🔒 Group Guarantee Active</p>
                  </div>
                </div>

                {st==="pending" && (
                  <div style={{display:"flex",gap:10}}>
                    <GhostBtn onClick={()=>declineLoan(loan.id)} style={{flex:1}}>Decline</GhostBtn>
                    <OrangeBtn onClick={()=>approveLoan(loan.id)} style={{flex:2}}>✓ Approve Loan</OrangeBtn>
                  </div>
                )}
                {st!=="pending" && (
                  <div style={{textAlign:"center",padding:12,borderRadius:10,
                    background:st==="approved"?C.greenDim:C.redDim}}>
                    <span style={{color:st==="approved"?C.greenBright:"#F87171",fontWeight:700,fontSize:14}}>
                      {st==="approved"?"✓ Loan Approved — Disbursement Pending":"✕ Loan Declined"}
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── MOTSHELO PAGE ──────────────────────────────────────────────────────────
  const MotsheloPage = () => {
    const g = mMotshelo[motGroup];
    return (
      <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:20}}>
        {/* Group Selector */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {mMotshelo.map((grp,i)=>(
            <div key={i} onClick={()=>setMotGroup(i)} style={{padding:"9px 16px",borderRadius:12,cursor:"pointer",
              border:`1px solid ${motGroup===i?C.orange:C.border}`,background:motGroup===i?C.orangeDim:C.card,
              color:motGroup===i?C.orange:C.muted,fontSize:13,fontWeight:600,transition:"all 0.18s"}}>
              👥 {grp.name}
            </div>
          ))}
          <OrangeBtn small>+ Join Group</OrangeBtn>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
          {[
            {l:"Group Funds",v:`BWP ${g.fund.toLocaleString()}`,sub:`↑ ${g.growth} MoM`,sc:C.greenBright,i:"💰"},
            {l:"Active Loans",v:g.loans,sub:"0% change",sc:C.muted,i:"📋"},
            {l:"Next Payment",v:g.nextPayment,sub:"Upcoming",sc:C.yellowBright,i:"🗓️"},
            {l:"Members",v:g.members,sub:"↑ 2% this month",sc:C.greenBright,i:"👥"},
          ].map((s,i)=>(
            <Card key={i}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <p style={{color:C.muted,fontSize:12}}>{s.l}</p><span style={{fontSize:18}}>{s.i}</span></div>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:800,color:C.white,marginBottom:4}}>{s.v}</p>
              <p style={{fontSize:11,color:s.sc}}>{s.sub}</p></Card>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Overview","Constitution","Members","Motshelo Manager"].map(t=>(
            <div key={t} onClick={()=>setMotTab(t)} style={{padding:"8px 16px",borderRadius:10,cursor:"pointer",
              border:`1px solid ${motTab===t?C.orange:C.border}`,background:motTab===t?C.orangeDim:"transparent",
              color:motTab===t?C.orange:C.muted,fontSize:13,fontWeight:600}}>{t}</div>
          ))}
        </div>

        {motTab==="Overview" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Card>
              <SectionTitle sub={`Score: ${g.health}/100`}>Group Financial Health</SectionTitle>
              <ProgressBar value={g.health} color={g.health>80?C.greenBright:g.health>60?C.yellowBright:"#F87171"}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
                {[{l:"Total Contributed",v:`BWP ${g.contributed.toLocaleString()}`},
                  {l:"Interest Earned",v:`BWP ${g.interest.toLocaleString()}`},
                  {l:"60% Liquid",v:`BWP ${g.liquid.toLocaleString()}`},
                  {l:"40% Secure Hold",v:`BWP ${g.hold.toLocaleString()}`}].map((x,i)=>(
                  <div key={i} style={{padding:"10px 12px",background:C.black,borderRadius:10,border:`1px solid ${C.border}`}}>
                    <p style={{color:C.muted,fontSize:10,marginBottom:3}}>{x.l}</p>
                    <p style={{color:C.white,fontWeight:700,fontSize:13}}>{x.v}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle>Live Feed</SectionTitle>
              <LiveFeed/>
            </Card>
          </div>
        )}
        {motTab==="Constitution" && (
          <Card><SectionTitle>Group Constitution & Rules" sub="Governed by member consensus</SectionTitle>
            <MotsheloRules/></Card>
        )}
        {motTab==="Members" && (
          <Card>
            <SectionTitle>Members ({g.members})</SectionTitle>
            {Array.from({length:g.members},(_,i)=>({name:`Member ${i+1}`,status:i<3?"Committee":i<g.members-1?"Active":"New",
              contributed:`BWP ${(Math.random()*5000+2000).toFixed(0)}`})).map((m,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",
                borderBottom:i<g.members-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:C.orangeDim,
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:C.orange,fontSize:13,flexShrink:0}}>
                  {m.name[m.name.length-1]}
                </div>
                <div style={{flex:1}}><p style={{color:C.white,fontSize:13,fontWeight:600,margin:0}}>{m.name}</p>
                  <p style={{color:C.muted,fontSize:11,margin:0}}>Contributed: {m.contributed}</p></div>
                <Badge variant={m.status==="Committee"?"orange":m.status==="New"?"blue":"muted"}>{m.status}</Badge>
              </div>
            ))}
          </Card>
        )}
        {motTab==="Motshelo Manager" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Card><SectionTitle>Invite Member</SectionTitle>
              <input placeholder="Member phone or email" style={{width:"100%",background:C.black,border:`1px solid ${C.border}`,
                borderRadius:8,padding:"10px 14px",color:C.white,fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:10}}/>
              <OrangeBtn style={{width:"100%"}}>📨 Send Invite</OrangeBtn></Card>
            <Card><SectionTitle>Schedule Meeting</SectionTitle>
              <input type="date" style={{width:"100%",background:C.black,border:`1px solid ${C.border}`,
                borderRadius:8,padding:"10px 14px",color:C.white,fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:10}}/>
              <OrangeBtn style={{width:"100%"}}>📅 Schedule</OrangeBtn></Card>
            <Card style={{gridColumn:"1/-1"}}><SectionTitle>Loan Vote</SectionTitle>
              <p style={{color:C.muted,fontSize:13,marginBottom:12}}>Pending vote: <strong style={{color:C.white}}>Loan #L-103 — BWP 15,000 for Unity Farmers</strong></p>
              <div style={{display:"flex",gap:10}}>
                <OrangeBtn style={{flex:1}}>👍 Vote Yes</OrangeBtn>
                <GhostBtn style={{flex:1}}>👎 Vote No</GhostBtn>
              </div></Card>
          </div>
        )}
      </div>
    );
  };

  // ─── PERSONAL SAVINGS PAGE ──────────────────────────────────────────────────
  const PersonalSavingsPage = () => (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
        {[{l:"Total Savings",v:"BWP 36,100",sub:"72% of goal",c:C.orange},{l:"Monthly Contribution",v:"BWP 2,500",sub:"Auto-debit active"},
          {l:"Interest Earned",v:"BWP 1,840",sub:"↑ 8.3% this year",c:C.greenBright},{l:"Goal Target",v:"BWP 50,000",sub:"Projected: Dec 2024"}
        ].map((s,i)=>(
          <Card key={i}><p style={{color:C.muted,fontSize:12,marginBottom:8}}>{s.l}</p>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:800,color:s.c||C.white,marginBottom:4}}>{s.v}</p>
            <p style={{fontSize:11,color:C.muted}}>{s.sub}</p></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <SectionTitle>Savings Growth</SectionTitle>
          <div style={{display:"flex",alignItems:"flex-end",gap:10,height:140,paddingBottom:4}}>
            {savingsData.map((d,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",borderRadius:"6px 6px 0 0",background:`linear-gradient(180deg,${C.orangeHover},${C.orange})`,
                  height:`${(d.amount/maxSav)*120}px`,minHeight:4}}/>
                <span style={{color:C.muted,fontSize:10}}>{d.month}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle>Savings Goals</SectionTitle>
          {[{name:"Emergency Fund",cur:15000,tgt:20000,c:C.orange},
            {name:"Business Capital",cur:8500,tgt:25000,c:C.greenBright},
            {name:"School Fees",cur:12600,tgt:14000,c:C.yellowBright}].map((g,i)=>(
            <div key={i} style={{marginBottom:i<2?18:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <p style={{color:C.white,fontSize:13,fontWeight:600}}>{g.name}</p>
                <p style={{color:C.muted,fontSize:11}}>BWP {g.cur.toLocaleString()} / {g.tgt.toLocaleString()}</p>
              </div>
              <ProgressBar value={g.cur} max={g.tgt} color={g.c}/>
              <p style={{color:g.c,fontSize:10,textAlign:"right",marginTop:3}}>{Math.round((g.cur/g.tgt)*100)}%</p>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>Auto-Save Configuration</SectionTitle>
          <AutoSaveRule/>
        </Card>
        <Card>
          <SectionTitle>Savings Goal Setter</SectionTitle>
          <SavingsGoalSetter/>
        </Card>
      </div>
    </div>
  );

  // ─── TOOLS PAGE ─────────────────────────────────────────────────────────────
  const ToolsPage = () => (
    <div className="fade-in" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
      <Card>
        <SectionTitle>🧮 Loan Calculator" sub="Calculate repayments before you borrow</SectionTitle>
        <LoanCalculator/>
      </Card>
      <Card>
        <SectionTitle>🎯 Savings Goal Setter" sub="Plan your path to financial freedom</SectionTitle>
        <SavingsGoalSetter/>
      </Card>
      <Card>
        <SectionTitle>⚡ Auto-Save Rules" sub="Automate your savings discipline</SectionTitle>
        <AutoSaveRule/>
      </Card>
      <Card>
        <SectionTitle>📚 Financial Literacy Hub" sub="Build your financial knowledge</SectionTitle>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {finTips.map((tip,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:12,background:C.black,border:`1px solid ${C.border}`}}>
              <span style={{fontSize:22,flexShrink:0}}>{tip.icon}</span>
              <div><p style={{color:C.orange,fontSize:13,fontWeight:700,marginBottom:3}}>{tip.title}</p>
                <p style={{color:C.muted,fontSize:12,lineHeight:1.5,margin:0}}>{tip.tip}</p></div>
            </div>
          ))}
          <OrangeBtn style={{marginTop:4}}>📖 Enroll in Financial Literacy Course →</OrangeBtn>
        </div>
      </Card>
    </div>
  );

  // ─── SECURITY PAGE ──────────────────────────────────────────────────────────
  const SecurityPage = () => (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {[{icon:"🔐",label:"Encryption",val:"AES-256",status:"Active",v:"green"},
          {icon:"🛡️",label:"API Security",val:"OAuth 2.0 + JWT",status:"Active",v:"green"},
          {icon:"👁️",label:"AI Monitoring",val:"Real-time Anomaly",status:"Active",v:"green"},
          {icon:"🔑",label:"2FA Status",val:twoFA?"Enabled":"Disabled",status:twoFA?"Active":"Off",v:twoFA?"green":"red"}
        ].map((s,i)=>(
          <Card key={i}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:22}}>{s.icon}</span><Badge variant={s.v}>{s.status}</Badge></div>
            <p style={{color:C.muted,fontSize:11,marginBottom:4}}>{s.label}</p>
            <p style={{color:C.white,fontWeight:700,fontSize:14}}>{s.val}</p></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <SectionTitle>Two-Factor Authentication</SectionTitle>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><p style={{color:C.white,fontSize:14,fontWeight:600,margin:0}}>2FA via SMS / Authenticator</p>
              <p style={{color:C.muted,fontSize:12,margin:"4px 0 0"}}>Adds an extra layer of security to your account</p></div>
            <div onClick={()=>setTwoFA(!twoFA)} style={{width:48,height:26,borderRadius:99,
              background:twoFA?C.orange:C.border,cursor:"pointer",position:"relative",transition:"all 0.2s",flexShrink:0}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",
                top:3,left:twoFA?25:3,transition:"left 0.2s"}}/>
            </div>
          </div>
          <SectionTitle>KYC Verification" sub="Identity verified via Smile ID</SectionTitle>
          <KYCBadge level={kycLevel}/>
          <div style={{marginTop:12}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[{l:"Biometric Login",i:"👆"},{l:"Fingerprint",i:"🔏"},{l:"Face ID",i:"🤳"}].map((b,i)=>(
                <div key={i} style={{padding:"6px 12px",borderRadius:8,background:C.black,border:`1px solid ${C.border}`,
                  color:C.muted,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
                  <span>{b.i}</span>{b.l} <Badge variant="muted">Coming Soon</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <SectionTitle>Active Sessions</SectionTitle>
          {[{device:"Chrome — Windows 11",loc:"Gaborone, BW",time:"Current session",current:true},
            {device:"Mobile App — Android",loc:"Gaborone, BW",time:"2 hours ago",current:false},
            {device:"Firefox — MacOS",loc:"Francistown, BW",time:"Yesterday",current:false}].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"12px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
              <div><p style={{color:C.white,fontSize:13,fontWeight:600,margin:0}}>{s.device}</p>
                <p style={{color:C.muted,fontSize:11,margin:"2px 0 0"}}>{s.loc} • {s.time}</p></div>
              {s.current?<Badge variant="green">Current</Badge>:<GhostBtn small>Revoke</GhostBtn>}
            </div>
          ))}
          <div style={{marginTop:14}}>
            <SectionTitle>Authorized Apps</SectionTitle>
            {["In-App Support Center","Email Alerts","KYC Verification (Smile ID)"].map((a,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                <p style={{color:C.white,fontSize:13,margin:0}}>🔗 {a}</p>
                <GhostBtn small>Revoke</GhostBtn>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // ─── SYSTEM ANALYTICS PAGE ──────────────────────────────────────────────────
  const SystemAnalyticsPage = () => (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{padding:"12px 18px",borderRadius:12,background:C.orangeDim,border:`1px solid rgba(255,107,0,0.25)`,
        display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:18}}>🔐</span>
        <p style={{color:C.orange,fontSize:13,fontWeight:600,margin:0}}>Admin / Investor View — Confidential</p>
      </div>
      <SystemHealth/>
      <Card>
        <SectionTitle>Platform Partners & Integrations</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
          {partnerBadges.map(pb=>(
            <div key={pb.name} style={{display:"flex",gap:12,padding:"12px 14px",borderRadius:12,
              background:C.black,border:`1px solid ${C.border}`,alignItems:"center"}}>
              <span style={{fontSize:22,flexShrink:0}}>{pb.icon}</span>
              <div><p style={{color:C.white,fontSize:13,fontWeight:700,margin:0}}>{pb.name}</p>
                <p style={{color:C.muted,fontSize:11,margin:0}}>{pb.type}</p></div>
              <Badge variant="green" style={{marginLeft:"auto"}}>Live</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ─── HOW IT WORKS PAGE ──────────────────────────────────────────────────────
  const HowItWorksPage = () => (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <SectionTitle>Platform Architecture" sub="Layered security and scalability</SectionTitle>
          <HowItWorks/>
        </Card>
        <Card>
          <SectionTitle>Fund Flow Map" sub="Track every pula — transparently</SectionTitle>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {[{step:"Customer",sub:"You — verified member",icon:"👤"},
              {step:"Payment Channel",sub:"Visa / Orange Money",icon:"💳"},
              {step:"Nthoppa Wallet",sub:"Regulated custody account",icon:"🏦"},
              {step:"Motshelo Pool",sub:"60% liquid / 40% hold",icon:"🔒"},
              {step:"Loan Disbursed",sub:"To approved group member",icon:"📤"}].map((s,i,arr)=>(
              <div key={i}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:C.orangeDim,
                    border:`1px solid rgba(255,107,0,0.25)`,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:18,flexShrink:0}}>{s.icon}</div>
                  <div><p style={{color:C.white,fontSize:13,fontWeight:700,margin:0}}>{s.step}</p>
                    <p style={{color:C.muted,fontSize:11,margin:0}}>{s.sub}</p></div>
                </div>
                {i<arr.length-1&&<div style={{width:2,height:14,background:C.orange,margin:"4px 0 4px 19px"}}/>}
              </div>
            ))}
          </div>
          <OrangeBtn onClick={()=>setShowFundFlow(true)} style={{width:"100%"}}>🗺️ Open Interactive Map</OrangeBtn>
          <div style={{marginTop:12,padding:"10px 14px",borderRadius:10,background:"rgba(255,107,0,0.05)",border:`1px solid ${C.orangeDim}`}}>
            <p style={{color:C.muted,fontSize:11,margin:0}}>🔒 Funds held in regulated trust account. All movements auditable and reported to NBFIRA.</p>
          </div>
        </Card>
      </div>
      <Card>
        <SectionTitle>Motshelo Group Constitution Rules</SectionTitle>
        <MotsheloRules/>
      </Card>
    </div>
  );

  const pageMap = {
    "Overview":<OverviewPage/>, "Micro-Lender":<MicroLenderPage/>,
    "Motshelo Groups":<MotsheloPage/>, "Personal Savings":<PersonalSavingsPage/>,
    "Tools":<ToolsPage/>, "Security":<SecurityPage/>,
    "System Analytics":<SystemAnalyticsPage/>, "How It Works":<HowItWorksPage/>,
  };

  return (
    <div style={{ fontFamily:"'Sora', 'DM Mono', sans-serif", background:C.black, minHeight:"100vh", color:C.white }}>
      <style>{styles}</style>

      {/* Mobile Top Bar */}
      <div style={{ display:"none", position:"sticky", top:0, zIndex:200, background:C.dark,
        borderBottom:`1px solid ${C.border}`, padding:"12px 16px",
        justifyContent:"space-between", alignItems:"center",
        ...(typeof window!=="undefined"&&window.innerWidth<768?{display:"flex"}:{}) }}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,background:C.orange,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#fff"}}>N</div>
          <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:15,color:C.white}}>Nthoppa</span>
        </div>
        <button onClick={()=>setMobileNav(!mobileNav)} style={{background:"none",border:"none",color:C.white,fontSize:20,cursor:"pointer"}}>☰</button>
      </div>

      <div style={{ display:"flex" }}>
        {/* Sidebar */}
        <div style={{ display:"flex" }}>
          <Sidebar/>
        </div>

        {/* Main Content */}
        <div style={{ flex:1, minWidth:0, padding:"28px 28px", overflowY:"auto" }}>
          {/* Page Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
            marginBottom:24, flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, color:C.white, marginBottom:4 }}>
                {navIcons[page]} {page}
              </h1>
              <p style={{ color:C.muted, fontSize:13 }}>
                {{
                  "Overview":"Your complete Nthoppa financial picture",
                  "Micro-Lender":"Manage your loan portfolio and investment returns",
                  "Motshelo Groups":"Community savings — transparency, governance, growth",
                  "Personal Savings":"Track goals, automate savings, build wealth",
                  "Tools":"Empower your financial decisions with smart tools",
                  "Security":"Account security, KYC status, active sessions",
                  "System Analytics":"Platform performance — investor & regulator view",
                  "How It Works":"Architecture, fund flow & platform governance",
                }[page]}
              </p>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <OrangeBtn small onClick={()=>setShowLiteracyHub(true)}>📚 Literacy Hub</OrangeBtn>
              <OrangeBtn small onClick={()=>setShowFundFlow(true)}>🗺️ Fund Flow</OrangeBtn>
            </div>
          </div>

          {/* Page Content */}
          {pageMap[page]}

          {/* Security Footer */}
          <div style={{ marginTop:32, paddingTop:20, borderTop:`1px solid ${C.border}`,
            display:"flex", gap:20, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {[{i:"🔐",l:"AES-256 Encryption"},{i:"🛡️",l:"OAuth 2.0 + JWT"},{i:"👁️",l:"Real-time Anomaly Detection"},{i:"🏛️",l:"NBFIRA Regulated"}].map((b,i)=>(
                <div key={i} style={{display:"flex",gap:5,alignItems:"center"}}>
                  <span style={{fontSize:13}}>{b.i}</span>
                  <span style={{color:C.muted,fontSize:11}}>{b.l}</span>
                </div>
              ))}
            </div>
            <p style={{color:C.mutedMid,fontSize:11}}>© 2025 Nthoppa Financial Services (Pty) Ltd · Gaborone, Botswana</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFundFlow && <FundFlowMap onClose={()=>setShowFundFlow(false)}/>}
      {showLiteracyHub && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:999,
          display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
          onClick={()=>setShowLiteracyHub(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.dark,border:`1px solid ${C.border}`,
            borderRadius:20,padding:32,maxWidth:520,width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:800,color:C.white}}>📚 Financial Literacy Hub</h3>
              <button onClick={()=>setShowLiteracyHub(false)} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
              {finTips.map((tip,i)=>(
                <div key={i} style={{display:"flex",gap:14,padding:"14px 16px",borderRadius:12,background:C.black,border:`1px solid ${C.border}`}}>
                  <span style={{fontSize:26,flexShrink:0}}>{tip.icon}</span>
                  <div><p style={{color:C.orange,fontWeight:700,fontSize:14,marginBottom:4}}>{tip.title}</p>
                    <p style={{color:C.muted,fontSize:12,lineHeight:1.5,margin:0}}>{tip.tip}</p></div>
                </div>
              ))}
            </div>
            <OrangeBtn style={{width:"100%",padding:"13px"}}>📖 Start Learning — Enroll in Course</OrangeBtn>
          </div>
        </div>
      )}
    </div>
  );
}
