import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Sparkles,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  Copy,
  ChevronRight,
  Info,
} from "lucide-react";
import WobbleButton from "../UI/WobbleButton";
import { createRipple } from "../../libs/createRipple";

interface CreateEventUiProps {
  onBack: (e?: React.MouseEvent) => void;
}

const CATEGORIES = [
  { id: "tech", label: "Tech", icon: "🤖" },
  { id: "sport", label: "Sport", icon: "🏃" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "gaming", label: "Games", icon: "🎮" },
  { id: "talk", label: "Talk Show", icon: "🗪" },
  { id: "other", label: "Others", icon: "⚡" },
];

const THEMES = [
  {
    id: "teal",
    name: "Emerald Teal",
    colorA: "#6dd2b0",
    colorB: "#0091b1",
    cardBg: "#6dd2b0",
    accent: "#0f3d2e",
  },
  {
    id: "lavender",
    name: "Cyber Lavender",
    colorA: "#9898ef",
    colorB: "#6f74d6",
    cardBg: "#9898ef",
    accent: "#211c3b",
  },
  {
    id: "coral",
    name: "Sunset Coral",
    colorA: "#f7a76c",
    colorB: "#eb6c6c",
    cardBg: "#f7a76c",
    accent: "#3d180f",
  },
  {
    id: "cyan",
    name: "Electric Mint",
    colorA: "#06ecff",
    colorB: "#00b2ff",
    cardBg: "#06ecff",
    accent: "#033b40",
  },
  {
    id: "pink",
    name: "Neon Sakura",
    colorA: "#ef87d4",
    colorB: "#c24da3",
    cardBg: "#ef87d4",
    accent: "#3b0f2e",
  },
];

interface TicketTier {
  id: string;
  name: string;
  price: number;
  capacity: number;
  perks: string[];
}

