import { useState, useEffect, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ORGANIZER = {
    name: "Kwame Asante",
    plan: "Premium",
    avatar: "🎭",
    joined: "Jan 2024",
    location: "Accra, Ghana",
};

const STATS = {
    packagesSold: 1284,
    totalRevenue: 48320,
    activeDiscounts: 7,
    conversionRate: 68,
    savedByUsers: 342,
    totalViews: 9810,
};

const CHART_DATA = [
    { label: "Jan", tickets: 40, revenue: 3200 },
    { label: "Feb", tickets: 65, revenue: 5200 },
    { label: "Mar", tickets: 55, revenue: 4400 },
    { label: "Apr", tickets: 90, revenue: 7200 },
    { label: "May", tickets: 78, revenue: 6240 },
    { label: "Jun", tickets: 110, revenue: 8800 },
    { label: "Jul", tickets: 95, revenue: 7600 },
    { label: "Aug", tickets: 130, revenue: 10400 },
];

const MY_DISCOUNTS = [
    {
        id: 1,
        title: "Lagos Food Festival",
        status: "active",
        sold: 240,
        capacity: 300,
        date: "Mar 15",
        category: "Food",
        price: "₵45",
    },
    {
        id: 2,
        title: "Tech Summit 2025",
        status: "active",
        sold: 180,
        capacity: 250,
        date: "Apr 2",
        category: "Tech",
        price: "₵120",
    },
    {
        id: 3,
        title: "Accra Jazz Night",
        status: "pending",
        sold: 0,
        capacity: 150,
        date: "Apr 20",
        category: "Music",
        price: "₵60",
    },
    {
        id: 4,
        title: "Fitness Bootcamp",
        status: "active",
        sold: 88,
        capacity: 100,
        date: "Mar 28",
        category: "Sports",
        price: "₵30",
    },
    {
        id: 5,
        title: "Art Gallery Opening",
        status: "rejected",
        sold: 0,
        capacity: 80,
        date: "—",
        category: "Art",
        price: "₵25",
    },
    {
        id: 6,
        title: "Street Food Tour",
        status: "active",
        sold: 55,
        capacity: 80,
        date: "Apr 5",
        category: "Food",
        price: "₵35",
    },
];

const SAVED_DISCOUNTS = [
    {
        id: 10,
        title: "Nairobi Jazz Fest",
        category: "Music",
        date: "May 3",
        price: "₵80",
        rating: 4.8,
        org: "Jazz Kenya",
    },
    {
        id: 11,
        title: "Lagos Art Expo",
        category: "Art",
        date: "May 10",
        price: "₵50",
        rating: 4.6,
        org: "Art Lagos",
    },
    {
        id: 12,
        title: "Abuja Tech Conf",
        category: "Tech",
        date: "Jun 1",
        price: "₵200",
        rating: 4.9,
        org: "TechAbuja",
    },
    {
        id: 13,
        title: "Cape Coast Beach Run",
        category: "Sports",
        date: "May 20",
        price: "₵20",
        rating: 4.5,
        org: "Run GH",
    },
];

const NOTIFICATIONS = [
    {
        id: 1,
        type: "sale",
        msg: "12 new tickets sold for Lagos Food Festival",
        time: "2m ago",
        read: false,
    },
    {
        id: 2,
        type: "review",
        msg: "Tech Summit 2025 is under review by admin",
        time: "1h ago",
        read: false,
    },
    {
        id: 3,
        type: "alert",
        msg: "Fitness Bootcamp is 88% sold out!",
        time: "3h ago",
        read: false,
    },
    {
        id: 4,
        type: "sale",
        msg: "5 tickets sold for Tech Summit 2025",
        time: "5h ago",
        read: true,
    },
    {
        id: 5,
        type: "info",
        msg: "Your profile was updated successfully",
        time: "1d ago",
        read: true,
    },
];

const STATUS_CFG = {
    active: { label: "Active", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    pending: {
        label: "Pending",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)",
    },
    rejected: {
        label: "Rejected",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.12)",
    },
};

