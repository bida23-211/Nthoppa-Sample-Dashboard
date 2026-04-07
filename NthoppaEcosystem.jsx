import { useState, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  black: "#0A0A0A", dark: "#111111", card: "#161616", card2: "#1A1A1A",
  border: "#232323", borderLight: "#2C2C2C",
  orange: "#FF6B00", orangeHover: "#FF8533", orangeDim: "rgba(255,107,0,0.10)",
  orangeMid: "rgba(255,107,0,0.18)", orangeBorder: "rgba(255,107,0,0.3)",
  white: "#FFFFFF", offWhite: "#F0F0F0", muted: "#777777", mutedMid: "#555555",
  green: "#16A34A", greenDim: "rgba(22,163,74,0.12)", greenBright: "#22C55E", greenBorder: "rgba(34,197,94,0.3)",
  red: "#DC2626", redDim: "rgba(220,38,38,0.12)", redBright: "#F87171", redBorder: "rgba(239,68,68,0.3)",
  yellow: "#CA8A04", yellowDim: "rgba(202,138,4,0.12)", yellowBright: "#EAB308", yellowBorder: "rgba(234,179,8,0.3)",
  blue: "#2563EB", blueDim: "rgba(37,99,235,0.12)", blueBright: "#60A5FA", blueBorder: "rgba(96,165,250,0.3)",
  purple: "#7C3AED", purpleDim: "rgba(124,58,237,0.12)", purpleBright: "#A78BFA", purpleBorder: "rgba(167,139,250,0.3)",
};

// ─── ROLE CONFIG ──────────────────────────────────────────────────────────────
const ROLES = {
  agent:    { label: "Agent",         accent: C.orange,  accentDim: C.orangeDim,  accentBorder: C.orangeBorder,  badge: "🏃", nav: ["Overview","Onboarding","Collections","Tasks","Performance"] },
  client:   { label: "Client",        accent: C.green,   accentDim: C.greenDim,   accentBorder: C.greenBorder,   badge: "👤", nav: ["Overview","My Groups","Loans","Savings","Education"] },
  hr:       { label: "HR Manager",    accent: C.blue,    accentDim: C.blueDim,    accentBorder: C.blueBorder,    badge: "🏢", nav: ["Overview","Groups","Agents","Compliance","Disputes"] },
  merchant: { label: "Merchant",      accent: C.purple,  accentDim: C.purpleDim,  accentBorder: C.purpleBorder,  badge: "🏪", nav: ["Overview","Terminal","Loans","Campaigns","Settlements"] },
  admin:    { label: "Admin/Investor", accent: "#CA8A04", accentDim: "rgba(202,138,4,0.12)", accentBorder: "rgba(234,179,8,0.3)", badge: "👑", nav: ["Overview","Micro-Lender","Motshelo Groups","Personal Savings","System Analytics"] },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = {
  loanApps: [
    { id:"L-101", group:"Tshwaragano Savings Group", purpose:"Inventory for retail", amount:12000, duration:6, risk:"Low", score:85, requested:"Aug 20, 2023", status:"pending", votes:"8/12" },
    { id:"L-102", group:"Kopano Women's Collective",  purpose:"Equipment for catering", amount:8000, duration:4, risk:"Medium", score:72, requested:"Aug 18, 2023", status:"approved", votes:"6/8" },
    { id:"L-103", group:"Unity Farmers Association", purpose:"Agricultural machinery", amount:15000, duration:8, risk:"High", score:48, requested:"Aug 15, 2023", status:"pending", votes:"9/15" },
  ],
  groups: [
    { id:"MG-01", name:"Tshwaragano Savings Group", members:12, fund:146235, nextPayment:"Sep 3, 2023",  loans:2, health:88, liquid:87741,  contributed:120000, interest:26235, growth:"+12%" },
    { id:"MG-02", name:"Kopano Women's Collective",  members:8,  fund:89420,  nextPayment:"Sep 10, 2023", loans:1, health:74, liquid:53652,  contributed:80000,  interest:9420,  growth:"+8%"  },
    { id:"MG-03", name:"Boiteko Progress Group",     members:15, fund:203000, nextPayment:"Aug 28, 2023",loans:3, health:92, liquid:121800, contributed:175000, interest:28000, growth:"+16%" },
  ],
  agents: [
    { id:"A-01", name:"Keabetswe Molefe", zone:"Gaborone Central", reg:24, collections:125000, commission:3200, kyc:"Verified" },
    { id:"A-02", name:"Teboho Sithole",   zone:"Francistown",       reg:18, collections:98000,  commission:2450, kyc:"Verified" },
  ],
  merchants: [
    { id:"M-01", name:"Kgabo General Store", sales:28500, customers:124, capital:50000, txns:[{id:"T-001",customer:"Onalenna M.",amount:450,method:"Wallet",status:"Completed"},{id:"T-002",customer:"Lesego K.",amount:120,method:"Mobile Money",status:"Completed"},{id:"T-003",customer:"Boitumelo R.",amount:890,method:"Wallet",status:"Pending"}] },
    { id:"M-02", name:"Unity Auto Parts",    sales:14200, customers:67,  capital:30000, txns:[] },
  ],
  clients: [
    { id:"C-01", name:"Josephine Morolong", wallet:8500, savings:36100, loans:[{id:"CL-01",amount:5000,balance:3200,due:"Sep 15",progress:36},{id:"CL-02",amount:3300,balance:5100,due:"Oct 1",progress:35}], goals:[{name:"Emergency Fund",saved:15000,target:20000},{name:"Business Capital",saved:8500,target:25000},{name:"School Fees",saved:12600,target:14000}] },
  ],
  savingsChart: [{m:"Mar",v:4200},{m:"Apr",v:5100},{m:"May",v:4800},{m:"Jun",v:6300},{m:"Jul",v:7200},{m:"Aug",v:8500}],
  activity: [
    { icon:"💰", text:"Tshwaragano Group contributed P5,000", time:"2m ago" },
    { icon:"✅", text:"Loan #L-102 approved by members", time:"8m ago" },
    { icon:"📤", text:"BWP 8,000 disbursed to Kopano Women's", time:"15m ago" },
    { icon:"🔔", text:"Unity Farmers payment due in 3 days", time:"1h ago" },
    { icon:"📊", text:"AI risk assessment completed for L-103", time:"3h ago" },
  ],
  disputes: [
    { id:"D-001", type:"Loan Dispute", parties:"Josephine M. vs Group", status:"Open" },
    { id:"D-002", type:"Withdrawal",   parties:"Teboho K. vs Treasurer",  status:"Mediation" },
    { id:"D-003", type:"Contribution", parties:"Boitumelo R. vs Admin",   status:"Resolved" },
  ],
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt = n => `BWP ${n.toLocaleString()}`;
const pct = (v, m) => Math.min(Math.round((v / m) * 100), 100);

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Badge = ({ children, variant = "orange" }) => {
  const map = {
    orange:  [C.orangeDim,  C.orange,      C.orangeBorder],
    green:   [C.greenDim,   C.greenBright, C.greenBorder],
    red:     [C.redDim,     C.redBright,   C.redBorder],
    yellow:  [C.yellowDim,  C.yellowBright,C.yellowBorder],
    blue:    [C.blueDim,    C.blueBright,  C.blueBorder],
    purple:  [C.purpleDim,  C.purpleBright,C.purpleBorder],
    muted:   ["rgba(255,255,255,0.05)", C.muted, C.border],
  };
  const [bg, color, border] = map[variant] || map.orange;
  return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, letterSpacing:"0.04em", background:bg, color, border:`1px solid ${border}` }}>{children}</span>;
};

