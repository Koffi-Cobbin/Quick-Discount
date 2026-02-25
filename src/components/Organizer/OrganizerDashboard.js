import { useState, useEffect, useCallback } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_STATS = {
  packagesSold: 1284,
  activeDiscounts: 7,
  pendingDiscounts: 3,
  rejectedDiscounts: 1,
  totalRevenue: 48320,
  conversionRate: 68,
};

const MOCK_CHART_DATA = [
  { label: "Jan", tickets: 40, revenue: 3200 },
  { label: "Feb", tickets: 65, revenue: 5200 },
  { label: "Mar", tickets: 55, revenue: 4400 },
  { label: "Apr", tickets: 90, revenue: 7200 },
  { label: "May", tickets: 78, revenue: 6240 },
  { label: "Jun", tickets: 110, revenue: 8800 },
  { label: "Jul", tickets: 95, revenue: 7600 },
  { label: "Aug", tickets: 130, revenue: 10400 },
];

const MOCK_DISCOUNTS = [
  {
    id: 1,
    title: "Lagos Food Festival",
    status: "active",
    sold: 240,
    capacity: 300,
    date: "Mar 15",
    category: "Food",
  },
  {
    id: 2,
    title: "Tech Summit 2025",
    status: "active",
    sold: 180,
    capacity: 250,
    date: "Apr 2",
    category: "Tech",
  },
  {
    id: 3,
    title: "Accra Jazz Night",
    status: "pending",
    sold: 0,
    capacity: 150,
    date: "Apr 20",
    category: "Music",
  },
  {
    id: 4,
    title: "Fitness Bootcamp",
    status: "active",
    sold: 88,
    capacity: 100,
    date: "Mar 28",
    category: "Sports",
  },
  {
    id: 5,
    title: "Art Gallery Opening",
    status: "rejected",
    sold: 0,
    capacity: 80,
    date: "—",
    category: "Art",
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "sale",
    message: "12 new tickets sold for Lagos Food Festival",
    time: "2m ago",
  },
  {
    id: 2,
    type: "review",
    message: "Tech Summit 2025 is under review",
    time: "1h ago",
  },
  {
    id: 3,
    type: "alert",
    message: "Fitness Bootcamp is 88% sold out!",
    time: "3h ago",
  },
  {
    id: 4,
    type: "sale",
    message: "5 tickets sold for Tech Summit 2025",
    time: "5h ago",
  },
];

const STATUS_CFG = {
  active: { label: "Active", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  pending: { label: "Pending", color: "#fa8128", bg: "rgba(250,129,40,0.12)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const NOTIF_ICON = {
  sale: { icon: "dollar", color: "#22c55e" },
  review: { icon: "clock", color: "#fa8128" },
  alert: { icon: "zap", color: "#ef4444" },
};

const CAT_EMOJI = {
  Food: "🍜",
  Tech: "💻",
  Music: "🎵",
  Sports: "🏋️",
  Art: "🎨",
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "discounts", label: "Discounts", icon: "tag", badge: 7 },
  { id: "notifications", label: "Notifications", icon: "bell", badge: 4 },
  { id: "settings", label: "Settings", icon: "settings" },
];

// ─── useWindowWidth ───────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768,
  );
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