const NOTIF_CFG = {
    sale: { icon: "💰", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    review: { icon: "🔍", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    alert: { icon: "⚡", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    info: { icon: "ℹ️", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
};

const CAT_EMOJI = {
    Food: "🍜",
    Tech: "💻",
    Music: "🎵",
    Sports: "🏋️",
    Art: "🎨",
};
const CAT_COLOR = {
    Food: "#f97316",
    Tech: "#60a5fa",
    Music: "#a78bfa",
    Sports: "#34d399",
    Art: "#f472b6",
};

// ─── useWindowWidth ───────────────────────────────────────────────────────────
function useWindowWidth() {
    const [w, setW] = useState(
        typeof window !== "undefined" ? window.innerWidth : 900,
    );
    useEffect(() => {
        const h = () => setW(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);
    return w;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ target, prefix = "", suffix = "" }) {
    const [v, setV] = useState(0);
    useEffect(() => {
        let n = 0;
        const step = target / 36;
        const t = setInterval(() => {
            n += step;
            if (n >= target) {
                setV(target);
                clearInterval(t);
            } else setV(Math.floor(n));
        }, 25);
        return () => clearInterval(t);
    }, [target]);
    return (
        <>
            {prefix}
            {v.toLocaleString()}
            {suffix}
        </>
    );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data, metric }) {
    const max = Math.max(...data.map((d) => d[metric]));
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "5px",
                height: "72px",
            }}
        >
            {data.map((d, i) => (
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
                            height: `${(d[metric] / max) * 56}px`,
                            background:
                                "linear-gradient(180deg,#fa8128,#c05a0a)",
                            borderRadius: "3px 3px 0 0",
                            boxShadow: "0 0 6px rgba(250,129,40,0.4)",
                            transition: "height 0.7s ease",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "8px",
                            color: "rgba(240,236,230,0.35)",
                            fontFamily: "monospace",
                        }}
                    >
                        {d.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Ring Progress ────────────────────────────────────────────────────────────
function Ring({ pct, size = 52, stroke = 5, color = "#fa8128" }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={stroke}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
            />
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function OrganizerDashboard() {
    const [tab, setTab] = useState("overview");
    const [chartMetric, setChartMetric] = useState("tickets");
    const [discountFilter, setDiscountFilter] = useState("all");
    const [notifs, setNotifs] = useState(NOTIFICATIONS);
    const [mounted, setMounted] = useState(false);
    const tabBarRef = useRef(null);

    const width = useWindowWidth();
    const isTiny = width < 380;
    const isMobile = width < 640;
    const isDesktop = width >= 1024;

    useEffect(() => {
        setTimeout(() => setMounted(true), 60);
    }, []);

    const unread = notifs.filter((n) => !n.read).length;

    const TABS = [
        { id: "overview", label: "Overview", emoji: "📊" },
        {
            id: "my-discounts",
            label: "My Discounts",
            emoji: "🏷️",
            count: MY_DISCOUNTS.length,
        },
        {
            id: "saved",
            label: "Saved",
            emoji: "❤️",
            count: SAVED_DISCOUNTS.length,
        },
        {
            id: "notifications",
            label: "Notifications",
            emoji: "🔔",
            count: unread || null,
        },
        { id: "settings", label: "Settings", emoji: "⚙️" },
    ];

    const filteredDiscounts =
        discountFilter === "all"
            ? MY_DISCOUNTS
            : MY_DISCOUNTS.filter((d) => d.status === discountFilter);

    const markAllRead = () =>
        setNotifs(notifs.map((n) => ({ ...n, read: true })));

    // ── Global CSS ─────────────────────────────────────────────────────────────
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html { -webkit-text-size-adjust:100%; }
    body { background:#080604; }
    ::-webkit-scrollbar { width:3px; height:3px; }
    ::-webkit-scrollbar-thumb { background:rgba(250,129,40,0.2); border-radius:2px; }
    button { cursor:pointer; border:none; background:none; -webkit-tap-highlight-color:transparent; }
    input, textarea { -webkit-appearance:none; }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 16px rgba(250,129,40,0.15)} 50%{box-shadow:0 0 32px rgba(250,129,40,0.35)} }
    @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

    .t-lift { transition:transform .2s ease,box-shadow .2s ease; }
    .t-lift:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(250,129,40,0.18)!important; }
    .t-fade { transition:opacity .18s,background .18s; }
    .t-fade:hover { opacity:.85; }
    .t-bg { transition:background .18s; }
    .t-bg:hover { background:rgba(250,129,40,0.07)!important; }
    input:focus,textarea:focus { outline:none; border-color:rgba(250,129,40,0.5)!important;
      box-shadow:0 0 0 3px rgba(250,129,40,0.1); }
    .tab-scroll { overflow-x:auto; scrollbar-width:none; }
    .tab-scroll::-webkit-scrollbar { display:none; }
  `;

    // ── HERO HEADER ────────────────────────────────────────────────────────────
    const Hero = () => (
        <div
            style={{
                background:
                    "linear-gradient(135deg, #1a0e06 0%, #0f0905 50%, #160b04 100%)",
                borderBottom: "1px solid rgba(250,129,40,0.12)",
                padding: isTiny
                    ? "20px 14px 0"
                    : isMobile
                      ? "24px 20px 0"
                      : "28px 40px 0",
                position: "relative",
                overflow: "hidden",
                animation: mounted ? "fadeIn 0.5s ease both" : "none",
            }}
        >
            {/* Ambient glow blobs */}
            <div
                style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-60px",
                    width: "280px",
                    height: "280px",
                    background:
                        "radial-gradient(circle, rgba(250,129,40,0.08) 0%, transparent 65%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "30%",
                    width: "200px",
                    height: "200px",
                    background:
                        "radial-gradient(circle, rgba(220,103,14,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Profile row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: isTiny ? "12px" : "18px",
                    marginBottom: "22px",
                    position: "relative",
                }}
            >
                {/* Avatar */}
                <div
                    style={{
                        width: isTiny ? "52px" : "64px",
                        height: isTiny ? "52px" : "64px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background:
                            "linear-gradient(135deg, rgba(250,129,40,0.22), rgba(220,103,14,0.1))",
                        border: "2px solid rgba(250,129,40,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isTiny ? "22px" : "28px",
                        animation: "glow 3s ease-in-out infinite",
                    }}
                >
                    {ORGANIZER.avatar}
                </div>

                {/* Name + meta */}
                <div style={{ flex: 1, minWidth: 0, paddingTop: "4px" }}>
                    <div
                        style={{
                            fontSize: isTiny ? "9px" : "10px",
                            letterSpacing: "0.12em",
                            color: "rgba(250,129,40,0.6)",
                            fontFamily: "monospace",
                            textTransform: "uppercase",
                            marginBottom: "4px",
                        }}
                    >
                        Organizer Account
                    </div>
                    <h1
                        style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: isTiny
                                ? "17px"
                                : isMobile
                                  ? "20px"
                                  : "24px",
                            fontWeight: 700,
                            color: "#f0ece6",
                            lineHeight: 1.1,
                            marginBottom: "6px",
                        }}
                    >
                        {ORGANIZER.name}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "11px",
                                color: "rgba(240,236,230,0.45)",
                            }}
                        >
                            📍 {ORGANIZER.location}
                        </span>
                        <span
                            style={{
                                fontSize: "11px",
                                color: "rgba(240,236,230,0.3)",
                            }}
                        >
                            ·
                        </span>
                        <span
                            style={{
                                fontSize: "11px",
                                color: "rgba(240,236,230,0.45)",
                            }}
                        >
                            Since {ORGANIZER.joined}
                        </span>
                        <span
                            style={{
                                padding: "2px 10px",
                                borderRadius: "20px",
                                fontSize: "10px",
                                background:
                                    "linear-gradient(135deg, rgba(250,129,40,0.25), rgba(220,103,14,0.15))",
                                border: "1px solid rgba(250,129,40,0.35)",
                                color: "#fa8128",
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: "0.05em",
                            }}
                        >
                            {ORGANIZER.plan.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Notification bell (mobile) */}
                <button
                    style={{
                        position: "relative",
                        padding: "8px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(250,129,40,0.12)",
                        borderRadius: "10px",
                        color: "rgba(240,236,230,0.6)",
                        flexShrink: 0,
                    }}
                    onClick={() => setTab("notifications")}
                >
                    🔔
                    {unread > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                top: "4px",
                                right: "4px",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#fa8128",
                                border: "1.5px solid #080604",
                            }}
                        />
                    )}
                </button>
            </div>

            {/* Quick stat strip */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isTiny
                        ? "repeat(3,1fr)"
                        : "repeat(6,1fr)",
                    gap: isTiny ? "0" : "0",
                    borderTop: "1px solid rgba(250,129,40,0.08)",
                    marginLeft: isTiny ? "-14px" : isMobile ? "-20px" : "-40px",
                    marginRight: isTiny
                        ? "-14px"
                        : isMobile
                          ? "-20px"
                          : "-40px",
                }}
            >
                {[
                    {
                        label: "Sold",
                        value: STATS.packagesSold,
                        prefix: "",
                        suffix: "",
                    },
                    {
                        label: "Revenue",
                        value: STATS.totalRevenue,
                        prefix: "₵",
                        suffix: "",
                    },
                    {
                        label: "Active",
                        value: STATS.activeDiscounts,
                        prefix: "",
                        suffix: "",
                    },
                    {
                        label: "Saved by",
                        value: STATS.savedByUsers,
                        prefix: "",
                        suffix: "",
                    },
                    {
                        label: "Views",
                        value: STATS.totalViews,
                        prefix: "",
                        suffix: "",
                    },
                    {
                        label: "Conversion",
                        value: STATS.conversionRate,
                        prefix: "",
                        suffix: "%",
                    },
                ]
                    .slice(0, isTiny ? 3 : 6)
                    .map((s, i) => (
                        <div
                            key={i}
                            style={{
                                padding: isTiny ? "12px 6px" : "14px 10px",
                                textAlign: "center",
                                borderRight:
                                    i < (isTiny ? 2 : 5)
                                        ? "1px solid rgba(250,129,40,0.07)"
                                        : "none",
                                borderLeft: i === 0 ? "none" : undefined,
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "'Cinzel',serif",
                                    fontSize: isTiny ? "15px" : "18px",
                                    fontWeight: 700,
                                    color: "#f0ece6",
                                    lineHeight: 1,
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
                                    fontSize: "9px",
                                    color: "rgba(240,236,230,0.38)",
                                    marginTop: "4px",
                                    fontFamily: "monospace",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                {s.label}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Tab bar */}
            <div
                ref={tabBarRef}
                className="tab-scroll"
                style={{
                    display: "flex",
                    gap: 0,
                    marginLeft: isTiny ? "-14px" : isMobile ? "-20px" : "-40px",
                    marginRight: isTiny
                        ? "-14px"
                        : isMobile
                          ? "-20px"
                          : "-40px",
                    marginTop: "1px",
                }}
            >
                {TABS.map((t) => {
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            style={{
                                flexShrink: 0,
                                padding: isTiny ? "11px 12px" : "13px 18px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontFamily: "'Inter',sans-serif",
                                fontSize: isTiny ? "11px" : "12px",
                                fontWeight: active ? 600 : 400,
                                color: active
                                    ? "#fa8128"
                                    : "rgba(240,236,230,0.45)",
                                borderBottom: active
                                    ? "2px solid #fa8128"
                                    : "2px solid transparent",
                                background: "transparent",
                                transition: "color .18s, border-color .18s",
                                whiteSpace: "nowrap",
                                position: "relative",
                            }}
                        >
                            <span
                                style={{ fontSize: isTiny ? "13px" : "14px" }}
                            >
                                {t.emoji}
                            </span>
                            {(!isTiny ||
                                ["overview", "my-discounts"].includes(t.id)) &&
                                t.label}
                            {t.count && (
                                <span
                                    style={{
                                        background: active
                                            ? "#fa8128"
                                            : "rgba(250,129,40,0.2)",
                                        color: active ? "#fff" : "#fa8128",
                                        fontSize: "9px",
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        padding: "1px 5px",
                                        borderRadius: "9px",
                                        lineHeight: "14px",
                                    }}
                                >
                                    {t.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    // ── OVERVIEW TAB ───────────────────────────────────────────────────────────
    const OverviewTab = () => (
        <div style={{ animation: "fadeUp 0.4s ease both" }}>
            {/* Chart + Status row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isDesktop ? "1fr 260px" : "1fr",
                    gap: "14px",
                    marginBottom: "14px",
                }}
            >
                {/* Bar chart */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(250,129,40,0.1)",
                        borderRadius: "12px",
                        padding: isTiny ? "14px 12px" : "18px 20px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "14px",
                            gap: "8px",
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Cinzel',serif",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#f0ece6",
                            }}
                        >
                            Analytics
                        </span>
                        <div style={{ display: "flex", gap: "4px" }}>
                            {["tickets", "revenue"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setChartMetric(m)}
                                    style={{
                                        padding: "3px 10px",
                                        borderRadius: "6px",
                                        fontSize: "10px",
                                        fontFamily: "monospace",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        background:
                                            chartMetric === m
                                                ? "rgba(250,129,40,0.15)"
                                                : "transparent",
                                        color:
                                            chartMetric === m
                                                ? "#fa8128"
                                                : "rgba(240,236,230,0.38)",
                                        border:
                                            chartMetric === m
                                                ? "1px solid rgba(250,129,40,0.3)"
                                                : "1px solid transparent",
                                        transition: "all .18s",
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                    <BarChart data={CHART_DATA} metric={chartMetric} />
                </div>

                {/* Status */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(250,129,40,0.1)",
                        borderRadius: "12px",
                        padding: isTiny ? "14px 12px" : "18px 20px",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#f0ece6",
                            marginBottom: "16px",
                        }}
                    >
                        Discount Status
                    </div>
                    {[
                        {
                            label: "Active",
                            n: STATS.activeDiscounts,
                            color: "#22c55e",
                            total: MY_DISCOUNTS.length,
                        },
                        {
                            label: "Pending",
                            n: 1,
                            color: "#f59e0b",
                            total: MY_DISCOUNTS.length,
                        },
                        {
                            label: "Rejected",
                            n: 1,
                            color: "#ef4444",
                            total: MY_DISCOUNTS.length,
                        },
                    ].map((s, i) => (
                        <div key={i} style={{ marginBottom: "14px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "6px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "rgba(240,236,230,0.55)",
                                        fontFamily: "'Inter',sans-serif",
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
                                    {s.n}
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
                                        width: `${(s.n / s.total) * 100}%`,
                                        background: s.color,
                                        borderRadius: "2px",
                                        boxShadow: `0 0 6px ${s.color}55`,
                                        transition: "width 1s ease",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <div
                        style={{
                            marginTop: "16px",
                            paddingTop: "14px",
                            borderTop: "1px solid rgba(250,129,40,0.07)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "9px",
                                letterSpacing: "0.1em",
                                color: "rgba(240,236,230,0.28)",
                                textTransform: "uppercase",
                                marginBottom: "5px",
                            }}
                        >
                            Upcoming
                        </div>
                        <div
                            style={{
                                fontSize: "24px",
                                fontFamily: "'Cinzel',serif",
                                fontWeight: 700,
                                color: "#fa8128",
                            }}
                        >
                            3
                        </div>
                        <div
                            style={{
                                fontSize: "11px",
                                color: "rgba(240,236,230,0.36)",
                                marginTop: "2px",
                            }}
                        >
                            events this week
                        </div>
                    </div>
                </div>
            </div>

            {/* Category performance */}
            <div
                style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(250,129,40,0.1)",
                    borderRadius: "12px",
                    padding: isTiny ? "14px 12px" : "18px 20px",
                    marginBottom: "14px",
                }}
            >
                <div
                    style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#f0ece6",
                        marginBottom: "16px",
                    }}
                >
                    Category Performance
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isTiny
                            ? "repeat(2,1fr)"
                            : "repeat(5,1fr)",
                        gap: "10px",
                    }}
                >
                    {Object.entries(CAT_EMOJI).map(([cat, emoji]) => {
                        const pct = Math.round(Math.random() * 60 + 30);
                        const c = CAT_COLOR[cat];
                        return (
                            <div
                                key={cat}
                                style={{
                                    background: "rgba(255,255,255,0.025)",
                                    border: `1px solid ${c}22`,
                                    borderRadius: "10px",
                                    padding: "12px 10px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "22px",
                                        marginBottom: "6px",
                                    }}
                                >
                                    {emoji}
                                </div>
                                <Ring
                                    pct={pct}
                                    size={44}
                                    stroke={4}
                                    color={c}
                                />
                                <div
                                    style={{
                                        fontSize: "12px",
                                        fontFamily: "'Cinzel',serif",
                                        fontWeight: 700,
                                        color: c,
                                        margin: "5px 0 2px",
                                    }}
                                >
                                    {pct}%
                                </div>
                                <div
                                    style={{
                                        fontSize: "9px",
                                        color: "rgba(240,236,230,0.38)",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {cat}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent discounts preview */}
            <div
                style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(250,129,40,0.1)",
                    borderRadius: "12px",
                    padding: isTiny ? "14px 12px" : "18px 20px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#f0ece6",
                        }}
                    >
                        Recent Discounts
                    </span>
                    <button
                        onClick={() => setTab("my-discounts")}
                        style={{
                            fontSize: "11px",
                            color: "#fa8128",
                            fontFamily: "'Inter',sans-serif",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                        }}
                    >
                        View all →
                    </button>
                </div>
                {MY_DISCOUNTS.slice(0, 3).map((d, i) => {
                    const sc = STATUS_CFG[d.status];
                    const pct =
                        d.capacity > 0
                            ? Math.round((d.sold / d.capacity) * 100)
                            : 0;
                    return (
                        <div
                            key={d.id}
                            className="t-bg"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: isTiny ? "8px" : "12px",
                                padding: isTiny ? "8px 6px" : "10px 8px",
                                borderRadius: "8px",
                                marginBottom: "2px",
                                animation: `fadeUp 0.4s ${0.1 + i * 0.07}s ease both`,
                            }}
                        >
                            <span style={{ fontSize: "18px", flexShrink: 0 }}>
                                {CAT_EMOJI[d.category]}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontSize: isTiny ? "12px" : "13px",
                                        fontWeight: 600,
                                        color: "#f0ece6",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
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
                                            background:
                                                "rgba(255,255,255,0.07)",
                                            borderRadius: "2px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${pct}%`,
                                                background:
                                                    "linear-gradient(90deg,#fa8128,#dc670e)",
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
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    fontSize: "9px",
                                    background: sc.bg,
                                    color: sc.color,
                                    fontFamily: "monospace",
                                    flexShrink: 0,
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

    // ── MY DISCOUNTS TAB ───────────────────────────────────────────────────────
    const MyDiscountsTab = () => (
        <div style={{ animation: "fadeUp 0.4s ease both" }}>
            {/* Filter + Add */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                }}
            >
                {/* Status filter pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["all", "active", "pending", "rejected"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setDiscountFilter(f)}
                            style={{
                                padding: "5px 12px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontFamily: "monospace",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                background:
                                    discountFilter === f
                                        ? "rgba(250,129,40,0.18)"
                                        : "rgba(255,255,255,0.04)",
                                color:
                                    discountFilter === f
                                        ? "#fa8128"
                                        : "rgba(240,236,230,0.45)",
                                border:
                                    discountFilter === f
                                        ? "1px solid rgba(250,129,40,0.35)"
                                        : "1px solid rgba(255,255,255,0.07)",
                                transition: "all .18s",
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                {/* New button */}
                <button
                    style={{
                        padding: "7px 14px",
                        background: "linear-gradient(135deg,#fa8128,#c05a0a)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                        fontFamily: "'Inter',sans-serif",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 4px 16px rgba(250,129,40,0.35)",
                    }}
                >
                    + New Discount
                </button>
            </div>

            {/* Cards grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isTiny
                        ? "1fr"
                        : isMobile
                          ? "1fr"
                          : isDesktop
                            ? "repeat(3,1fr)"
                            : "repeat(2,1fr)",
                    gap: "12px",
                }}
            >
                {filteredDiscounts.map((d, i) => {
                    const sc = STATUS_CFG[d.status];
                    const pct =
                        d.capacity > 0
                            ? Math.round((d.sold / d.capacity) * 100)
                            : 0;
                    const c = CAT_COLOR[d.category];
                    return (
                        <div
                            key={d.id}
                            className="t-lift"
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(250,129,40,0.1)",
                                borderRadius: "12px",
                                overflow: "hidden",
                                animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
                                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                            }}
                        >
                            {/* Top colour strip */}
                            <div
                                style={{
                                    height: "3px",
                                    background: `linear-gradient(90deg,${c},${c}55)`,
                                }}
                            />
                            <div
                                style={{
                                    padding: isTiny ? "12px" : "14px 16px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        marginBottom: "10px",
                                        gap: "8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "9px",
                                            minWidth: 0,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "20px",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {CAT_EMOJI[d.category]}
                                        </span>
                                        <div style={{ minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: isTiny
                                                        ? "12px"
                                                        : "13px",
                                                    fontWeight: 600,
                                                    color: "#f0ece6",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
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
                                                {d.category} · {d.date}
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            padding: "3px 9px",
                                            borderRadius: "12px",
                                            fontSize: "10px",
                                            background: sc.bg,
                                            color: sc.color,
                                            fontFamily: "monospace",
                                            flexShrink: 0,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {sc.label}
                                    </span>
                                </div>

                                {/* Progress */}
                                <div style={{ marginBottom: "10px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "5px",
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
                                                color: c,
                                                fontFamily: "monospace",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {pct}%
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            height: "4px",
                                            background:
                                                "rgba(255,255,255,0.07)",
                                            borderRadius: "2px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${pct}%`,
                                                background: `linear-gradient(90deg,${c},${c}99)`,
                                                borderRadius: "2px",
                                                boxShadow: `0 0 6px ${c}44`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Price + actions */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "'Cinzel',serif",
                                            fontSize: "14px",
                                            fontWeight: 700,
                                            color: "#fa8128",
                                        }}
                                    >
                                        {d.price}
                                    </span>
                                    <div
                                        style={{ display: "flex", gap: "6px" }}
                                    >
                                        <button
                                            style={{
                                                padding: "5px 12px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                background:
                                                    "rgba(250,129,40,0.1)",
                                                border: "1px solid rgba(250,129,40,0.2)",
                                                color: "#fa8128",
                                                fontFamily:
                                                    "'Inter',sans-serif",
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                background:
                                                    "rgba(255,255,255,0.04)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                color: "rgba(240,236,230,0.5)",
                                                fontFamily:
                                                    "'Inter',sans-serif",
                                            }}
                                        >
                                            ···
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredDiscounts.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "48px 20px",
                        color: "rgba(240,236,230,0.3)",
                        fontFamily: "'Inter',sans-serif",
                    }}
                >
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>
                        🏷️
                    </div>
                    <div style={{ fontSize: "14px" }}>
                        No {discountFilter} discounts found
                    </div>
                </div>
            )}
        </div>
    );

    // ── SAVED DISCOUNTS TAB ────────────────────────────────────────────────────
    const SavedTab = () => (
        <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                }}
            >
                <div>
                    <div
                        style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#f0ece6",
                        }}
                    >
                        Saved Discounts
                    </div>
                    <div
                        style={{
                            fontSize: "11px",
                            color: "rgba(240,236,230,0.38)",
                            marginTop: "3px",
                            fontFamily: "'Inter',sans-serif",
                        }}
                    >
                        {SAVED_DISCOUNTS.length} items bookmarked
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isTiny
                        ? "1fr"
                        : isMobile
                          ? "1fr"
                          : isDesktop
                            ? "repeat(2,1fr)"
                            : "1fr",
                    gap: "10px",
                }}
            >
                {SAVED_DISCOUNTS.map((d, i) => {
                    const c = CAT_COLOR[d.category];
                    return (
                        <div
                            key={d.id}
                            className="t-lift"
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(250,129,40,0.09)",
                                borderRadius: "12px",
                                overflow: "hidden",
                                display: "flex",
                                animation: `fadeUp 0.4s ${i * 0.06}s ease both`,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                            }}
                        >
                            {/* Left accent */}
                            <div
                                style={{
                                    width: "3px",
                                    background: `linear-gradient(180deg,${c},${c}44)`,
                                    flexShrink: 0,
                                }}
                            />
                            <div
                                style={{
                                    flex: 1,
                                    padding: isTiny ? "12px 10px" : "14px 16px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "8px",
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "7px",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            <span style={{ fontSize: "16px" }}>
                                                {CAT_EMOJI[d.category]}
                                            </span>
                                            <div
                                                style={{
                                                    fontSize: isTiny
                                                        ? "12px"
                                                        : "13px",
                                                    fontWeight: 600,
                                                    color: "#f0ece6",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {d.title}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color: "rgba(240,236,230,0.38)",
                                                fontFamily:
                                                    "'Inter',sans-serif",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            By {d.org} · {d.date}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "'Cinzel',serif",
                                                    fontSize: "15px",
                                                    fontWeight: 700,
                                                    color: "#fa8128",
                                                }}
                                            >
                                                {d.price}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "10px",
                                                    color: "rgba(240,236,230,0.4)",
                                                }}
                                            >
                                                ⭐ {d.rating}
                                            </span>
                                            <span
                                                style={{
                                                    padding: "2px 8px",
                                                    borderRadius: "10px",
                                                    fontSize: "9px",
                                                    background: `${c}15`,
                                                    color: c,
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                {d.category}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Remove heart */}
                                    <button
                                        style={{
                                            color: "#fa8128",
                                            fontSize: "18px",
                                            flexShrink: 0,
                                            paddingTop: "2px",
                                            transition: "transform .2s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.transform =
                                                "scale(1.2)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.transform =
                                                "scale(1)")
                                        }
                                    >
                                        ❤️
                                    </button>
                                </div>
                                <button
                                    style={{
                                        marginTop: "10px",
                                        width: "100%",
                                        padding: "7px",
                                        background: "rgba(250,129,40,0.07)",
                                        border: "1px solid rgba(250,129,40,0.15)",
                                        borderRadius: "7px",
                                        color: "#fa8128",
                                        fontSize: "11px",
                                        fontFamily: "'Inter',sans-serif",
                                        transition: "background .18s",
                                    }}
                                >
                                    View Discount →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {SAVED_DISCOUNTS.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "48px 20px",
                        color: "rgba(240,236,230,0.3)",
                        fontFamily: "'Inter',sans-serif",
                    }}
                >
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>
                        ❤️
                    </div>
                    <div>
                        No saved discounts yet. Browse and save ones you like!
                    </div>
                </div>
            )}
        </div>
    );

    // ── NOTIFICATIONS TAB ──────────────────────────────────────────────────────
    const NotificationsTab = () => (
        <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                }}
            >
                <div>
                    <div
                        style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#f0ece6",
                        }}
                    >
                        Notifications
                    </div>
                    {unread > 0 && (
                        <div
                            style={{
                                fontSize: "11px",
                                color: "rgba(240,236,230,0.4)",
                                marginTop: "2px",
                                fontFamily: "'Inter',sans-serif",
                            }}
                        >
                            {unread} unread
                        </div>
                    )}
                </div>
                {unread > 0 && (
                    <button
                        onClick={markAllRead}
                        style={{
                            fontSize: "11px",
                            color: "#fa8128",
                            fontFamily: "'Inter',sans-serif",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            background: "rgba(250,129,40,0.08)",
                            border: "1px solid rgba(250,129,40,0.2)",
                        }}
                    >
                        Mark all read
                    </button>
                )}
            </div>

            <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
                {notifs.map((n, i) => {
                    const nc = NOTIF_CFG[n.type];
                    return (
                        <div
                            key={n.id}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: isTiny ? "10px" : "13px",
                                padding: isTiny ? "12px 10px" : "13px 16px",
                                background: n.read
                                    ? "rgba(255,255,255,0.018)"
                                    : "rgba(250,129,40,0.04)",
                                border: n.read
                                    ? "1px solid rgba(255,255,255,0.05)"
                                    : "1px solid rgba(250,129,40,0.12)",
                                borderRadius: "10px",
                                animation: `fadeUp 0.4s ${i * 0.06}s ease both`,
                                position: "relative",
                            }}
                        >
                            {/* Unread dot */}
                            {!n.read && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "14px",
                                        right: "12px",
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        background: "#fa8128",
                                    }}
                                />
                            )}
                            <div
                                style={{
                                    width: isTiny ? "30px" : "34px",
                                    height: isTiny ? "30px" : "34px",
                                    borderRadius: "8px",
                                    flexShrink: 0,
                                    background: nc.bg,
                                    border: `1px solid ${nc.color}28`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "15px",
                                }}
                            >
                                {nc.icon}
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    paddingRight: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: isTiny ? "12px" : "13px",
                                        color: n.read
                                            ? "rgba(240,236,230,0.6)"
                                            : "#f0ece6",
                                        lineHeight: 1.45,
                                        marginBottom: "4px",
                                        fontFamily: "'Inter',sans-serif",
                                    }}
                                >
                                    {n.msg}
                                </div>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        color: "rgba(240,236,230,0.3)",
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
        </div>
    );

    // ── SETTINGS TAB ───────────────────────────────────────────────────────────
    const SettingsTab = () => {
        const inputStyle = {
            width: "100%",
            padding: isTiny ? "9px 10px" : "10px 13px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(250,129,40,0.14)",
            borderRadius: "8px",
            color: "#f0ece6",
            fontSize: "13px",
            fontFamily: "'Inter',sans-serif",
        };
        const labelStyle = {
            display: "block",
            fontSize: "10px",
            color: "rgba(240,236,230,0.4)",
            marginBottom: "5px",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            fontFamily: "monospace",
        };
        const sectionHead = (title, sub) => (
            <div style={{ marginBottom: "18px" }}>
                <div
                    style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#fa8128",
                        letterSpacing: "0.06em",
                    }}
                >
                    {title}
                </div>
                {sub && (
                    <div
                        style={{
                            fontSize: "11px",
                            color: "rgba(240,236,230,0.35)",
                            marginTop: "3px",
                            fontFamily: "'Inter',sans-serif",
                        }}
                    >
                        {sub}
                    </div>
                )}
            </div>
        );

        return (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                        gap: "14px",
                    }}
                >
                    {/* Profile card */}
                    <div
                        style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(250,129,40,0.1)",
                            borderRadius: "12px",
                            padding: isTiny ? "16px 14px" : "20px 22px",
                        }}
                    >
                        {sectionHead(
                            "Profile",
                            "Your public organizer information",
                        )}

                        {/* Avatar upload */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                marginBottom: "20px",
                            }}
                        >
                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                    background: "rgba(250,129,40,0.1)",
                                    border: "2px solid rgba(250,129,40,0.3)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "22px",
                                }}
                            >
                                🎭
                            </div>
                            <div>
                                <button
                                    style={{
                                        padding: "6px 14px",
                                        borderRadius: "7px",
                                        fontSize: "11px",
                                        background: "rgba(250,129,40,0.1)",
                                        border: "1px solid rgba(250,129,40,0.25)",
                                        color: "#fa8128",
                                        fontFamily: "'Inter',sans-serif",
                                        marginBottom: "4px",
                                        display: "block",
                                    }}
                                >
                                    Upload Photo
                                </button>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        color: "rgba(240,236,230,0.3)",
                                        fontFamily: "'Inter',sans-serif",
                                    }}
                                >
                                    JPG, PNG up to 2MB
                                </div>
                            </div>
                        </div>

                        {[
                            {
                                label: "Organizer Name",
                                placeholder: "Your business name",
                            },
                            {
                                label: "Contact Email",
                                placeholder: "contact@business.com",
                            },
                            {
                                label: "Phone Number",
                                placeholder: "+233 XX XXX XXXX",
                            },
                            { label: "Location", placeholder: "City, Country" },
                        ].map((f, i) => (
                            <div key={i} style={{ marginBottom: "14px" }}>
                                <label style={labelStyle}>{f.label}</label>
                                <input
                                    style={inputStyle}
                                    placeholder={f.placeholder}
                                    defaultValue={
                                        i === 0
                                            ? ORGANIZER.name
                                            : i === 3
                                              ? ORGANIZER.location
                                              : ""
                                    }
                                />
                            </div>
                        ))}

                        <div style={{ marginBottom: "14px" }}>
                            <label style={labelStyle}>Bio</label>
                            <textarea
                                style={{
                                    ...inputStyle,
                                    height: "80px",
                                    resize: "vertical",
                                    lineHeight: "1.5",
                                }}
                                placeholder="Describe your organization..."
                            />
                        </div>

                        <button
                            style={{
                                width: "100%",
                                padding: "11px",
                                background:
                                    "linear-gradient(135deg,#fa8128,#c05a0a)",
                                border: "none",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "13px",
                                fontFamily: "'Inter',sans-serif",
                                fontWeight: 600,
                                boxShadow: "0 4px 16px rgba(250,129,40,0.3)",
                            }}
                        >
                            Save Profile
                        </button>
                    </div>

                    {/* Account + Preferences */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                        }}
                    >
                        {/* Account */}
                        <div
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(250,129,40,0.1)",
                                borderRadius: "12px",
                                padding: isTiny ? "16px 14px" : "20px 22px",
                            }}
                        >
                            {sectionHead("Account", "Manage your credentials")}
                            {[
                                { label: "Username", placeholder: "@username" },
                                {
                                    label: "Current Password",
                                    placeholder: "••••••••",
                                    type: "password",
                                },
                                {
                                    label: "New Password",
                                    placeholder: "••••••••",
                                    type: "password",
                                },
                            ].map((f, i) => (
                                <div key={i} style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>{f.label}</label>
                                    <input
                                        style={inputStyle}
                                        type={f.type || "text"}
                                        placeholder={f.placeholder}
                                    />
                                </div>
                            ))}
                            <button
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    background: "rgba(250,129,40,0.08)",
                                    border: "1px solid rgba(250,129,40,0.22)",
                                    borderRadius: "8px",
                                    color: "#fa8128",
                                    fontSize: "13px",
                                    fontFamily: "'Inter',sans-serif",
                                    fontWeight: 600,
                                }}
                            >
                                Update Password
                            </button>
                        </div>

                        {/* Preferences */}
                        <div
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(250,129,40,0.1)",
                                borderRadius: "12px",
                                padding: isTiny ? "16px 14px" : "20px 22px",
                            }}
                        >
                            {sectionHead(
                                "Notifications",
                                "Choose what you hear about",
                            )}
                            {[
                                { label: "New ticket sales", on: true },
                                { label: "Discount reviews", on: true },
                                { label: "Low stock alerts", on: true },
                                { label: "Marketing emails", on: false },
                            ].map((p, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "9px 0",
                                        borderBottom:
                                            i < 3
                                                ? "1px solid rgba(255,255,255,0.04)"
                                                : "none",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "rgba(240,236,230,0.6)",
                                            fontFamily: "'Inter',sans-serif",
                                        }}
                                    >
                                        {p.label}
                                    </span>
                                    {/* Toggle pill */}
                                    <div
                                        style={{
                                            width: "36px",
                                            height: "20px",
                                            borderRadius: "10px",
                                            background: p.on
                                                ? "rgba(250,129,40,0.5)"
                                                : "rgba(255,255,255,0.1)",
                                            border: p.on
                                                ? "1px solid rgba(250,129,40,0.5)"
                                                : "1px solid rgba(255,255,255,0.12)",
                                            position: "relative",
                                            cursor: "pointer",
                                            transition: "background .2s",
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "2px",
                                                left: p.on ? "18px" : "2px",
                                                width: "14px",
                                                height: "14px",
                                                borderRadius: "50%",
                                                background: p.on
                                                    ? "#fa8128"
                                                    : "rgba(255,255,255,0.3)",
                                                transition: "left .2s",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Danger zone */}
                        <div
                            style={{
                                background: "rgba(239,68,68,0.04)",
                                border: "1px solid rgba(239,68,68,0.12)",
                                borderRadius: "12px",
                                padding: isTiny ? "14px 12px" : "16px 20px",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "'Cinzel',serif",
                                    fontSize: "12px",
                                    color: "#ef4444",
                                    letterSpacing: "0.06em",
                                    marginBottom: "10px",
                                }}
                            >
                                DANGER ZONE
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "rgba(240,236,230,0.4)",
                                    fontFamily: "'Inter',sans-serif",
                                    marginBottom: "12px",
                                }}
                            >
                                Permanently delete your organizer account and
                                all associated data.
                            </div>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "7px",
                                    fontSize: "12px",
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    color: "#ef4444",
                                    fontFamily: "'Inter',sans-serif",
                                }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTab = () => {
        if (tab === "overview") return <OverviewTab />;
        if (tab === "my-discounts") return <MyDiscountsTab />;
        if (tab === "saved") return <SavedTab />;
        if (tab === "notifications") return <NotificationsTab />;
        if (tab === "settings") return <SettingsTab />;
    };

    // ── ROOT ───────────────────────────────────────────────────────────────────
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#080604",
                fontFamily: "'Inter',sans-serif",
                color: "#f0ece6",
            }}
        >
            <style>{css}</style>

            {/* Hero + tabs */}
            <Hero />

            {/* Content */}
            <div
                style={{
                    maxWidth: isDesktop ? "1100px" : "100%",
                    margin: "0 auto",
                    padding: isTiny
                        ? "16px 12px 40px"
                        : isMobile
                          ? "18px 16px 40px"
                          : "24px 32px 40px",
                }}
            >
                {renderTab()}
            </div>
        </div>
    );
}