export const CreateEventUi = ({ onBack }: CreateEventUiProps) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("web3");
  const [desc, setDesc] = useState(
    ""
  );
  const [host1, setHost1] = useState("");
  const [host2, setHost2] = useState("");
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [venueType, setVenueType] = useState<"in-person" | "virtual" | "hybrid">("in-person");
  const [location, setLocation] = useState("");

  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([
    "Architecting scalable 3D scenes with WebGPU & instancing",
    "Optimizing shader pipelines for 120fps mobile performance",
    "Live interactive breakout sessions & hardware demos",
  ]);

  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: "tier-1",
      name: "Early Bird General",
      price: 49,
      capacity: 80,
      perks: ["Full Summit Access", "Digital Swag Kit", "Live Stream Recording"],
    },
    {
      id: "tier-2",
      name: "VIP All-Access Pass",
      price: 149,
      capacity: 20,
      perks: ["Priority Front-Row Seating", "Exclusive Afterparty Access", "Speaker Lounge & 1-on-1 Mentorship"],
    },
  ]);

  const [newTierName, setNewTierName] = useState("");
  const [newTierPrice, setNewTierPrice] = useState<number>(79);
  const [newTierCap, setNewTierCap] = useState<number>(50);
  const [maxCapacity, setMaxCapacity] = useState<number>(0);

  const tierSum = ticketTiers.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
  const totalCapacity = maxCapacity > 0 ? maxCapacity : tierSum;
  const capacityOverLimit = maxCapacity > 0 && tierSum > maxCapacity;
  const minPrice = ticketTiers.length > 0 ? Math.min(...ticketTiers.map((t) => t.price)) : 0;

  const triggerRippleAt = (e?: React.MouseEvent) => {
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
      colorA: selectedTheme.colorA,
      colorB: selectedTheme.colorB,
      rippleDirection: "out",
      timeScale: 0.6,
    });
  };

  const handleStepChange = (step: number) => {
    if (step === activeStep) return;
    setActiveStep(step);
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleAddTier = () => {
    if (!newTierName.trim()) return;
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      name: newTierName.trim(),
      price: Number(newTierPrice) || 0,
      capacity: Number(newTierCap) || 10,
      perks: ["Summit Access"],
    };
    setTicketTiers([...ticketTiers, newTier]);
    setNewTierName("");
  };

  const handleRemoveTier = (id: string) => {
    setTicketTiers(ticketTiers.filter((t) => t.id !== id));
  };

  const handlePublish = (e?: React.MouseEvent) => {
    triggerRippleAt(e);
    setIsPublished(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://immersive-tickets.io/events/global-webgl-summit-2026");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="create-event-wrapper">
      {/* ── Top Navigation / Header ── */}
      <div className="ce-top-bar">
        <button
          className="ce-back-btn"
          onClick={(e) => {
            onBack(e);
          }}
        >
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>

        {/* Step Navigation Pills */}
        <div className="ce-steps-nav">
          <button
            className={`ce-step-btn ${activeStep === 1 ? "active" : ""}`}
            onClick={() => handleStepChange(1)}
          >
            <span className="ce-step-num">1</span>
            <span>Event Info</span>
          </button>
          <ChevronRight size={14} className="ce-step-arrow" />
          <button
            className={`ce-step-btn ${activeStep === 2 ? "active" : ""}`}
            onClick={() => handleStepChange(2)}
          >
            <span className="ce-step-num">2</span>
            <span>Tickets & Schedule</span>
          </button>
          <ChevronRight size={14} className="ce-step-arrow" />
          <button
            className={`ce-step-btn ${activeStep === 3 ? "active" : ""}`}
            onClick={() => handleStepChange(3)}
          >
            <span className="ce-step-num">3</span>
            <span>Event Preview</span>
          </button>
        </div>

        <div className="ce-action-wrap">
          <WobbleButton
            text="Publish Event"
            hoverText="Launch 🚀"
            fillColor="#6dd2b0"
            textColor="#0f3d2e"
            width={170}
            height={52}
            fontSize={1.05}
            bulgeAmount={3}
            stiffness={0.04}
            damping={0.96}
            fontFamily="Dingos-Bold"
            proximityThreshold={50}
            onClick={handlePublish}
          />
        </div>
      </div>

      {/* ── Animated Tab Content Panel (identical transition to About / Review) ── */}
      <div key={activeStep} className="tab-panel">
        <div className="ce-content-layout">
          {/* Left / Main Form */}
          <div className="ce-form-column">
            {/* ── STEP 1: EVENT INFO ── */}
            {activeStep === 1 && (
              <section className="ce-card">
                <div className="ce-card-header">
                  <div>
                    <h2 className="ce-card-title">Event Overview & Details</h2>
                    <p className="ce-card-sub">Give your event a memorable title, description, and topics.</p>
                  </div>
                  <span className="ce-step-badge">Step 1 of 3</span>
                </div>

                {/* Event Title */}
                <div className="ce-form-group">
                  <label className="ce-label" htmlFor="ce-title">
                    Event Title <span className="ce-req">*</span>
                  </label>
                  <input
                    id="ce-title"
                    type="text"
                    className="ce-input"
                    placeholder="e.g. NextGen WebGL & 3D Summit 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Category Pills */}
                <div className="ce-form-group">
                  <label className="ce-label">Category</label>
                  <div className="ce-category-grid">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`ce-cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <span className="ce-cat-icon">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="ce-form-group">
                  <label className="ce-label" htmlFor="ce-desc">
                    Description / About <span className="ce-req">*</span>
                  </label>
                  <textarea
                    id="ce-desc"
                    className="ce-textarea"
                    rows={4}
                    placeholder="Describe what attendees will learn, experience, and take away..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                {/* Hosts / Speakers */}
                <div className="ce-form-row">
                  <div className="ce-form-group">
                    <label className="ce-label" htmlFor="ce-host1">Primary Host</label>
                    <input
                      id="ce-host1"
                      type="text"
                      className="ce-input"
                      value={host1}
                      onChange={(e) => setHost1(e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  {/* <div className="ce-form-group">
                    <label className="ce-label" htmlFor="ce-host2">Co-Host / Guest <span className="optional">(Optional)</span></label>
                    <input
                      id="ce-host2"
                      type="text"
                      className="ce-input"
                      value={host2}
                      onChange={(e) => setHost2(e.target.value)}
                      placeholder="e.g. Billie"
                    />
                  </div> */}
                </div>

                {/* Highlights / Key Sessions */}
                <div className="ce-form-group">
                  <label className="ce-label">Key Highlights & Agenda Bullets</label>
                  <div className="ce-highlight-input-wrap">
                    <input
                      type="text"
                      className="ce-input"
                      placeholder="Add an agenda topic or key highlight..."
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="ce-add-btn"
                      onClick={handleAddHighlight}
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>

                  <ul className="ce-highlights-list">
                    {highlights.map((hl, idx) => (
                      <li key={idx} className="ce-highlight-item">
                        <span className="ce-hl-dot" />
                        <span className="ce-hl-text">{hl}</span>
                        <button
                          type="button"
                          className="ce-del-btn"
                          onClick={() => handleRemoveHighlight(idx)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ce-card-footer">
                  <button
                    type="button"
                    className="ce-next-btn"
                    onClick={() => handleStepChange(2)}
                  >
                    <span>Next: Tickets & Schedule</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {/* ── STEP 2: TICKETS & SCHEDULE ── */}
            {activeStep === 2 && (
              <section className="ce-card">
                <div className="ce-card-header">
                  <div>
                    <h2 className="ce-card-title">Schedule, Location & Ticket Tiers</h2>
                    <p className="ce-card-sub">Configure when, where, and ticket options for your attendees.</p>
                  </div>
                  <span className="ce-step-badge">Step 2 of 3</span>
                </div>

                {/* Date & Time */}
                <div className="ce-form-row">
                  <div className="ce-form-group">
                    <label className="ce-label" htmlFor="ce-date">Event Date</label>
                    <div className="ce-input-with-icon">
                      <Calendar size={18} className="ce-input-icon" onClick={(e) => { const input = (e.currentTarget as Element).parentElement?.querySelector('input'); if (input && 'showPicker' in input) { (input as HTMLInputElement).showPicker(); } else { input?.focus(); } }} />
                      <input
                        id="ce-date"
                        type="date"
                        className="ce-input ce-input-pad"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="ce-form-group">
                    <label className="ce-label">Time Window</label>
                    <div className="ce-time-row">
                      <div className="ce-input-with-icon">
                        <Clock size={16} className="ce-input-icon" onClick={(e) => { const input = (e.currentTarget as Element).parentElement?.querySelector('input'); if (input && 'showPicker' in input) { (input as HTMLInputElement).showPicker(); } else { input?.focus(); } }} />
                        <input
                          type="time"
                          className="ce-input ce-input-pad"
                          value={timeStart}
                          onChange={(e) => setTimeStart(e.target.value)}
                        />
                      </div>
                      <span className="ce-time-sep">to</span>
                      <div className="ce-input-with-icon">
                        <Clock size={16} className="ce-input-icon" onClick={(e) => { const input = (e.currentTarget as Element).parentElement?.querySelector('input'); if (input && 'showPicker' in input) { (input as HTMLInputElement).showPicker(); } else { input?.focus(); } }} />
                        <input
                          type="time"
                          className="ce-input ce-input-pad"
                          value={timeEnd}
                          onChange={(e) => setTimeEnd(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Venue Type & Location */}
                <div className="ce-form-group">
                  <label className="ce-label">Venue Format</label>
                  <div className="ce-venue-types">
                    {(["in-person", "virtual", "hybrid"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`ce-venue-btn ${venueType === type ? "active" : ""}`}
                        onClick={() => setVenueType(type)}
                      >
                        {type === "in-person" && "📍 In-Person"}
                        {type === "virtual" && "💻 Virtual Online"}
                        {type === "hybrid" && "✨ Hybrid (Both)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ce-form-group">
                  <label className="ce-label" htmlFor="ce-location">
                    {venueType === "virtual" ? "Stream URL / Platform" : "Venue Address / City"}
                  </label>
                  <div className="ce-input-with-icon">
                    <MapPin size={18} className="ce-input-icon" />
                    <input
                      id="ce-location"
                      type="text"
                      className="ce-input ce-input-pad"
                      placeholder={venueType === "virtual" ? "https://live.eventstream.io/webgl" : "e.g. Tokyo, Japan (Shibuya Stream Hall)"}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Ticket Tiers Section */}
                <div className="ce-form-group ce-tiers-box">  
                  <div className="ce-tiers-header">
                    <div>
                      <h3 className="ce-tiers-title">Ticket Tiers ({ticketTiers.length})</h3>
                      <p className="ce-tiers-sub">
                        Tier total: <strong>{tierSum} spots</strong>
                        {maxCapacity > 0 && (
                          <> &nbsp;·&nbsp; Event cap: <strong>{maxCapacity} spots</strong></>
                        )}
                        {capacityOverLimit && (
                          <span className="ce-cap-warning"> ⚠ Tier total exceeds your cap!</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="ce-cap-control">
                    <label className="ce-cap-label" htmlFor="ce-max-capacity">
                      <Users size={14} />
                      Max Capacity
                    </label>
                    <input
                      id="ce-max-capacity"
                      type="number"
                      min="0"
                      className="ce-input ce-cap-input"
                      placeholder="Unlimited"
                      value={maxCapacity === 0 ? "" : maxCapacity}
                      onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    />
                  </div>

                  <div className="ce-tier-list">
                    {ticketTiers.map((tier) => (
                      <div key={tier.id} className="ce-tier-item">
                        <div className="ce-tier-icon">
                          <Ticket size={20} />
                        </div>
                        <div className="ce-tier-info">
                          <div className="ce-tier-name-row">
                            <span className="ce-tier-name">{tier.name}</span>
                            <span className="ce-tier-price">${tier.price}</span>
                          </div>
                          <div className="ce-tier-meta">
                            <span>Capacity: {tier.capacity} tickets</span>
                            <span className="ce-dot-sep">•</span>
                            <span>{tier.perks.join(" • ")}</span>
                          </div>
                        </div>
                        {ticketTiers.length > 1 && (
                          <button
                            type="button"
                            className="ce-del-btn"
                            onClick={() => handleRemoveTier(tier.id)}
                            title="Remove tier"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Tier */}
                  <div className="ce-add-tier-panel">
                    <h4 className="ce-add-tier-heading">Add Another Ticket Tier</h4>
                    <div className="ce-add-tier-grid">
                      <input
                        type="text"
                        className="ce-input"
                        placeholder="Tier name (e.g. Student Pass)"
                        value={newTierName}
                        onChange={(e) => setNewTierName(e.target.value)}
                      />
                      <div className="ce-input-with-icon">
                        <span className="ce-dollar-icon">$</span>
                        <input
                          type="number"
                          min="0"
                          className="ce-input ce-input-pad"
                          placeholder="Price"
                          value={newTierPrice}
                          onChange={(e) => setNewTierPrice(Number(e.target.value))}
                        />
                      </div>
                      <input
                        type="number"
                        min="1"
                        className="ce-input"
                        placeholder="Capacity"
                        value={newTierCap}
                        onChange={(e) => setNewTierCap(Number(e.target.value))}
                      />
                      <button
                        type="button"
                        className="ce-add-btn"
                        onClick={handleAddTier}
                      >
                        <Plus size={16} />
                        <span>Add Tier</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ce-card-footer">
                  <button
                    type="button"
                    className="ce-prev-btn"
                    onClick={() => handleStepChange(1)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back: Event Info</span>
                  </button>
                  <button
                    type="button"
                    className="ce-next-btn"
                    onClick={() => handleStepChange(3)}
                  >
                    <span>Next: Event Preview</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {/* ── STEP 3: THEME & PUBLISH ── */}
            {activeStep === 3 && (
              <section className="ce-card">
                <div className="ce-card-header">
                  <div>
                    <h2 className="ce-card-title">Event Overview</h2>
                    <p className="ce-card-sub">Review your event data.</p>
                  </div>
                  <span className="ce-step-badge">Step 3 of 3</span>
                </div>

                {/* Summary Check */}
                <div className="ce-summary-box">
                  < div className="ce-summary-row">
                    <span className="ce-summary-label">Title</span>
                    <span className="ce-summary-val">{title || "Untitled Event"}</span>
                  </div>
                  <div className="ce-summary-row">
                    <span className="ce-summary-label">Date & Time</span>
                    <span className="ce-summary-val">{date} • {timeStart} - {timeEnd}</span>
                  </div>
                  <div className="ce-summary-row">
                    <span className="ce-summary-label">Location</span>
                    <span className="ce-summary-val">{location || "Not specified"}</span>
                  </div>
                  <div className="ce-summary-row">
                    <span className="ce-summary-label">Total Spots</span>
                    <span className="ce-summary-val">{totalCapacity} Tickets ({ticketTiers.length} tiers)</span>
                  </div>
                </div>

                <div className="ce-card-footer">
                  <button
                    type="button"
                    className="ce-prev-btn"
                    onClick={() => handleStepChange(2)}
                  >
                    <ArrowLeft size={16} />
                    <span>Back: Schedule & Tickets</span>
                  </button>

                  <div className="ce-publish-cta">
                    <WobbleButton
                      text="Publish Now"
                      hoverText="Confirm! 🚀"
                      fillColor="#6dd2b0"
                      textColor="#0f3d2e"
                      width={180}
                      height={56}
                      fontSize={1.1}
                      bulgeAmount={4}
                      stiffness={0.04}
                      damping={0.96}
                      fontFamily="Dingos-Bold"
                      proximityThreshold={60}
                      onClick={handlePublish}
                    />
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Live Interactive Ticket Card Preview */}
          <aside className="ce-preview-column">
            <div className="ce-preview-sticky">
              <div className="ce-preview-header">
                <span className="ce-preview-label">
                  <Sparkles size={16} className="text-purple-600" /> Live Ticket Preview
                </span>
                <span className="ce-preview-pill">Interactive</span>
              </div>

              {/* Dynamic Event Ticket Preview Card */}
              <div
                className="ce-preview-card"
                style={{
                  backgroundColor: selectedTheme.cardBg,
                  color: selectedTheme.accent,
                }}
              >
                <div className="ce-preview-top">
                  <span className="ce-badge-pill">
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.icon}{" "}
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.label || "Special Event"}
                  </span>
                  <span className="ce-preview-price-tag">
                    {minPrice > 0 ? `From $${minPrice}` : "Free"}
                  </span>
                </div>

                <h3 className="ce-preview-title">{title || "Your Event Title"}</h3>

                <p className="ce-preview-desc">
                  {desc || "Your event description will appear here..."}
                </p>

                <div className="ce-preview-hosts">
                  <span>Hosted by <strong>{host1}</strong>{/* & <strong>{host2}</strong> */}</span>
                </div>

                <div className="ce-preview-meta-grid">
                  <div className="ce-preview-meta-item">
                    <Calendar size={16} />
                    <span>{date || "Date TBA"}</span>
                  </div>
                  <div className="ce-preview-meta-item">
                    <Clock size={16} />
                    <span>{timeStart} - {timeEnd}</span>
                  </div>
                  <div className="ce-preview-meta-item full">
                    <MapPin size={16} />
                    <span>{location || "Location TBA"}</span>
                  </div>
                </div>

                {/* Capacity progress */}
                <div className="ce-preview-capacity">
                  <div className="ce-preview-cap-row">
                    <span><Users size={14} /> Total Capacity</span>
                    <strong>{totalCapacity} spots</strong>
                  </div>
                  <div className="ce-preview-cap-track">
                    <div className="ce-preview-cap-bar" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Ticket Stub perforation effect */}
                {/* <div className="ce-perforation">
                  <div className="ce-perf-circle left" />
                  <div className="ce-perf-line" />
                  <div className="ce-perf-circle right" />
                </div> */}

                {/* Ticket Barcode / Code Section */}
                {/* <div className="ce-stub-footer">
                  <div className="ce-barcode">
                    {[3, 1, 4, 2, 5, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 2, 3, 4, 2, 1, 3].map((w, i) => (
                      <span key={i} style={{ width: `${w * 2}px` }} />
                    ))}
                  </div>
                  <div className="ce-ticket-code">#EVT-{Math.abs(title.length * 1024 + 2026)}</div>
                </div> */}
              </div>

              {/* Tip box */}
              {/* <div className="ce-tip-card">
                <Info size={18} className="ce-tip-icon" />
                <p>
                  Theme colors dynamically affect the water ripple distortion shaders in the background canvas.
                </p>
              </div> */}
            </div>
          </aside>
        </div>
      </div>

      {/* ── Success / Published Celebration Modal ── */}
      {isPublished && (
        <div className="ce-modal-overlay">
          <div className="ce-modal-card">
            <div className="ce-modal-badge">
              <Sparkles size={28} className="text-emerald-500" />
            </div>
            <h2 className="ce-modal-title">Event Created Successfully! 🎉</h2>
            <p className="ce-modal-desc">
              Your event <strong>"{title}"</strong> is now live and ready to accept ticket registrations.
            </p>

            <div className="ce-modal-link-box">
              <span className="ce-modal-url">https://immersive-tickets.io/events/{title.toLowerCase().replace(/[^a-z0-9]/g, "-")}</span>
              <button
                className="ce-copy-btn"
                onClick={handleCopyLink}
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedLink ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <div className="ce-modal-actions">
              <WobbleButton
                text="Back to Dashboard"
                hoverText="Done! ✨"
                fillColor="#211c3b"
                textColor="white"
                width={220}
                height={56}
                fontSize={1.1}
                bulgeAmount={3}
                stiffness={0.04}
                damping={0.96}
                fontFamily="Dingos-Bold"
                proximityThreshold={60}
                onClick={(e) => {
                  triggerRippleAt(e);
                  setIsPublished(false);
                  onBack(e);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEventUi;