const Card = ({ children, style = {}, onClick, accent }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1px solid ${accent ? accent : C.border}`, borderRadius:16, padding:22, transition:"border-color 0.2s", cursor:onClick?"pointer":"default", ...style }}
    onMouseEnter={e => { if(onClick) e.currentTarget.style.borderColor = C.orangeBorder; }}
    onMouseLeave={e => { if(onClick) e.currentTarget.style.borderColor = accent || C.border; }}>
    {children}
  </div>
);

const Bar = ({ value, max = 100, color = C.orange, h = 6 }) => (
  <div style={{ background:C.border, borderRadius:99, overflow:"hidden", height:h }}>
    <div style={{ width:`${pct(value,max)}%`, height:"100%", background:color, borderRadius:99, transition:"width 0.8s ease" }} />
  </div>
);

const StatCard = ({ label, value, sub, color = C.orange, icon }) => (
  <Card style={{ padding:"18px 20px" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <p style={{ color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>{label}</p>
        <p style={{ color, fontSize:22, fontWeight:800, marginBottom:sub?4:0 }}>{value}</p>
        {sub && <p style={{ color:C.muted, fontSize:12 }}>{sub}</p>}
      </div>
      {icon && <span style={{ fontSize:22 }}>{icon}</span>}
    </div>
  </Card>
);

const Input = ({ label, placeholder, type = "text", value, onChange, style = {} }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:"block", color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>{label}</label>}
    <input type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{ width:"100%", background:"#1C1C1C", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.white, fontSize:13, fontFamily:"'Sora',sans-serif", outline:"none", ...style }} />
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:"block", color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>{label}</label>}
    <select value={value} onChange={onChange} style={{ width:"100%", background:"#1C1C1C", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.white, fontSize:13, fontFamily:"'Sora',sans-serif", outline:"none" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const OBtn = ({ children, onClick, style = {}, sm }) => (
  <button onClick={onClick} style={{ background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:sm?"7px 14px":"10px 22px", fontSize:sm?12:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"background 0.18s", ...style }}
    onMouseEnter={e => e.currentTarget.style.background = C.orangeHover}
    onMouseLeave={e => e.currentTarget.style.background = C.orange}>
    {children}
  </button>
);

const GBtn = ({ children, onClick, sm }) => (
  <button onClick={onClick} style={{ background:"transparent", color:C.muted, border:`1px solid ${C.borderLight}`, borderRadius:10, padding:sm?"7px 14px":"10px 22px", fontSize:sm?12:13, fontWeight:600, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
    {children}
  </button>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom:20 }}>
    <h2 style={{ fontSize:17, fontWeight:700, color:C.white, marginBottom:sub?4:0 }}>{children}</h2>
    {sub && <p style={{ color:C.muted, fontSize:12 }}>{sub}</p>}
  </div>
);

const MiniChart = ({ data, color = C.orange }) => {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:48 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ width:"100%", background:color, borderRadius:"3px 3px 0 0", height:`${pct(d.v, max)}%`, minHeight:4, opacity: i === data.length-1 ? 1 : 0.45 }} />
          <span style={{ color:C.muted, fontSize:9, fontWeight:600 }}>{d.m}</span>
        </div>
      ))}
    </div>
  );
};

const Table = ({ cols, rows }) => (
  <div style={{ overflowX:"auto" }}>
    <table style={{ width:"100%", borderCollapse:"collapse" }}>
      <thead>
        <tr>{cols.map(c => <th key={c} style={{ textAlign:"left", padding:"8px 12px", color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
            {r.map((cell, j) => <td key={j} style={{ padding:"10px 12px", fontSize:13, color:C.white, verticalAlign:"middle" }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── PORTALS ──────────────────────────────────────────────────────────────────

// AGENT PORTAL
function AgentPortal({ page }) {
  const [onboardStep, setOnboardStep] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [collectAmount, setCollectAmount] = useState("");
  const [loanStatuses, setLoanStatuses] = useState({});

  if (page === "Overview") return (
    <div>
      <SectionTitle sub="Monday, 21 Aug 2023 · Agent Zone: Gaborone Central">Agent Overview</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Today's Collections" value="BWP 12,500" color={C.orange} icon="💰" />
        <StatCard label="New Registrations (Week)" value="24" color={C.greenBright} icon="👥" />
        <StatCard label="Pending Verifications" value="8" color={C.yellowBright} icon="📋" />
        <StatCard label="Commission Earned (MTD)" value="BWP 3,200" color={C.blueBright} icon="🏆" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <Card>
          <SectionTitle sub="Assigned to you">Pending Tasks</SectionTitle>
          {[
            { task:"Verify docs for Josephine M.", priority:"High", due:"Today" },
            { task:"Follow up: Tshwaragano Group repayment", priority:"Medium", due:"Aug 23" },
            { task:"Collect weekly contribution – 5 clients", priority:"Low", due:"Aug 25" },
          ].map((t, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i < 2 ? `1px solid ${C.border}` : "none" }}>
              <div>
                <p style={{ fontSize:13, color:C.white, marginBottom:3 }}>{t.task}</p>
                <p style={{ fontSize:11, color:C.muted }}>Due: {t.due}</p>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <Badge variant={t.priority==="High"?"red":t.priority==="Medium"?"yellow":"muted"}>{t.priority}</Badge>
                <OBtn sm onClick={() => {}}>Done</OBtn>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle sub="August 2023">Collections vs Target</SectionTitle>
          <MiniChart data={[{m:"Mar",v:85000},{m:"Apr",v:98000},{m:"May",v:92000},{m:"Jun",v:110000},{m:"Jul",v:118000},{m:"Aug",v:125000}]} />
          <div style={{ marginTop:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:C.muted, fontSize:12 }}>Collections vs Target (BWP 150K)</span>
              <span style={{ color:C.orange, fontSize:12, fontWeight:700 }}>83%</span>
            </div>
            <Bar value={125000} max={150000} />
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle sub="Simulated leaderboard · Gaborone Region">Top Agents This Month</SectionTitle>
        <Table
          cols={["Rank","Agent","Collections","Registrations","Commission"]}
          rows={[
            ["🥇","Keabetswe Molefe","BWP 125,000","24",<Badge>BWP 3,200</Badge>],
            ["🥈","Teboho Sithole","BWP 98,000","18",<Badge variant="muted">BWP 2,450</Badge>],
            ["🥉","Mpho Dithebe","BWP 87,500","15",<Badge variant="muted">BWP 2,100</Badge>],
            ["4","Lesego Tau","BWP 74,200","12",<Badge variant="muted">BWP 1,820</Badge>],
          ]}
        />
      </Card>
    </div>
  );

  if (page === "Onboarding") return (
    <div>
      <SectionTitle sub="Register a new client in 5 steps">Client Onboarding</SectionTitle>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {["Client Info","Biometrics","Documents","Group Assignment","Create Wallet"].map((s, i) => (
          <div key={i} onClick={() => setOnboardStep(i)} style={{ flex:1, textAlign:"center", cursor:"pointer" }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background: i <= onboardStep ? C.orange : C.border, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, margin:"0 auto 6px" }}>{i + 1}</div>
            <p style={{ fontSize:10, color: i <= onboardStep ? C.orange : C.muted, fontWeight:600 }}>{s}</p>
          </div>
        ))}
      </div>
      <Card>
        {onboardStep === 0 && (
          <div>
            <SectionTitle>Step 1: Client Info</SectionTitle>
            <Input label="Full Name" placeholder="e.g. Josephine Morolong" value={clientName} onChange={e => setClientName(e.target.value)} />
            <Input label="Phone Number" placeholder="+267 7X XXX XXX" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
            <Input label="ID Number" placeholder="National ID or Passport" />
            <OBtn onClick={() => setOnboardStep(1)}>Continue →</OBtn>
          </div>
        )}
        {onboardStep === 1 && (
          <div>
            <SectionTitle>Step 2: Biometrics</SectionTitle>
            <div style={{ background:C.card2, border:`2px dashed ${C.border}`, borderRadius:12, padding:40, textAlign:"center", marginBottom:20 }}>
              <p style={{ fontSize:40 }}>📷</p>
              <p style={{ color:C.muted, fontSize:13, marginTop:8 }}>Capture client photo / fingerprint</p>
              <OBtn onClick={() => {}} style={{ marginTop:16 }}>Capture Photo</OBtn>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <GBtn onClick={() => setOnboardStep(0)}>← Back</GBtn>
              <OBtn onClick={() => setOnboardStep(2)}>Continue →</OBtn>
            </div>
          </div>
        )}
        {onboardStep === 2 && (
          <div>
            <SectionTitle>Step 3: KYC Documents</SectionTitle>
            {["National ID / Passport","Proof of Address","Selfie with ID"].map((doc, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.white, fontSize:13 }}>{doc}</span>
                <OBtn sm onClick={() => {}}>Upload</OBtn>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <GBtn onClick={() => setOnboardStep(1)}>← Back</GBtn>
              <OBtn onClick={() => setOnboardStep(3)}>Continue →</OBtn>
            </div>
          </div>
        )}
        {onboardStep === 3 && (
          <div>
            <SectionTitle>Step 4: Group Assignment</SectionTitle>
            <Select label="Assign to Motshelo Group" options={["— Select Group —",...MOCK.groups.map(g => g.name)]} value="— Select Group —" onChange={() => {}} />
            <p style={{ color:C.muted, fontSize:12, marginBottom:16 }}>If no group exists, client can join later from their portal.</p>
            <div style={{ display:"flex", gap:10 }}>
              <GBtn onClick={() => setOnboardStep(2)}>← Back</GBtn>
              <OBtn onClick={() => setOnboardStep(4)}>Continue →</OBtn>
            </div>
          </div>
        )}
        {onboardStep === 4 && (
          <div>
            <SectionTitle>Step 5: Create Wallet</SectionTitle>
            <div style={{ background:C.orangeDim, border:`1px solid ${C.orangeBorder}`, borderRadius:12, padding:20, marginBottom:20 }}>
              <p style={{ color:C.orange, fontWeight:700, marginBottom:8 }}>✅ Wallet Ready</p>
              <p style={{ color:C.white, fontSize:13 }}>Account No: <strong>NTH-2023-08-9821</strong></p>
              <p style={{ color:C.muted, fontSize:12, marginTop:4 }}>This registration earns you <strong style={{ color:C.orange }}>BWP 50 commission</strong>.</p>
            </div>
            <OBtn onClick={() => setOnboardStep(0)}>✓ Complete & Register Another</OBtn>
          </div>
        )}
      </Card>
    </div>
  );

  if (page === "Collections") return (
    <div>
      <SectionTitle sub="Record cash and mobile money collections">Cash Collection Module</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <SectionTitle>New Collection</SectionTitle>
          <Select label="Select Client" options={["Search client...","Josephine Morolong","Tshwaragano Member","Kopano Member"]} value="Search client..." onChange={() => {}} />
          <Input label="Amount Collected (BWP)" placeholder="0.00" type="number" value={collectAmount} onChange={e => setCollectAmount(e.target.value)} />
          <Select label="Payment Method" options={["Cash","Mobile Money","Bank Transfer"]} value="Cash" onChange={() => {}} />
          <OBtn onClick={() => {}}>Generate Receipt</OBtn>
        </Card>
        <Card>
          <SectionTitle>Float Management</SectionTitle>
          <div style={{ background:C.orangeDim, border:`1px solid ${C.orangeBorder}`, borderRadius:12, padding:16, marginBottom:16 }}>
            <p style={{ color:C.muted, fontSize:11 }}>YOUR CURRENT FLOAT</p>
            <p style={{ color:C.orange, fontSize:28, fontWeight:800 }}>BWP 15,000</p>
          </div>
          <Bar value={15000} max={25000} />
          <p style={{ color:C.muted, fontSize:12, marginTop:8, marginBottom:16 }}>60% of daily limit used</p>
          <OBtn onClick={() => {}}>Request Top-Up</OBtn>
        </Card>
      </div>
    </div>
  );

  if (page === "Performance") return (
    <div>
      <SectionTitle sub="Your performance metrics for August 2023">Agent Performance</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Monthly Registrations" value="24" sub="+6 vs last month" color={C.orange} />
        <StatCard label="Total Collections" value="BWP 125K" sub="vs BWP 150K target" color={C.greenBright} />
        <StatCard label="Client Satisfaction" value="94%" sub="Based on 18 ratings" color={C.blueBright} />
      </div>
      <Card>
        <SectionTitle sub="August 2023">Monthly Registrations</SectionTitle>
        <MiniChart data={[{m:"Mar",v:12},{m:"Apr",v:15},{m:"May",v:14},{m:"Jun",v:18},{m:"Jul",v:20},{m:"Aug",v:24}]} />
      </Card>
    </div>
  );

  return (
    <div>
      <SectionTitle>Tasks</SectionTitle>
      <Card>
        {[
          { task:"Verify documents for Josephine M.", priority:"High" },
          { task:"Collect weekly contribution – 5 clients", priority:"Medium" },
          { task:"Submit loan application for Tshwaragano Group", priority:"Low" },
        ].map((t, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i < 2 ? `1px solid ${C.border}` : "none" }}>
            <div>
              <p style={{ fontSize:13, color:C.white }}>{t.task}</p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Badge variant={t.priority==="High"?"red":t.priority==="Medium"?"yellow":"muted"}>{t.priority}</Badge>
              <OBtn sm>Mark Done</OBtn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// CLIENT PORTAL
function ClientPortal({ page }) {
  const client = MOCK.clients[0];
  const [autoSave, setAutoSave] = useState(true);
  const [roundUp, setRoundUp] = useState(false);

  const Toggle = ({ on, onChange, label }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ color:C.white, fontSize:13 }}>{label}</span>
      <div onClick={() => onChange(!on)} style={{ width:40, height:22, borderRadius:11, background: on ? C.green : C.border, position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
        <div style={{ position:"absolute", top:3, left: on ? 20 : 3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
      </div>
    </div>
  );

  if (page === "Overview") return (
    <div>
      <SectionTitle sub={`Welcome back, ${client.name}`}>My Dashboard</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Wallet Balance" value={fmt(client.wallet)} color={C.greenBright} icon="💳" />
        <StatCard label="Active Savings" value={fmt(client.savings)} color={C.orange} icon="🏦" />
        <StatCard label="Active Loans" value="2 loans" sub="BWP 8,300 outstanding" color={C.redBright} icon="📋" />
        <StatCard label="Motshelo Groups" value="1 active" color={C.blueBright} icon="👥" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16 }}>
        <Card>
          <SectionTitle>Savings Goals</SectionTitle>
          {client.goals.map((g, i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ color:C.white, fontSize:13 }}>{g.name}</span>
                <span style={{ color:C.greenBright, fontSize:12, fontWeight:700 }}>{pct(g.saved, g.target)}%</span>
              </div>
              <Bar value={g.saved} max={g.target} color={C.green} />
              <p style={{ color:C.muted, fontSize:11, marginTop:4 }}>{fmt(g.saved)} / {fmt(g.target)}</p>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>Quick Actions</SectionTitle>
          {[["💰 Deposit Funds","green"],["📤 Withdraw","muted"],["📋 Apply for Loan","orange"],["👥 Join Group","blue"]].map(([label, v], i) => (
            <button key={i} style={{ display:"block", width:"100%", textAlign:"left", background:C.card2, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.white, fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:8 }}>
              {label}
            </button>
          ))}
        </Card>
      </div>
    </div>
  );

  if (page === "My Groups") return (
    <div>
      <SectionTitle sub="Your Motshelo group memberships">My Groups</SectionTitle>
      {[MOCK.groups[0]].map(g => (
        <Card key={g.id} style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <h3 style={{ fontSize:15, fontWeight:700, color:C.white, marginBottom:4 }}>{g.name}</h3>
              <p style={{ color:C.muted, fontSize:12 }}>{g.members} members · Next meeting: {g.nextPayment}</p>
            </div>
            <Badge variant="green">Active</Badge>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
            <div><p style={{ color:C.muted, fontSize:11 }}>Group Fund</p><p style={{ color:C.white, fontWeight:700 }}>{fmt(g.fund)}</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Your Contribution</p><p style={{ color:C.orange, fontWeight:700 }}>BWP 9,800</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Voting Power</p><p style={{ color:C.white, fontWeight:700 }}>1 vote</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Growth</p><p style={{ color:C.greenBright, fontWeight:700 }}>{g.growth}</p></div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <OBtn sm>View Ledger</OBtn>
            <GBtn sm>Vote on Loans</GBtn>
            <GBtn sm>Request Loan</GBtn>
          </div>
        </Card>
      ))}
    </div>
  );

  if (page === "Loans") return (
    <div>
      <SectionTitle sub="Your active and historical loans">Loan Management</SectionTitle>
      <SectionTitle sub="Active">Active Loans</SectionTitle>
      {client.loans.map((loan, i) => (
        <Card key={i} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <p style={{ color:C.white, fontWeight:700, fontSize:14 }}>Loan #{loan.id}</p>
              <p style={{ color:C.muted, fontSize:12 }}>Principal: {fmt(loan.amount)} · Due: {loan.due}</p>
            </div>
            <Badge variant="orange">Active</Badge>
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ color:C.muted, fontSize:12 }}>Repayment Progress</span>
              <span style={{ color:C.orange, fontSize:12 }}>{loan.progress}%</span>
            </div>
            <Bar value={loan.progress} max={100} />
          </div>
          <p style={{ color:C.muted, fontSize:12, marginBottom:12 }}>Remaining: {fmt(loan.balance)}</p>
          <OBtn sm>Make Repayment</OBtn>
        </Card>
      ))}
      <Card style={{ marginTop:20 }}>
        <SectionTitle>Apply for New Loan</SectionTitle>
        <Select label="Loan Purpose" options={["Business","Education","Emergency","Medical","Other"]} value="Business" onChange={() => {}} />
        <Input label="Amount (BWP)" placeholder="e.g. 5000" type="number" />
        <Select label="Duration" options={["3 months","6 months","12 months"]} value="6 months" onChange={() => {}} />
        <Select label="Source" options={["Motshelo Group","Micro-Lender"]} value="Motshelo Group" onChange={() => {}} />
        <OBtn>Submit Application</OBtn>
      </Card>
    </div>
  );

  if (page === "Savings") return (
    <div>
      <SectionTitle sub="Your savings goals and auto-save rules">Savings & Goals</SectionTitle>
      <Card style={{ marginBottom:16 }}>
        <SectionTitle>Auto-Save Rules</SectionTitle>
        <Toggle on={autoSave} onChange={setAutoSave} label="Save 10% of every deposit automatically" />
        <Toggle on={roundUp} onChange={setRoundUp} label="Round-up transactions to nearest BWP 5" />
      </Card>
      <Card>
        <SectionTitle>Goal Progress</SectionTitle>
        {client.goals.map((g, i) => (
          <div key={i} style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:C.white, fontSize:14, fontWeight:600 }}>{g.name}</span>
              <span style={{ color:C.greenBright, fontWeight:700 }}>{pct(g.saved, g.target)}%</span>
            </div>
            <Bar value={g.saved} max={g.target} color={C.green} h={8} />
            <p style={{ color:C.muted, fontSize:12, marginTop:6 }}>{fmt(g.saved)} saved of {fmt(g.target)} goal</p>
          </div>
        ))}
      </Card>
    </div>
  );

  if (page === "Education") return (
    <div>
      <SectionTitle sub="Build your financial literacy">Financial Education</SectionTitle>
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <p style={{ color:C.white, fontWeight:700, fontSize:14 }}>Financial Literacy Score</p>
            <p style={{ color:C.muted, fontSize:12 }}>65% · Bronze Level</p>
          </div>
          <span style={{ fontSize:28 }}>🥉</span>
        </div>
        <Bar value={65} max={100} color={C.yellow} h={8} />
      </Card>
      {[
        { title:"Budgeting 101", status:"Available", icon:"📊", desc:"Learn to track income and expenses" },
        { title:"Understanding Compound Interest", status:"In Progress", icon:"📈", desc:"50% complete · 2 modules left" },
        { title:"Loan Repayment Strategies", status:"Locked", icon:"🔒", desc:"Complete previous module to unlock" },
        { title:"Investment Basics", status:"Locked", icon:"🔒", desc:"Advanced module" },
      ].map((m, i) => (
        <Card key={i} style={{ marginBottom:10, opacity: m.status==="Locked" ? 0.5 : 1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:24 }}>{m.icon}</span>
              <div>
                <p style={{ color:C.white, fontWeight:600, fontSize:13 }}>{m.title}</p>
                <p style={{ color:C.muted, fontSize:11 }}>{m.desc}</p>
              </div>
            </div>
            <Badge variant={m.status==="In Progress"?"orange":m.status==="Available"?"green":"muted"}>{m.status}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );

  return <div><SectionTitle>{page}</SectionTitle><Card><p style={{ color:C.muted }}>Content coming soon.</p></Card></div>;
}

// HR PORTAL
function HRPortal({ page }) {
  const [selectedGroup, setSelectedGroup] = useState(null);

  if (page === "Overview") return (
    <div>
      <SectionTitle sub="Human Resources · Group Operations Center">HR Overview</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Active Groups" value="12" color={C.blueBright} icon="👥" />
        <StatCard label="Total Members" value="347" color={C.orange} icon="👤" />
        <StatCard label="Pending Disputes" value="3" color={C.redBright} icon="⚖️" />
        <StatCard label="Groups Needing Review" value="2" color={C.yellowBright} icon="⚠️" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        <Card>
          <SectionTitle>System Alerts</SectionTitle>
          {[
            { msg:"Tshwaragano Group: 3 missed payments this cycle", sev:"red" },
            { msg:"Agent Teboho S. has 5 pending verifications overdue", sev:"yellow" },
            { msg:"AML flag: Large deposit BWP 45,000 requires review", sev:"red" },
            { msg:"Kopano Group constitution expires in 14 days", sev:"yellow" },
          ].map((a, i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 0", borderBottom:i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize:16 }}>{a.sev==="red"?"🔴":"🟡"}</span>
              <p style={{ color:C.white, fontSize:13 }}>{a.msg}</p>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>Live Activity</SectionTitle>
          {MOCK.activity.map((a, i) => (
            <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:10 }}>
              <span style={{ fontSize:14 }}>{a.icon}</span>
              <div>
                <p style={{ color:C.white, fontSize:12 }}>{a.text}</p>
                <p style={{ color:C.muted, fontSize:10 }}>{a.time}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  if (page === "Groups") return (
    <div>
      <SectionTitle sub="Manage and monitor all Motshelo groups">Group Management</SectionTitle>
      <Card>
        <Table
          cols={["Group Name","Members","Fund Balance","Loans","Health","Status","Actions"]}
          rows={MOCK.groups.map(g => [
            <span style={{ color:C.white, fontWeight:600 }}>{g.name}</span>,
            g.members,
            fmt(g.fund),
            g.loans,
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color: g.health > 85 ? C.greenBright : g.health > 70 ? C.yellowBright : C.redBright, fontWeight:700 }}>{g.health}%</span>
              <div style={{ width:60 }}><Bar value={g.health} max={100} color={g.health > 85 ? C.green : g.health > 70 ? C.yellow : C.red} /></div>
            </div>,
            <Badge variant={g.health > 85 ? "green" : g.health > 70 ? "yellow" : "red"}>
              {g.health > 85 ? "Healthy" : g.health > 70 ? "Monitor" : "At Risk"}
            </Badge>,
            <div style={{ display:"flex", gap:6 }}><OBtn sm onClick={() => setSelectedGroup(g)}>Details</OBtn><GBtn sm>Audit</GBtn></div>
          ])}
        />
      </Card>
      {selectedGroup && (
        <Card style={{ marginTop:16, border:`1px solid ${C.blueBorder}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <SectionTitle sub={`${selectedGroup.members} members · Health: ${selectedGroup.health}%`}>{selectedGroup.name}</SectionTitle>
            <GBtn sm onClick={() => setSelectedGroup(null)}>✕ Close</GBtn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            <div><p style={{ color:C.muted, fontSize:11 }}>Fund Balance</p><p style={{ color:C.white, fontWeight:700 }}>{fmt(selectedGroup.fund)}</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Liquid</p><p style={{ color:C.greenBright, fontWeight:700 }}>{fmt(selectedGroup.liquid)}</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Contributed</p><p style={{ color:C.white, fontWeight:700 }}>{fmt(selectedGroup.contributed)}</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Interest Earned</p><p style={{ color:C.orange, fontWeight:700 }}>{fmt(selectedGroup.interest)}</p></div>
          </div>
        </Card>
      )}
    </div>
  );

  if (page === "Agents") return (
    <div>
      <SectionTitle sub="Monitor and manage field agents">Agent Management</SectionTitle>
      <Card>
        <Table
          cols={["Agent","Zone","Registrations","Collections","Commission","KYC","Actions"]}
          rows={MOCK.agents.map(a => [
            <span style={{ color:C.white, fontWeight:600 }}>{a.name}</span>,
            a.zone,
            a.reg,
            fmt(a.collections),
            <span style={{ color:C.orange, fontWeight:700 }}>BWP {a.commission.toLocaleString()}</span>,
            <Badge variant="green">{a.kyc}</Badge>,
            <div style={{ display:"flex", gap:6 }}><OBtn sm>View</OBtn><GBtn sm>Adjust</GBtn></div>
          ])}
        />
      </Card>
    </div>
  );

  if (page === "Compliance") return (
    <div>
      <SectionTitle sub="Regulatory and AML compliance management">Compliance & Reporting</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {[
          { title:"KYC Completion Report", icon:"🪪", desc:"All user verification statuses" },
          { title:"AML Suspicious Activity Report", icon:"🚨", desc:"Flagged transactions for review" },
          { title:"Group Fund Audit Trail", icon:"📋", desc:"Full ledger for all groups" },
          { title:"Regulatory Filing Export", icon:"📤", desc:"CSV / XML for regulatory submission" },
        ].map((r, i) => (
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:24 }}>{r.icon}</span>
                <div>
                  <p style={{ color:C.white, fontWeight:600, fontSize:13 }}>{r.title}</p>
                  <p style={{ color:C.muted, fontSize:11 }}>{r.desc}</p>
                </div>
              </div>
              <OBtn sm>Download</OBtn>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionTitle>Real-Time Compliance Feed</SectionTitle>
        {[
          { date:"Jan 15, 2025", event:"New KYC verification for user #4452", type:"green" },
          { date:"Jan 14, 2025", event:"Large deposit BWP 45,000 flagged for AML review", type:"red" },
          { date:"Jan 14, 2025", event:"Group constitution updated: Kopano Women's Collective", type:"blue" },
          { date:"Jan 13, 2025", event:"Automated risk score recalculation completed", type:"muted" },
        ].map((f, i) => (
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"10px 0", borderBottom:i < 3 ? `1px solid ${C.border}` : "none" }}>
            <Badge variant={f.type}>{f.type==="red"?"AML":"KYC"}</Badge>
            <div>
              <p style={{ color:C.white, fontSize:13 }}>{f.event}</p>
              <p style={{ color:C.muted, fontSize:11 }}>{f.date}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );

  if (page === "Disputes") return (
    <div>
      <SectionTitle sub="Track and resolve member disputes">Dispute Resolution Center</SectionTitle>
      <Card>
        <Table
          cols={["Case #","Type","Parties","Status","Actions"]}
          rows={MOCK.disputes.map(d => [
            <span style={{ color:C.white, fontWeight:600 }}>{d.id}</span>,
            d.type,
            d.parties,
            <Badge variant={d.status==="Resolved"?"green":d.status==="Mediation"?"yellow":"red"}>{d.status}</Badge>,
            <div style={{ display:"flex", gap:6 }}>
              <OBtn sm>Review</OBtn>
              <GBtn sm>Mediate</GBtn>
            </div>
          ])}
        />
      </Card>
    </div>
  );

  return <div><SectionTitle>{page}</SectionTitle><Card><p style={{ color:C.muted }}>Content coming soon.</p></Card></div>;
}

// MERCHANT PORTAL
function MerchantPortal({ page }) {
  const merchant = MOCK.merchants[0];

  if (page === "Overview") return (
    <div>
      <SectionTitle sub={merchant.name}>Merchant Dashboard</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Today's Sales" value="BWP 4,200" color={C.purpleBright} icon="💳" />
        <StatCard label="This Month" value={fmt(merchant.sales)} color={C.orange} icon="📈" />
        <StatCard label="Customers Served" value={merchant.customers} color={C.greenBright} icon="👥" />
        <StatCard label="Working Capital" value={fmt(merchant.capital)} color={C.blueBright} icon="🏦" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16 }}>
        <Card>
          <SectionTitle>Recent Transactions</SectionTitle>
          <Table
            cols={["ID","Customer","Amount","Method","Status"]}
            rows={merchant.txns.map(t => [
              t.id,
              t.customer,
              `BWP ${t.amount}`,
              t.method,
              <Badge variant={t.status==="Completed"?"green":t.status==="Pending"?"yellow":"red"}>{t.status}</Badge>
            ])}
          />
        </Card>
        <Card>
          <SectionTitle>Quick Actions</SectionTitle>
          {[["💰 Request Capital Loan","purple"],["🎯 Create Campaign","orange"],["📊 Settlement Report","muted"],["🔗 Share QR Code","blue"]].map(([l], i) => (
            <button key={i} style={{ display:"block", width:"100%", textAlign:"left", background:C.card2, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.white, fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:8 }}>{l}</button>
          ))}
        </Card>
      </div>
    </div>
  );

  if (page === "Terminal") return (
    <div>
      <SectionTitle sub="Accept payments from Nthoppa users">Virtual POS Terminal</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <SectionTitle>New Payment</SectionTitle>
          <Input label="Customer Phone Number" placeholder="+267 7X XXX XXX" />
          <Input label="Amount (BWP)" placeholder="0.00" type="number" />
          <Select label="Payment Method" options={["Nthoppa Wallet","Mobile Money","Cash"]} value="Nthoppa Wallet" onChange={() => {}} />
          <div style={{ display:"flex", gap:8 }}>
            <OBtn>Charge Customer</OBtn>
            <GBtn>Generate QR</GBtn>
          </div>
        </Card>
        <Card>
          <SectionTitle>QR Code Terminal</SectionTitle>
          <div style={{ background:C.card2, border:`2px dashed ${C.border}`, borderRadius:12, padding:40, textAlign:"center" }}>
            <div style={{ width:80, height:80, background:C.purpleDim, border:`2px solid ${C.purpleBorder}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 12px" }}>📲</div>
            <p style={{ color:C.muted, fontSize:13 }}>QR Code appears here</p>
            <OBtn style={{ marginTop:16 }}>Generate QR</OBtn>
          </div>
        </Card>
      </div>
    </div>
  );

  if (page === "Loans") return (
    <div>
      <SectionTitle sub="Working capital financing for your business">Business Loans</SectionTitle>
      <Card style={{ marginBottom:16, border:`1px solid ${C.purpleBorder}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ color:C.purpleBright, fontSize:11, fontWeight:700, letterSpacing:"0.06em", marginBottom:8 }}>LOAN ELIGIBILITY</p>
            <p style={{ color:C.white, fontSize:28, fontWeight:800 }}>Up to BWP 50,000</p>
            <p style={{ color:C.muted, fontSize:12, marginTop:4 }}>8% flat interest · Instant approval based on sales history</p>
          </div>
          <Badge variant="purple">Pre-Approved</Badge>
        </div>
      </Card>
      <Card>
        <SectionTitle>Apply for Working Capital</SectionTitle>
        <Input label="Amount Requested (BWP)" placeholder="Max: 50,000" type="number" />
        <Select label="Purpose" options={["Inventory Purchase","Equipment","Business Expansion","Cash Flow","Other"]} value="Inventory Purchase" onChange={() => {}} />
        <Select label="Repayment Term" options={["3 months","6 months","9 months"]} value="6 months" onChange={() => {}} />
        <OBtn>Submit Application</OBtn>
      </Card>
    </div>
  );

  if (page === "Campaigns") return (
    <div>
      <SectionTitle sub="Create loyalty campaigns for Nthoppa customers">Customer Campaigns</SectionTitle>
      <Card style={{ marginBottom:16 }}>
        <SectionTitle>Create New Campaign</SectionTitle>
        <Select label="Discount Type" options={["Percentage (%)","Fixed Amount (BWP)"]} value="Percentage (%)" onChange={() => {}} />
        <Input label="Discount Value" placeholder="e.g. 10" type="number" />
        <Select label="Valid For" options={["All Nthoppa Users","Specific Group","First-Time Customers"]} value="All Nthoppa Users" onChange={() => {}} />
        <Input label="Campaign Budget (BWP)" placeholder="e.g. 5000" type="number" />
        <OBtn>Launch Campaign</OBtn>
      </Card>
      <Card>
        <SectionTitle>Active Campaigns</SectionTitle>
        <Table
          cols={["Campaign","Usage","Budget Used","Status"]}
          rows={[
            ["10% Weekend Discount","42 uses","BWP 1,890 / 5,000",<Badge variant="green">Active</Badge>],
            ["Loyalty Bonus – Groups","18 uses","BWP 900 / 2,000",<Badge variant="green">Active</Badge>],
            ["Flash Sale – Aug 20","Ended","BWP 3,000 / 3,000",<Badge variant="muted">Ended</Badge>],
          ]}
        />
      </Card>
    </div>
  );

  if (page === "Settlements") return (
    <div>
      <SectionTitle sub="Daily settlements and payout history">Settlements & Payouts</SectionTitle>
      <Card style={{ marginBottom:16, border:`1px solid ${C.greenBorder}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ color:C.muted, fontSize:11, fontWeight:600 }}>NEXT SETTLEMENT</p>
            <p style={{ color:C.greenBright, fontSize:22, fontWeight:800 }}>BWP 4,200</p>
            <p style={{ color:C.muted, fontSize:12 }}>Today at 5:00 PM · FNB Account ****3892</p>
          </div>
          <OBtn>Settle Now</OBtn>
        </div>
      </Card>
      <Card>
        <SectionTitle>Payout History</SectionTitle>
        <Table
          cols={["Date","Gross","Fee (1.5%)","Net","Status"]}
          rows={[
            ["Aug 20, 2023","BWP 4,200","BWP 63","BWP 4,137",<Badge variant="green">Settled</Badge>],
            ["Aug 19, 2023","BWP 3,850","BWP 58","BWP 3,792",<Badge variant="green">Settled</Badge>],
            ["Aug 18, 2023","BWP 5,100","BWP 76","BWP 5,024",<Badge variant="green">Settled</Badge>],
          ]}
        />
      </Card>
    </div>
  );

  return <div><SectionTitle>{page}</SectionTitle><Card><p style={{ color:C.muted }}>Content coming soon.</p></Card></div>;
}

// ADMIN PORTAL
function AdminPortal({ page }) {
  const [loanStatuses, setLoanStatuses] = useState({});
  const updateLoan = (id, status) => setLoanStatuses(prev => ({ ...prev, [id]: status }));

  if (page === "Overview") return (
    <div>
      <SectionTitle sub="Platform-wide financial overview">Admin / Investor Overview</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Total Platform AUM" value="BWP 438,655" color="#CA8A04" icon="🏦" />
        <StatCard label="Active Loans" value="6 loans" sub="BWP 35,000 deployed" color={C.orange} icon="📋" />
        <StatCard label="Motshelo Groups" value="3 groups" sub="35 total members" color={C.greenBright} icon="👥" />
        <StatCard label="Platform Revenue (MTD)" value="BWP 12,840" color={C.blueBright} icon="📈" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16 }}>
        <Card>
          <SectionTitle sub="Aug 2023">Platform Savings Trend</SectionTitle>
          <MiniChart data={MOCK.savingsChart} color="#CA8A04" />
        </Card>
        <Card>
          <SectionTitle>Live Activity</SectionTitle>
          {MOCK.activity.map((a, i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:14 }}>{a.icon}</span>
              <div>
                <p style={{ fontSize:12, color:C.white }}>{a.text}</p>
                <p style={{ fontSize:10, color:C.muted }}>{a.time}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  if (page === "Micro-Lender") return (
    <div>
      <SectionTitle sub="Review and approve loan applications">Micro-Lender Control</SectionTitle>
      {MOCK.loanApps.map(loan => {
        const status = loanStatuses[loan.id];
        return (
          <Card key={loan.id} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                  <span style={{ color:C.white, fontWeight:700, fontSize:14 }}>{loan.id}</span>
                  <Badge variant={loan.risk==="Low"?"green":loan.risk==="Medium"?"yellow":"red"}>{loan.risk} Risk</Badge>
                  {status && <Badge variant={status==="approved"?"green":"red"}>{status==="approved"?"Approved":"Declined"}</Badge>}
                </div>
                <p style={{ color:C.muted, fontSize:12 }}>{loan.group} · {loan.purpose}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ color:C.orange, fontWeight:800, fontSize:16 }}>{fmt(loan.amount)}</p>
                <p style={{ color:C.muted, fontSize:12 }}>{loan.duration} months</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:24, marginBottom:12 }}>
              <div><p style={{ color:C.muted, fontSize:11 }}>Risk Score</p><p style={{ color: loan.score > 70 ? C.greenBright : loan.score > 55 ? C.yellowBright : C.redBright, fontWeight:700 }}>{loan.score}/100</p></div>
              <div><p style={{ color:C.muted, fontSize:11 }}>Member Votes</p><p style={{ color:C.white, fontWeight:700 }}>{loan.votes}</p></div>
              <div><p style={{ color:C.muted, fontSize:11 }}>Requested</p><p style={{ color:C.white, fontWeight:700 }}>{loan.requested}</p></div>
            </div>
            <Bar value={loan.score} max={100} color={loan.score > 70 ? C.green : loan.score > 55 ? C.yellow : C.red} />
            {!status && (
              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                <OBtn sm onClick={() => updateLoan(loan.id, "approved")}>✓ Approve</OBtn>
                <GBtn sm onClick={() => updateLoan(loan.id, "declined")}>✕ Decline</GBtn>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );

  if (page === "Motshelo Groups") return (
    <div>
      <SectionTitle sub="Platform-wide group oversight">Motshelo Groups</SectionTitle>
      {MOCK.groups.map(g => (
        <Card key={g.id} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <h3 style={{ color:C.white, fontWeight:700, fontSize:14 }}>{g.name}</h3>
              <p style={{ color:C.muted, fontSize:12 }}>{g.members} members · Next: {g.nextPayment}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:"#CA8A04", fontWeight:800, fontSize:16 }}>{fmt(g.fund)}</p>
              <p style={{ color:C.greenBright, fontSize:12 }}>{g.growth} growth</p>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:10 }}>
            <div><p style={{ color:C.muted, fontSize:11 }}>Liquid</p><p style={{ color:C.white, fontSize:13, fontWeight:600 }}>{fmt(g.liquid)}</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>On Hold</p><p style={{ color:C.yellowBright, fontSize:13, fontWeight:600 }}>{fmt(g.fund - g.liquid)}</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Active Loans</p><p style={{ color:C.white, fontSize:13, fontWeight:600 }}>{g.loans}</p></div>
            <div><p style={{ color:C.muted, fontSize:11 }}>Health</p><p style={{ color:g.health > 85 ? C.greenBright : C.yellowBright, fontSize:13, fontWeight:700 }}>{g.health}%</p></div>
          </div>
          <Bar value={g.health} max={100} color={g.health > 85 ? C.green : C.yellow} />
        </Card>
      ))}
    </div>
  );

  if (page === "System Analytics") return (
    <div>
      <SectionTitle sub="Platform-wide analytics and risk indicators">System Analytics</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Platform Uptime" value="99.97%" color={C.greenBright} />
        <StatCard label="Active Users (30d)" value="2,847" color={C.orange} />
        <StatCard label="Avg Risk Score" value="68.3" sub="Across all loan apps" color={C.yellowBright} />
      </div>
      <Card style={{ marginBottom:16 }}>
        <SectionTitle>Fund Flow Overview</SectionTitle>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {[["Total Deposits","BWP 512,000",C.greenBright],["Total Loans Issued","BWP 98,000",C.orange],["Repayments Received","BWP 63,000",C.blueBright],["Platform Fees","BWP 12,840","#CA8A04"]].map(([l, v, c]) => (
            <div key={l} style={{ background:C.card2, borderRadius:10, padding:14 }}>
              <p style={{ color:C.muted, fontSize:11 }}>{l}</p>
              <p style={{ color:c, fontSize:18, fontWeight:800 }}>{v}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle>Partner Integrations</SectionTitle>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          {[{name:"Visa",type:"Payment",icon:"💳"},{name:"Orange Money",type:"Mobile Money",icon:"📱"},{name:"Core Banking API",type:"Banking",icon:"🏛️"},{name:"Smile ID",type:"KYC",icon:"🪪"},{name:"CRB Connect",type:"Credit",icon:"📈"},{name:"AWS",type:"Infrastructure",icon:"☁️"}].map(p => (
            <div key={p.name} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 16px", display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:18 }}>{p.icon}</span>
              <div>
                <p style={{ color:C.white, fontSize:12, fontWeight:700 }}>{p.name}</p>
                <p style={{ color:C.muted, fontSize:10 }}>{p.type}</p>
              </div>
              <Badge variant="green">Live</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  if (page === "Personal Savings") return (
    <div>
      <SectionTitle sub="Investor savings and portfolio tracking">Personal Savings</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        <StatCard label="Total Invested" value="BWP 85,000" color="#CA8A04" />
        <StatCard label="Total Returns" value="BWP 14,200" color={C.greenBright} />
        <StatCard label="Portfolio Growth" value="+16.7%" color={C.orange} />
      </div>
      <Card>
        <SectionTitle>Investment Breakdown</SectionTitle>
        <MiniChart data={MOCK.savingsChart} color="#CA8A04" />
      </Card>
    </div>
  );

  return <div><SectionTitle>{page}</SectionTitle><Card><p style={{ color:C.muted }}>Content coming soon.</p></Card></div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function NthoppaEcosystem() {
  const [authStep, setAuthStep] = useState("login"); // login | dashboard
  const [role, setRole] = useState("admin");
  const [page, setPage] = useState("Overview");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("admin");

  const roleConfig = ROLES[role];

  const handleLogin = () => {
    setRole(loginRole);
    setPage("Overview");
    setAuthStep("dashboard");
  };

  const handleRoleSwitch = (r) => { setRole(r); setPage("Overview"); };

  // LOGIN
  if (authStep === "login") return (
    <div style={{ minHeight:"100vh", background:C.black, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Sora',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');input,select{background:#1C1C1C!important;border:1px solid #232323!important;color:#fff!important;border-radius:10px!important;padding:10px 14px!important;font-size:13px!important;font-family:'Sora',sans-serif!important;outline:none!important;width:100%!important;}input::placeholder{color:#555!important;}`}</style>
      <div style={{ width:400 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:52, height:52, background:C.orange, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:22, color:"#fff", margin:"0 auto 16px" }}>N</div>
          <h1 style={{ color:C.white, fontSize:26, fontWeight:800, marginBottom:4 }}>Nthoppa</h1>
          <p style={{ color:C.muted, fontSize:13 }}>Financial Inclusion Ecosystem</p>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:28 }}>
          <p style={{ color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>Select Your Role</p>
          <select value={loginRole} onChange={e => setLoginRole(e.target.value)} style={{ marginBottom:16 }}>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v.badge} {v.label}</option>)}
          </select>
          <p style={{ color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>User ID / Phone</p>
          <input placeholder="+267 7X XXX XXX or User ID" value={userId} onChange={e => setUserId(e.target.value)} style={{ marginBottom:12 }} />
          <p style={{ color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>Password</p>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom:20 }} />
          <button onClick={handleLogin} style={{ width:"100%", background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
            Sign In as {ROLES[loginRole].label}
          </button>
          <p style={{ textAlign:"center", color:C.muted, fontSize:12, marginTop:14 }}>
            <span style={{ color:C.orange, cursor:"pointer" }}>Forgot Password?</span> · KYC Tier shown after login
          </p>
        </div>
        <p style={{ textAlign:"center", color:C.mutedMid, fontSize:11, marginTop:20 }}>
          🔒 AES-256 Encrypted · OAuth 2.0 · Real-time Monitoring
        </p>
      </div>
    </div>
  );

  // DASHBOARD
  return (
    <div style={{ minHeight:"100vh", background:C.black, display:"flex", fontFamily:"'Sora',sans-serif", color:C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:#111;}::-webkit-scrollbar-thumb{background:#FF6B00;border-radius:2px;}input,select,textarea{font-family:'Sora',sans-serif;}`}</style>

      {/* SIDEBAR */}
      <div style={{ width:220, flexShrink:0, background:C.dark, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", minHeight:"100vh", position:"sticky", top:0 }}>
        <div style={{ padding:"20px 16px 14px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:36, height:36, background:C.orange, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:"#fff", flexShrink:0 }}>N</div>
            <div>
              <p style={{ color:C.white, fontWeight:800, fontSize:14 }}>Nthoppa</p>
              <p style={{ color:C.muted, fontSize:10 }}>Financial Ecosystem</p>
            </div>
          </div>
        </div>

        <div style={{ padding:"12px 10px 6px" }}>
          <p style={{ color:C.mutedMid, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", paddingLeft:6, marginBottom:6 }}>Navigation</p>
          {roleConfig.nav.map(p => (
            <div key={p} onClick={() => setPage(p)} style={{ cursor:"pointer", padding:"9px 12px", borderRadius:10, fontSize:13, fontWeight:600, transition:"all 0.18s", color: page===p ? roleConfig.accent : C.muted, background: page===p ? roleConfig.accentDim : "transparent", border:`1px solid ${page===p ? roleConfig.accentBorder : "transparent"}`, marginBottom:2, display:"flex", alignItems:"center", gap:8 }}>
              {p}
            </div>
          ))}
        </div>

        <div style={{ marginTop:"auto", padding:"14px 10px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ padding:"8px 12px", background:C.card, borderRadius:10, marginBottom:10 }}>
            <p style={{ color:roleConfig.accent, fontSize:11, fontWeight:700 }}>{roleConfig.badge} {roleConfig.label}</p>
            <p style={{ color:C.muted, fontSize:10 }}>KYC Tier 2 · Verified</p>
          </div>
          <div onClick={() => setAuthStep("login")} style={{ cursor:"pointer", padding:"8px 12px", color:C.muted, fontSize:12, fontWeight:600, borderRadius:8 }}>
            🚪 Logout
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
        {/* HEADER */}
        <div style={{ height:56, background:C.dark, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:C.muted, fontSize:12 }}>Last login: Aug 21, 2023 · Gaborone, BW ·</span>
            <Badge variant={role==="agent"?"orange":role==="client"?"green":role==="hr"?"blue":role==="merchant"?"purple":"yellow"}>
              {roleConfig.badge} {roleConfig.label}
            </Badge>
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:18, cursor:"pointer" }}>🔔</span>
            <div style={{ width:32, height:32, borderRadius:"50%", background:roleConfig.accentDim, border:`1px solid ${roleConfig.accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👤</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, padding:24, overflowY:"auto" }}>
          {role === "agent"    && <AgentPortal page={page} />}
          {role === "client"   && <ClientPortal page={page} />}
          {role === "hr"       && <HRPortal page={page} />}
          {role === "merchant" && <MerchantPortal page={page} />}
          {role === "admin"    && <AdminPortal page={page} />}
        </div>

        {/* FOOTER */}
        <div style={{ borderTop:`1px solid ${C.border}`, padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", background:C.dark }}>
          <div style={{ display:"flex", gap:16 }}>
            {["🔒 AES-256","🛡️ OAuth 2.0","📡 Real-time Monitoring"].map(b => (
              <span key={b} style={{ color:C.mutedMid, fontSize:10, fontWeight:600 }}>{b}</span>
            ))}
          </div>
          <p style={{ color:C.mutedMid, fontSize:10 }}>© 2025 Nthoppa · <span style={{ color:C.muted, cursor:"pointer" }}>Support</span></p>
        </div>
      </div>

      {/* ROLE SWITCHER (DEV TOOL) */}
      <div style={{ position:"fixed", bottom:20, right:20, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"10px 14px", zIndex:100, boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}>
        <p style={{ color:C.muted, fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>🔀 Demo Role Switcher</p>
        <div style={{ display:"flex", gap:6 }}>
          {Object.entries(ROLES).map(([k, v]) => (
            <button key={k} onClick={() => handleRoleSwitch(k)} style={{ padding:"5px 10px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${role===k ? v.accent : C.border}`, background: role===k ? v.accentDim : "transparent", color: role===k ? v.accent : C.muted, transition:"all 0.2s" }}>
              {v.badge}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