// ─── SVG Icon Set ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const icons = {
    dashboard: (
      <svg {...p}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    bell: (
      <svg {...p}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    tag: (
      <svg {...p}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    settings: (
      <svg {...p}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    trending: (
      <svg {...p}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    package: (
      <svg {...p}>
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    clock: (
      <svg {...p}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    plus: (
      <svg {...p}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    zap: (
      <svg {...p}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    dollar: (
      <svg {...p}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    menu: (
      <svg {...p}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    close: (
      <svg {...p}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    arrow: (
      <svg {...p}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };
  return icons[name] ?? null;
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedNumber = ({ target, prefix = "", suffix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = target / 40;
    const t = setInterval(() => {
      n += step;
      if (n >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(Math.floor(n));
    }, 28);
    return () => clearInterval(t);
  }, [target]);
  return (
    <>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </>
  );
};

// ─── Bar Chart (responsive) ───────────────────────────────────────────────────
const BarChart = ({ data, metric, isTiny }) => {
  const max = Math.max(...data.map((d) => d[metric]));
  const bars = isTiny ? data.slice(-5) : data;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: isTiny ? "3px" : "6px",
        height: isTiny ? "56px" : "80px",
        paddingTop: "4px",
      }}
    >
      {bars.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${(d[metric] / max) * (isTiny ? 40 : 60)}px`,
              background: "linear-gradient(180deg,#fa8128,#dc670e)",
              borderRadius: "2px 2px 0 0",
              boxShadow: "0 0 5px rgba(250,129,40,0.3)",
              transition: "height 0.6s ease",
            }}
          />
          <span
            style={{
              fontSize: isTiny ? "7px" : "9px",
              color: "rgba(240,236,230,0.38)",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
            }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Mobile Discount Card ─────────────────────────────────────────────────────
const DiscountCard = ({ d, isTiny }) => {
  const sc = STATUS_CFG[d.status];
  const pct = d.capacity > 0 ? Math.round((d.sold / d.capacity) * 100) : 0;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(250,129,40,0.12)",
        borderRadius: "10px",
        padding: isTiny ? "12px 10px" : "14px",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "10px",
          gap: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: 0,
            flex: 1,
          }}
        >
          <span style={{ fontSize: "18px", flexShrink: 0 }}>
            {CAT_EMOJI[d.category]}
          </span>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: isTiny ? "12px" : "13px",
                fontWeight: 600,
                color: "#f0ece6",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {d.title}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(240,236,230,0.38)",
                marginTop: "2px",
              }}
            >
              {d.date} · {d.category}
            </div>
          </div>
        </div>
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "10px",
            fontSize: "9px",
            background: sc.bg,
            color: sc.color,
            fontFamily: "monospace",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {sc.label}
        </span>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "rgba(240,236,230,0.42)",
              fontFamily: "monospace",
            }}
          >
            {d.sold} / {d.capacity} sold
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "#fa8128",
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            {pct}%
          </span>
        </div>
        <div
          style={{
            height: "3px",
            background: "rgba(255,255,255,0.07)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg,#fa8128,#dc670e)",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
      <button
        style={{
          marginTop: "11px",
          width: "100%",
          padding: "8px",
          background: "rgba(250,129,40,0.08)",
          border: "1px solid rgba(250,129,40,0.18)",
          borderRadius: "7px",
          color: "#fa8128",
          fontSize: "12px",
          fontFamily: "Georgia,serif",
          cursor: "pointer",
        }}
      >
        Edit Discount
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function OrganizerDashboard() {
  const [section, setSection] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chartMetric, setChartMetric] = useState("tickets");
  const [mounted, setMounted] = useState(false);

  const width = useWindowWidth();
  const isTiny = width < 380; // 320 – 379
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const changeSection = useCallback((id) => {
    setSection(id);
    setDrawerOpen(false);
  }, []);

  const SECTION_LABEL = {
    dashboard: "Overview",
    discounts: "Discounts",
    notifications: "Notifications",
    settings: "Settings",
  };

  // ── Injected CSS ───────────────────────────────────────────────────────────
  const globalCss = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-text-size-adjust: 100%; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: rgba(250,129,40,0.22); border-radius: 2px; }
    button { cursor: pointer; border: none; background: none; -webkit-tap-highlight-color: transparent; }
    input { -webkit-appearance: none; }
    @keyframes fadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideIn  { from { transform:translateX(-100%); } to { transform:translateX(0); } }
    @keyframes overlayIn{ from { opacity:0; } to { opacity:1; } }
    @keyframes glow     { 0%,100%{ box-shadow:0 0 8px rgba(250,129,40,0.2); } 50%{ box-shadow:0 0 20px rgba(250,129,40,0.42); } }
    .c-hover { transition: transform .22s ease, box-shadow .22s ease; }
    .c-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(250,129,40,0.18) !important; }
    .nav-btn { transition: background .18s, color .18s; }
    .nav-btn:hover { background: rgba(250,129,40,0.09) !important; }
    .tab-btn { transition: color .18s, background .18s, border-color .18s; }
    .add-btn { transition: background .18s, transform .18s; }
    .add-btn:hover { background: linear-gradient(135deg,#fa8128,#dc670e) !important; color:#fff !important; }
    .row-h   { transition: background .17s; }
    .row-h:hover { background: rgba(250,129,40,0.04) !important; }
    input:focus { border-color: rgba(250,129,40,0.38) !important; outline:none;
      box-shadow: 0 0 0 2px rgba(250,129,40,0.1); }
  `;

  // ── Sidebar inner content (reused in drawer + desktop) ─────────────────────
  const SidebarInner = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      {/* ambient top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "140px",
          background:
            "radial-gradient(ellipse at top, rgba(250,129,40,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 14px",
          borderBottom: "1px solid rgba(250,129,40,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              flexShrink: 0,
              background: "linear-gradient(135deg,#fa8128,#dc670e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Cinzel',serif",
              fontWeight: 700,
              fontSize: "12px",
              color: "#fff",
            }}
          >
            O
          </div>
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#f0ece6",
              letterSpacing: "0.05em",
            }}
          >
            Organizer
          </span>
        </div>
        {isMobile && (
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              color: "rgba(240,236,230,0.5)",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </div>

      {/* Profile */}
      <div
        style={{
          padding: "16px 14px",
          borderBottom: "1px solid rgba(250,129,40,0.08)",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(250,129,40,0.09)",
            border: "2px solid rgba(250,129,40,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            marginBottom: "9px",
            animation: "glow 3s ease-in-out infinite",
          }}
        >
          🎭
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "rgba(240,236,230,0.45)",
            marginBottom: "2px",
          }}
        >
          Welcome back,
        </div>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "14px",
            color: "#fa8128",
            fontWeight: 600,
          }}
        >
          Organizer
        </div>
        <div
          style={{
            fontSize: "9px",
            color: "rgba(240,236,230,0.28)",
            letterSpacing: "0.1em",
            marginTop: "4px",
          }}
        >
          PREMIUM PLAN
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 6px", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              className="nav-btn"
              onClick={() => changeSection(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 10px",
                borderRadius: "7px",
                marginBottom: "2px",
                background: active ? "rgba(250,129,40,0.11)" : "transparent",
                borderLeft: active
                  ? "2px solid #fa8128"
                  : "2px solid transparent",
                color: active ? "#fa8128" : "rgba(240,236,230,0.52)",
                fontFamily: "Georgia,serif",
                fontSize: "13px",
              }}
            >
              <Icon
                name={item.icon}
                size={15}
                color={active ? "#fa8128" : "rgba(240,236,230,0.42)"}
              />
              <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    background: active ? "#fa8128" : "rgba(250,129,40,0.2)",
                    color: active ? "#fff" : "#fa8128",
                    fontSize: "9px",
                    fontFamily: "monospace",
                    padding: "1px 6px",
                    borderRadius: "9px",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* New Discount CTA */}
      <div style={{ padding: "12px 10px" }}>
        <button
          className="add-btn"
          style={{
            width: "100%",
            padding: "9px",
            background: "rgba(250,129,40,0.08)",
            border: "1px solid rgba(250,129,40,0.25)",
            borderRadius: "7px",
            color: "#fa8128",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: "12px",
            fontFamily: "Georgia,serif",
          }}
        >
          <Icon name="plus" size={12} color="#fa8128" /> New Discount
        </button>
      </div>
    </div>
  );

  // ── SECTION: Dashboard ─────────────────────────────────────────────────────
  const DashboardView = () => (
    <div>
      {/* Stat grid: 2-col on mobile/tiny, 4-col on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(4,1fr)" : "repeat(2,1fr)",
          gap: isTiny ? "7px" : "10px",
          marginBottom: isTiny ? "12px" : "18px",
        }}
      >
        {[
          {
            label: "Packages Sold",
            value: MOCK_STATS.packagesSold,
            icon: "package",
            prefix: "",
            suffix: "",
          },
          {
            label: "Revenue",
            value: MOCK_STATS.totalRevenue,
            icon: "dollar",
            prefix: "₵",
            suffix: "",
          },
          {
            label: "Active",
            value: MOCK_STATS.activeDiscounts,
            icon: "tag",
            prefix: "",
            suffix: "",
          },
          {
            label: "Conversion",
            value: MOCK_STATS.conversionRate,
            icon: "trending",
            prefix: "",
            suffix: "%",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="c-hover"
            style={{
              background: "rgba(255,255,255,0.026)",
              border: "1px solid rgba(250,129,40,0.12)",
              borderRadius: isTiny ? "8px" : "10px",
              padding: isTiny ? "11px 9px" : "14px 12px",
              position: "relative",
              overflow: "hidden",
              animation: `fadeUp 0.44s ${0.05 + i * 0.07}s ease both`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.26)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50px",
                height: "50px",
                background:
                  "radial-gradient(circle, rgba(250,129,40,0.07) 0%, transparent 70%)",
              }}
            />
            <div
              style={{
                width: isTiny ? "24px" : "28px",
                height: isTiny ? "24px" : "28px",
                borderRadius: "6px",
                background: "rgba(250,129,40,0.1)",
                border: "1px solid rgba(250,129,40,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <Icon name={s.icon} size={isTiny ? 12 : 13} color="#fa8128" />
            </div>
            <div
              style={{
                fontSize: isTiny ? "17px" : "20px",
                fontFamily: "'Cinzel',serif",
                fontWeight: 700,
                color: "#f0ece6",
                lineHeight: 1.1,
                marginBottom: "3px",
              }}
            >
              <AnimatedNumber
                target={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
              />
            </div>
            <div
              style={{
                fontSize: isTiny ? "9px" : "10px",
                color: "rgba(240,236,230,0.4)",
                lineHeight: 1.3,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Status breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 260px" : "1fr",
          gap: "10px",
          marginBottom: isTiny ? "12px" : "18px",
        }}
      >
        {/* Bar chart card */}
        <div
          style={{
            background: "rgba(255,255,255,0.026)",
            border: "1px solid rgba(250,129,40,0.12)",
            borderRadius: "10px",
            padding: isTiny ? "12px 10px" : "16px",
            animation: "fadeUp 0.44s 0.3s ease both",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: isTiny ? "12px" : "13px",
                fontWeight: 600,
                color: "#f0ece6",
              }}
            >
              Analytics
            </span>
            <div style={{ display: "flex", gap: "3px" }}>
              {["tickets", "revenue"].map((m) => (
                <button
                  key={m}
                  className="tab-btn"
                  onClick={() => setChartMetric(m)}
                  style={{
                    padding: isTiny ? "3px 7px" : "3px 10px",
                    borderRadius: "5px",
                    fontSize: isTiny ? "8px" : "9px",
                    fontFamily: "monospace",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    background:
                      chartMetric === m
                        ? "rgba(250,129,40,0.14)"
                        : "transparent",
                    color:
                      chartMetric === m ? "#fa8128" : "rgba(240,236,230,0.38)",
                    border:
                      chartMetric === m
                        ? "1px solid rgba(250,129,40,0.28)"
                        : "1px solid transparent",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <BarChart
            data={MOCK_CHART_DATA}
            metric={chartMetric}
            isTiny={isTiny}
          />
        </div>

        {/* Status card */}
        <div
          style={{
            background: "rgba(255,255,255,0.026)",
            border: "1px solid rgba(250,129,40,0.12)",
            borderRadius: "10px",
            padding: isTiny ? "12px 10px" : "16px",
            animation: "fadeUp 0.44s 0.36s ease both",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: isTiny ? "12px" : "13px",
              fontWeight: 600,
              color: "#f0ece6",
              marginBottom: "12px",
            }}
          >
            Status
          </div>

          {/* Mobile: pill row. Desktop: progress bars */}
          {isMobile ? (
            <div style={{ display: "flex", gap: isTiny ? "5px" : "7px" }}>
              {[
                {
                  label: "Active",
                  count: MOCK_STATS.activeDiscounts,
                  color: "#22c55e",
                },
                {
                  label: "Pending",
                  count: MOCK_STATS.pendingDiscounts,
                  color: "#fa8128",
                },
                {
                  label: "Rejected",
                  count: MOCK_STATS.rejectedDiscounts,
                  color: "#ef4444",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${s.color}22`,
                    borderRadius: "8px",
                    padding: isTiny ? "9px 4px" : "10px 6px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: isTiny ? "18px" : "20px",
                      fontFamily: "'Cinzel',serif",
                      fontWeight: 700,
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {s.count}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "rgba(240,236,230,0.38)",
                      marginTop: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {[
                {
                  label: "Active",
                  count: MOCK_STATS.activeDiscounts,
                  color: "#22c55e",
                  t: 11,
                },
                {
                  label: "Pending",
                  count: MOCK_STATS.pendingDiscounts,
                  color: "#fa8128",
                  t: 11,
                },
                {
                  label: "Rejected",
                  count: MOCK_STATS.rejectedDiscounts,
                  color: "#ef4444",
                  t: 11,
                },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: "13px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "rgba(240,236,230,0.5)",
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: s.color,
                        fontWeight: 700,
                      }}
                    >
                      {s.count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "3px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(s.count / s.t) * 100}%`,
                        background: s.color,
                        borderRadius: "2px",
                        boxShadow: `0 0 5px ${s.color}44`,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
              <div
                style={{
                  marginTop: "14px",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(250,129,40,0.07)",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    color: "rgba(240,236,230,0.28)",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                  }}
                >
                  Upcoming
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontFamily: "'Cinzel',serif",
                    fontWeight: 700,
                    color: "#fa8128",
                  }}
                >
                  3
                </div>
                <div
                  style={{ fontSize: "11px", color: "rgba(240,236,230,0.36)" }}
                >
                  events this week
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Discounts */}
      <div
        style={{
          background: "rgba(255,255,255,0.026)",
          border: "1px solid rgba(250,129,40,0.12)",
          borderRadius: "10px",
          padding: isTiny ? "12px 10px" : "16px",
          animation: "fadeUp 0.44s 0.42s ease both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: isTiny ? "12px" : "13px",
              fontWeight: 600,
              color: "#f0ece6",
            }}
          >
            Recent Discounts
          </span>
          <button
            onClick={() => changeSection("discounts")}
            style={{
              color: "#fa8128",
              fontSize: "11px",
              fontFamily: "Georgia,serif",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            All <Icon name="arrow" size={11} color="#fa8128" />
          </button>
        </div>

        {MOCK_DISCOUNTS.slice(0, isTiny ? 2 : 3).map((d, i) => {
          const sc = STATUS_CFG[d.status];
          const pct =
            d.capacity > 0 ? Math.round((d.sold / d.capacity) * 100) : 0;
          return (
            <div
              key={d.id}
              className="row-h"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isTiny ? "7px" : "10px",
                padding: isTiny ? "8px 5px" : "10px 6px",
                borderRadius: "7px",
                marginBottom: "2px",
                animation: `fadeUp 0.4s ${0.5 + i * 0.06}s ease both`,
              }}
            >
              <span
                style={{ fontSize: isTiny ? "15px" : "17px", flexShrink: 0 }}
              >
                {CAT_EMOJI[d.category]}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: isTiny ? "11px" : "12px",
                    fontWeight: 600,
                    color: "#f0ece6",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {d.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "4px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "2px",
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "linear-gradient(90deg,#fa8128,#dc670e)",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#fa8128",
                      fontFamily: "monospace",
                      flexShrink: 0,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <span
                style={{
                  padding: "2px 7px",
                  borderRadius: "9px",
                  fontSize: "9px",
                  background: sc.bg,
                  color: sc.color,
                  fontFamily: "monospace",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {sc.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── SECTION: Discounts ─────────────────────────────────────────────────────
  const DiscountsView = () => (
    <div>
      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="add-btn"
          style={{
            padding: "8px 14px",
            background: "rgba(250,129,40,0.09)",
            border: "1px solid rgba(250,129,40,0.25)",
            borderRadius: "7px",
            color: "#fa8128",
            fontSize: isTiny ? "11px" : "12px",
            fontFamily: "Georgia,serif",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Icon name="plus" size={11} color="#fa8128" /> New Discount
        </button>
      </div>

      {/* Mobile → cards; Desktop → table */}
      {isMobile ? (
        <div>
          {MOCK_DISCOUNTS.map((d, i) => (
            <div
              key={d.id}
              style={{ animation: `fadeUp 0.4s ${i * 0.06}s ease both` }}
            >
              <DiscountCard d={d} isTiny={isTiny} />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(250,129,40,0.12)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Table head */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 0.65fr 1.3fr 0.85fr 65px",
              padding: "10px 16px",
              background: "rgba(250,129,40,0.04)",
              borderBottom: "1px solid rgba(250,129,40,0.07)",
            }}
          >
            {["Discount", "Date", "Sold / Cap", "Status", ""].map((h, i) => (
              <span
                key={i}
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  color: "rgba(240,236,230,0.3)",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {MOCK_DISCOUNTS.map((d, i) => {
            const sc = STATUS_CFG[d.status];
            const pct =
              d.capacity > 0 ? Math.round((d.sold / d.capacity) * 100) : 0;
            return (
              <div
                key={d.id}
                className="row-h"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 0.65fr 1.3fr 0.85fr 65px",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom:
                    i < MOCK_DISCOUNTS.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  animation: `fadeUp 0.4s ${i * 0.06}s ease both`,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "9px" }}
                >
                  <span style={{ fontSize: "16px" }}>
                    {CAT_EMOJI[d.category]}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#f0ece6",
                      }}
                    >
                      {d.title}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "rgba(240,236,230,0.38)",
                      }}
                    >
                      {d.category}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "rgba(240,236,230,0.45)",
                    fontFamily: "monospace",
                  }}
                >
                  {d.date}
                </span>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "rgba(240,236,230,0.42)",
                        fontFamily: "monospace",
                      }}
                    >
                      {d.sold}/{d.capacity}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#fa8128",
                        fontFamily: "monospace",
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "2px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "linear-gradient(90deg,#fa8128,#dc670e)",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "10px",
                    background: sc.bg,
                    color: sc.color,
                    fontFamily: "monospace",
                  }}
                >
                  {sc.label}
                </span>
                <button
                  style={{
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontSize: "11px",
                    background: "rgba(250,129,40,0.09)",
                    border: "1px solid rgba(250,129,40,0.18)",
                    color: "#fa8128",
                    fontFamily: "Georgia,serif",
                  }}
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── SECTION: Notifications ─────────────────────────────────────────────────
  const NotificationsView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      {MOCK_NOTIFICATIONS.map((n, i) => {
        const nc = NOTIF_ICON[n.type];
        return (
          <div
            key={n.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: isTiny ? "9px" : "12px",
              padding: isTiny ? "11px 10px" : "13px 14px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(250,129,40,0.09)",
              borderRadius: "9px",
              animation: `fadeUp 0.4s ${i * 0.07}s ease both`,
            }}
          >
            <div
              style={{
                width: isTiny ? "28px" : "32px",
                height: isTiny ? "28px" : "32px",
                borderRadius: "7px",
                flexShrink: 0,
                background: `${nc.color}12`,
                border: `1px solid ${nc.color}24`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={nc.icon} size={isTiny ? 13 : 14} color={nc.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: isTiny ? "12px" : "13px",
                  color: "#f0ece6",
                  marginBottom: "4px",
                  lineHeight: 1.4,
                }}
              >
                {n.message}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(240,236,230,0.32)",
                  fontFamily: "monospace",
                }}
              >
                {n.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── SECTION: Settings ──────────────────────────────────────────────────────
  const SettingsView = () => (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(250,129,40,0.12)",
        borderRadius: "10px",
        padding: isTiny ? "14px 12px" : "20px",
        maxWidth: isDesktop ? "520px" : "100%",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: isTiny ? "12px" : "13px",
          color: "#fa8128",
          marginBottom: "16px",
          letterSpacing: "0.08em",
        }}
      >
        PROFILE SETTINGS
      </div>

      {["Organizer Name", "Contact Email", "Phone Number"].map((label, i) => (
        <div key={i} style={{ marginBottom: "13px" }}>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              color: "rgba(240,236,230,0.38)",
              marginBottom: "5px",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            {label}
          </label>
          <input
            style={{
              width: "100%",
              padding: isTiny ? "9px 10px" : "10px 12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(250,129,40,0.14)",
              borderRadius: "7px",
              color: "#f0ece6",
              fontSize: "13px",
              fontFamily: "Georgia,serif",
            }}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </div>
      ))}

      <button
        style={{
          marginTop: "6px",
          width: isMobile ? "100%" : "auto",
          padding: "10px 22px",
          background: "linear-gradient(135deg,#fa8128,#dc670e)",
          border: "none",
          borderRadius: "7px",
          color: "#fff",
          fontSize: "13px",
          fontFamily: "Georgia,serif",
          fontWeight: 600,
          boxShadow: "0 4px 14px rgba(250,129,40,0.3)",
          cursor: "pointer",
        }}
      >
        Save Changes
      </button>
    </div>
  );

  const renderSection = () => {
    if (section === "dashboard") return <DashboardView />;
    if (section === "discounts") return <DiscountsView />;
    if (section === "notifications") return <NotificationsView />;
    if (section === "settings") return <SettingsView />;
  };

  // ── ROOT RENDER ────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0a0604",
        fontFamily: "Georgia,serif",
        color: "#f0ece6",
        position: "relative",
      }}
    >
      <style>{globalCss}</style>

      {/* ══ DESKTOP SIDEBAR ══ */}
      {!isMobile && (
        <aside
          style={{
            width: isTablet ? "196px" : "220px",
            minHeight: "100vh",
            flexShrink: 0,
            background: "rgba(14,9,4,0.97)",
            borderRight: "1px solid rgba(250,129,40,0.09)",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <SidebarInner />
        </aside>
      )}

      {/* ══ MOBILE DRAWER ══ */}
      {isMobile && drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.62)",
              zIndex: 40,
              animation: "overlayIn 0.2s ease both",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: isTiny ? "236px" : "256px",
              background: "rgba(12,7,3,0.99)",
              borderRight: "1px solid rgba(250,129,40,0.12)",
              zIndex: 50,
              overflowY: "auto",
              animation: "slideIn 0.24s ease both",
            }}
          >
            <SidebarInner />
          </div>
        </>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isTiny ? "11px 11px" : "12px 14px",
              background: "rgba(12,7,3,0.97)",
              borderBottom: "1px solid rgba(250,129,40,0.09)",
              position: "sticky",
              top: 0,
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  color: "rgba(240,236,230,0.55)",
                  padding: "5px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(250,129,40,0.09)",
                }}
              >
                <Icon name="menu" size={17} />
              </button>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "5px",
                    background: "linear-gradient(135deg,#fa8128,#dc670e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Cinzel',serif",
                    fontWeight: 700,
                    fontSize: "10px",
                    color: "#fff",
                  }}
                >
                  O
                </div>
                <span
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: isTiny ? "11px" : "13px",
                    fontWeight: 600,
                    color: "#f0ece6",
                  }}
                >
                  Organizer
                </span>
              </div>
            </div>
            <button
              onClick={() => changeSection("notifications")}
              style={{
                position: "relative",
                padding: "6px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(250,129,40,0.09)",
                borderRadius: "7px",
                color: "rgba(240,236,230,0.55)",
              }}
            >
              <Icon name="bell" size={16} />
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#fa8128",
                  border: "1.5px solid #0a0604",
                }}
              />
            </button>
          </header>
        )}

        {/* Desktop page title */}
        {!isMobile && (
          <div
            style={{
              padding: isTablet ? "24px 22px 0" : "26px 30px 0",
              animation: mounted ? "fadeUp 0.44s ease both" : "none",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.14em",
                color: "rgba(250,129,40,0.6)",
                fontFamily: "monospace",
                marginBottom: "4px",
                textTransform: "uppercase",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h1
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: isTablet ? "20px" : "24px",
                fontWeight: 700,
                color: "#f0ece6",
                marginBottom: "20px",
              }}
            >
              {SECTION_LABEL[section]}
            </h1>
          </div>
        )}

        {/* Scrollable content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isTiny
              ? "12px 10px 86px" // bottom pad = tab bar height
              : isMobile
                ? "14px 13px 78px"
                : isTablet
                  ? "6px 22px 26px"
                  : "6px 30px 30px",
            animation: mounted ? "fadeUp 0.44s 0.09s ease both" : "none",
          }}
        >
          {/* Mobile section title */}
          {isMobile && (
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: isTiny ? "15px" : "17px",
                fontWeight: 700,
                color: "#f0ece6",
                marginBottom: isTiny ? "11px" : "13px",
              }}
            >
              {SECTION_LABEL[section]}
            </div>
          )}
          {renderSection()}
        </main>

        {/* ══ MOBILE BOTTOM TAB BAR ══ */}
        {isMobile && (
          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(10,6,4,0.98)",
              borderTop: "1px solid rgba(250,129,40,0.11)",
              display: "flex",
              zIndex: 30,
              // Safe area for iPhone notch / home indicator
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => changeSection(item.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isTiny ? "9px 2px 8px" : "10px 4px 9px",
                    gap: "3px",
                    position: "relative",
                    color: active ? "#fa8128" : "rgba(240,236,230,0.36)",
                    background: "transparent",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {/* Top accent line when active */}
                  {active && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "28%",
                        right: "28%",
                        height: "2px",
                        background: "#fa8128",
                        borderRadius: "0 0 2px 2px",
                      }}
                    />
                  )}
                  {/* Unread dot */}
                  {item.badge && !active && (
                    <div
                      style={{
                        position: "absolute",
                        top: isTiny ? "7px" : "8px",
                        // offset dot to top-right of icon centre
                        left: `calc(50% + ${isTiny ? 7 : 8}px)`,
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#fa8128",
                        border: "1.5px solid #0a0604",
                      }}
                    />
                  )}
                  <Icon
                    name={item.icon}
                    size={isTiny ? 18 : 20}
                    color={active ? "#fa8128" : "rgba(240,236,230,0.36)"}
                  />
                  <span
                    style={{
                      fontSize: isTiny ? "7px" : "8px",
                      fontFamily: "monospace",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      fontWeight: active ? 700 : 400,
                      lineHeight: 1,
                    }}
                  >
                    {/* Shorten labels on tiny screens */}
                    {isTiny
                      ? {
                          dashboard: "Home",
                          discounts: "Deals",
                          notifications: "Alerts",
                          settings: "Config",
                        }[item.id]
                      : item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
