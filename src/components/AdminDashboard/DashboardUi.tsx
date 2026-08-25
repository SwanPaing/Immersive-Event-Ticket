import React, { useEffect, useRef, useState } from "react";
import WobbleButton from "../UI/WobbleButton";
import gsap from "gsap";
import { useSearchParams } from "react-router";
import { createRipple } from "../../libs/createRipple";
import CreateEventUi from "./CreateEventUi";

/* ─────────────────────────────────────────────
   Dashboard root
───────────────────────────────────────────── */
const DashboardUi = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read view from URL: ?view=create or ?tab=create. Default to overview.
  const viewParam = searchParams.get("view") || searchParams.get("tab");
  const activeView = viewParam === "create" ? "create" : "overview";

  /* Stagger-in all cards / sections on mount */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".db-animate", {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeView]);

  /* Fade out when menu is opened (matches other pages) */
  useEffect(() => {
    const handleMenuClose = () => {
      gsap.to(".dashboard-panel", {
        opacity: 0,
        duration: 0.6,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
    };
    window.addEventListener("menu-click", handleMenuClose);
    return () => window.removeEventListener("menu-click", handleMenuClose);
  }, []);

  const triggerRippleAt = (
    e?: React.MouseEvent,
    colorA = "#9898ef",
    colorB = "#6dd2b0"
  ) => {
    let x = 0;
    let y = 0;
    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x = (centerX / window.innerWidth) * 2 - 1;
      y = -(centerY / window.innerHeight) * 2 + 1;
    }
    createRipple({
      coord: { x, y },
      isPageTransition: false,
      colorA,
      colorB,
      rippleDirection: "out",
      timeScale: 0.6,
    });
  };

  const handleOpenCreate = (e?: React.MouseEvent) => {
    triggerRippleAt(e, "#03ddcf", "#2000cf");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("view", "create");
        return next;
      },
      { replace: true }
    );
  };

  const handleBackToOverview = (e?: React.MouseEvent) => {
    triggerRippleAt(e, "#06ecff", "#9898ff");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("view");
        next.delete("tab");
        return next;
      },
      { replace: true }
    );
  };

  return (
    <div className="dashboard-overlay text-black" ref={containerRef}>
      <div className="dashboard-panel">
        <div key={activeView} className="tab-panel">
          {activeView === "overview" ? (
            <DashboardOverview onOpenCreate={handleOpenCreate} />
          ) : (
            <CreateEventUi onBack={handleBackToOverview} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Dashboard Overview Content
───────────────────────────────────────────── */
interface DashboardOverviewProps {
  onOpenCreate: (e?: React.MouseEvent) => void;
}

const DashboardOverview = ({ onOpenCreate }: DashboardOverviewProps) => {
  return (
    <>
      {/* ── Header ── */}
      <header className="db-header db-animate">
        <div>
          <p className="db-greeting">Good morning, Organizer 👋</p>
        </div>
        <div>
          <WobbleButton
            text="+ Create Event"
            hoverText="Let's Go!"
            fillColor="#2000cf"
            textColor="white"
            width={200}
            height={60}
            fontSize={1.15}
            bulgeAmount={3}
            stiffness={0.04}
            damping={0.96}
            fontFamily="Dingos-Bold"
            proximityThreshold={70}
            onClick={onOpenCreate}
          />
        </div>
      </header>

      {/* ── KPI Cards ── */}
      <div className="db-kpi-grid">
        <KpiCard
          id="kpi-events"
          icon="📅"
          label="Total Events"
          value="32"
          trend=""
          trendUp={null}
          accent="#f7a76c"
        />
        <KpiCard
          id="kpi-tickets"
          icon="🎟"
          label="Tickets Sold"
          value="1,284"
          trend="+12%"
          trendUp
          accent="#7c6ef7"
        />
        <KpiCard
          id="kpi-revenue"
          icon="💰"
          label="Total Revenue"
          value="$38,520"
          trend="+8.4%"
          trendUp
          accent="#6dd2b0"
        />
        <KpiCard
          id="kpi-rating"
          icon="⭐"
          label="Avg. Rating"
          value="4.7"
          trend="+0.2 this month"
          trendUp
          accent="#ef87d4"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="db-charts-row">
        <RevenueChart />
        <AttendeeDonut />
      </div>

      {/* ── Recent Events ── */}
      <EventsTable />

      {/* bottom padding */}
      <div style={{ height: 60 }} />
    </>
  );
};

/* ─────────────────────────────────────────────
   KPI Card
───────────────────────────────────────────── */
interface KpiCardProps {
  id: string;
  icon: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
  accent: string;
}

const KpiCard = ({ id, icon, label, value, trend, trendUp, accent }: KpiCardProps) => (
  <div className="db-kpi-card" id={id}>
    <div className="db-kpi-icon-wrap" style={{ background: `${accent}22`, color: accent }}>
      <span className="db-kpi-icon">{icon}</span>
    </div>
    <div className="db-kpi-body">
      <p className="db-kpi-label">{label}</p>
      <p className="db-kpi-value">{value}</p>
      {trendUp !== null ? (
        <p className={`db-kpi-trend ${trendUp ? "db-trend-up" : "db-trend-down"}`}>
          {trendUp ? "▲" : "▼"} {trend}
        </p>
      ) : (
        <p className="db-kpi-trend db-trend-neutral">{trend}</p>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Revenue Bar Chart (pure SVG)
───────────────────────────────────────────── */
const RevenueChart = () => {
  const bars = [
    { month: "Mar", h: 52, val: "$22k" },
    { month: "Apr", h: 68, val: "$28k" },
    { month: "May", h: 44, val: "$18k" },
    { month: "Jun", h: 80, val: "$33k" },
    { month: "Jul", h: 61, val: "$25k" },
    { month: "Aug", h: 95, val: "$38k" },
  ];

  const W = 400;
  const H = 140;
  const barW = 36;
  const gap = 22;
  const total = bars.length * barW + (bars.length - 1) * gap;
  const startX = (W - total) / 2;

  return (
    <div className="db-chart-card" id="db-revenue-chart">
      <div className="db-chart-header">
        <div>
          <p className="db-chart-label">Monthly Revenue</p>
          <p className="db-chart-sub">Last 6 months</p>
        </div>
        <span className="db-chart-badge">$38.5k this month</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H + 28}`}
        width="100%"
        height="auto"
        className="db-revenue-svg"
        aria-label="Monthly revenue bar chart"
      >
        {bars.map((b, i) => {
          const x = startX + i * (barW + gap);
          const barH = (b.h / 100) * H;
          const y = H - barH;
          return (
            <g key={b.month}>
              {/* track */}
              <rect
                x={x}
                y={0}
                width={barW}
                height={H}
                rx={10}
                fill="rgba(255,255,255,0.04)"
              />
              {/* filled bar */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={10}
                fill="url(#barGrad)"
                className="db-bar"
                style={{
                  transformOrigin: `${x + barW / 2}px ${H}px`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
              {/* month label */}
              <text
                x={x + barW / 2}
                y={H + 18}
                textAnchor="middle"
                fontSize="11"
                fill="rgba(33,28,59,0.45)"
                fontFamily="Inter, sans-serif"
              >
                {b.month}
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9898ef" />
            <stop offset="100%" stopColor="#6f74d6" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Attendee Donut (pure SVG)
───────────────────────────────────────────── */
const AttendeeDonut = () => {
  const cx = 80;
  const cy = 80;
  const r = 55;
  const stroke = 22;
  const circum = 2 * Math.PI * r;

  // VIP 30%, General 55%, Student 15%
  const segments = [
    { label: "VIP", pct: 0.3, color: "#9898ef", offset: 0 },
    { label: "General", pct: 0.55, color: "#6dd2b0", offset: 0.3 },
    { label: "Student", pct: 0.15, color: "#f7a76c", offset: 0.85 },
  ];

  return (
    <div className="db-chart-card db-donut-card " id="db-attendee-donut">
      <p className="db-chart-label">Ticket Types</p>
      <p className="db-chart-sub">Attendee breakdown</p>

      <div className="db-donut-body">
        <svg
          viewBox="0 0 160 160"
          width="160"
          height="160"
          className="db-donut-svg"
          aria-label="Attendee breakdown donut chart"
        >
          {/* background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(33,28,59,0.08)"
            strokeWidth={stroke}
          />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${seg.pct * circum} ${circum}`}
              strokeDashoffset={-(seg.offset * circum - circum * 0.25)}
              strokeLinecap="round"
              className="db-donut-seg"
              style={{ animationDelay: `${0.2 + i * 0.12}s` }}
            />
          ))}
          {/* center text */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill="#211c3b"
            fontFamily="Dingos-Bold, sans-serif"
          >
            1,284
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(33,28,59,0.45)"
            fontFamily="Inter, sans-serif"
          >
            attendees
          </text>
        </svg>

        <div className="db-donut-legend">
          {segments.map((seg) => (
            <div key={seg.label} className="db-legend-item">
              <span
                className="db-legend-dot"
                style={{ background: seg.color }}
              />
              <span className="db-legend-label">{seg.label}</span>
              <span className="db-legend-pct">
                {Math.round(seg.pct * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Events Table
───────────────────────────────────────────── */
const EventsTable = () => (
  <section className="db-events-section db-animate" id="db-events-table">
    <div className="db-section-header">
      <div>
        <p className="db-chart-label">Recent Events</p>
        <p className="db-chart-sub">Your latest & upcoming events</p>
      </div>
      <button className="db-view-all-btn" id="db-view-all-btn">View All</button>
    </div>

    <div className="db-events-list">
      <EventRow
        id="event-row-1"
        title="React Three Fiber Summit"
        date="10 Aug 2026"
        location="Tokyo, Japan"
        sold={74}
        cap={100}
        status="live"
      />
      <EventRow
        id="event-row-2"
        title="WebGPU Deep Dive"
        date="02 Sep 2026"
        location="Berlin, Germany"
        sold={38}
        cap={80}
        status="upcoming"
      />
      <EventRow
        id="event-row-3"
        title="Immersive UX Workshop"
        date="18 Sep 2026"
        location="Seoul, South Korea"
        sold={12}
        cap={60}
        status="upcoming"
      />
      <EventRow
        id="event-row-4"
        title="3D Web Conf 2026"
        date="28 Jul 2026"
        location="New York, USA"
        sold={120}
        cap={120}
        status="ended"
      />
    </div>
  </section>
);

interface EventRowProps {
  id: string;
  title: string;
  date: string;
  location: string;
  sold: number;
  cap: number;
  status: "live" | "upcoming" | "ended";
}

const statusConfig = {
  live:     { label: "Live",     color: "#6dd2b0", bg: "#6dd2b022" },
  upcoming: { label: "Upcoming", color: "#9898ef", bg: "#9898ef22" },
  ended:    { label: "Ended",    color: "#888",    bg: "#88888822" },
};

const EventRow = ({ id, title, date, location, sold, cap, status }: EventRowProps) => {
  const s = statusConfig[status];
  const pct = Math.round((sold / cap) * 100);

  return (
    <div className="db-event-row" id={id}>
      <div className="db-event-main">
        <p className="db-event-title">{title}</p>
        <div className="db-event-meta">
          <span className="db-event-meta-item">📅 {date}</span>
          <span className="db-event-meta-item">📍 {location}</span>
        </div>
      </div>

      <div className="db-event-capacity">
        <div className="db-event-cap-header">
          <span className="db-event-cap-label">Sold</span>
          <span className="db-event-cap-val">{sold}/{cap}</span>
        </div>
        <div className="db-event-cap-track">
          <div
            className="db-event-cap-fill"
            style={{
              width: `${pct}%`,
              background:
                status === "ended"
                  ? "#888"
                  : status === "live"
                  ? "#6dd2b0"
                  : "#9898ef",
            }}
          />
        </div>
      </div>

      <div
        className="db-status-badge"
        style={{ color: s.color, background: s.bg }}
      >
        {status === "live" && <span className="db-live-dot" />}
        {s.label}
      </div>

      <button className="db-detail-btn" id={`${id}-detail-btn`}>
        View →
      </button>
    </div>
  );
};

export default DashboardUi;
