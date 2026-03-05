import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { 
  addToWishlistAPI, 
  removeFromWishlistAPI, 
  getWishlistAPI, 
  getUserNotificationsAPI,
  userUpdateAPI 
} from "../../actions";
import Card from "../Shared/Card";
import "./Dashboard.css";

function Empty({ icon, title, body }) {
  return (
    <div className="dashboard-empty">
      <div className="dashboard-empty-icon">{icon}</div>
      <div className="dashboard-empty-title">{title}</div>
      <div className="dashboard-empty-body">{body}</div>
    </div>
  );
}

function UserDashboard({
  user,
  wishlist,
  notifications,
  organizer,
  loading,
  token,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUserNotifications,
  updateUser
}) {
  const isOrganizer = !!(user?.organizer_detail || organizer);

  const [tab, setTab] = useState("saved");
  const [greeting, setGreeting] = useState("Welcome");
  const [savedIds, setSavedIds] = useState(new Set());
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const [uName, setUName] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uPhone, setUPhone] = useState("");
  const [preview, setPreview] = useState(null);

  // Sync state with user prop
  useEffect(() => {
    if (user) {
      setUName(user.name || "");
      setUEmail(user.email || "");
      setUPhone(user.contact || "");
      setPreview(user.profile_pic || null);
    }
  }, [user]);
  const [newFile, setNewFile] = useState(null);
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [saveState, setSave] = useState(null);
  const fileRef = useRef();

  const unread = notifications?.filter((n) => !n.read).length || 0;

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening",
    );
  }, []);

// Fetch wishlist and notifications on mount
  useEffect(() => {
    if (!wishlist) {
      setLoadingWishlist(true);
      const wishlistPromise = getWishlist();
      if (wishlistPromise && typeof wishlistPromise.finally === 'function') {
        wishlistPromise.finally(() => setLoadingWishlist(false));
      } else {
        setLoadingWishlist(false);
      }
    }
    
    if (!notifications) {
      getUserNotifications();
    }
  }, []);

  // Sync saved IDs with wishlist
  useEffect(() => {
    if (wishlist) {
      setSavedIds(new Set(wishlist.map((w) => w.id)));
    }
  }, [wishlist]);

  const toggleSave = (id) => {
    const isCurrentlySaved = savedIds.has(id);
    
    // Optimistic update
    setSavedIds((p) => {
      const n = new Set(p);
      if (isCurrentlySaved) {
        n.delete(id);
        // Call API to remove from wishlist
        removeFromWishlist({ discount_ids: [id] });
      } else {
        n.add(id);
        // Call API to add to wishlist
        addToWishlist({ discount_ids: [id] });
      }
      return n;
    });
  };
  
  // Get saved items from wishlist
  const savedItems = wishlist || [];

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setNewFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (emailErr || phoneErr) return;
    setSave("saving");
    
    const fd = new FormData();
    fd.append("name", uName);
    fd.append("email", uEmail);
    fd.append("contact", uPhone);
    if (newFile) fd.append("profile_pic", newFile);
    
    updateUser(fd);
    
    setTimeout(() => {
      setSave("saved");
      setTimeout(() => setSave(null), 3000);
    }, 900);
  };

  const tabs = [
    { id: "saved", label: "Saved" },
    { id: "notifications", label: "Notifications", badge: unread || null },
    { id: "settings", label: "Settings" },
  ];

  const avStyle = (src) => (src ? { backgroundImage: `url(${src})` } : {});

  return (
    <div className="dashboard-container">
      {/* HERO */}
      <div className="dashboard-hero">
        <div className="dashboard-inner">
          <div className="dashboard-hero-row">
            <div className="dashboard-hero-left">
              <div className="dashboard-avatar-ring">
                <div
                  className="dashboard-avatar"
                  style={avStyle(preview || user?.profile_pic)}
                >
                  {!preview && !user?.profile_pic && (
                    <span className="dashboard-avatar-letter">
                      {(user?.name ?? "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="dashboard-greet">{greeting},</div>
                <div className="dashboard-name">{user?.name ?? "User"}</div>
                <div className="dashboard-email">{user?.email}</div>
              </div>
            </div>

            {isOrganizer && (
              <a className="dashboard-org-btn" href="/organizer-dashboard">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="14"
                  height="14"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Organizer Dashboard
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="12"
                  height="12"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="dashboard-tab-barOuter">
        <div className="dashboard-inner">
          <div className="dashboard-tab-bar">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`dashboard-tab-btn ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {t.badge ? <span className="dashboard-tab-badge">{t.badge}</span> : null}
                {tab === t.id && <span className="dashboard-tab-pip" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-inner">
        <div className="dashboard-content" key={tab}>
          {tab === "saved" &&
            (savedItems.length === 0 ? (
              <Empty
                icon="♥"
                title="Nothing saved yet"
                body="Tap the heart on any discount to save it here."
              />
) : (
              <div className="dashboard-grid">
                {savedItems.map((d, i) => (
                  <Card
                    key={d.id}
                    discount={d}
                    index={i}
                    onSave={toggleSave}
                    isSaved={savedIds.has(d.id)}
                  />
                ))}
              </div>
            ))}

          {tab === "notifications" &&
            <>
              <div className="dashboard-notif-header">
                <div className="dashboard-notif-title">Notifications</div>
                {unread > 0 && <span className="dashboard-notif-pill">{unread} unread</span>}
              </div>
              {(!notifications || notifications.length === 0) ? (
                <Empty
                  icon="🔔"
                  title="All caught up"
                  body="No notifications right now."
                />
              ) : (
                <div className="dashboard-notif-list">
                  {notifications.map((n, i) => (
                    <div
                      key={n.id ?? i}
                      className={`dashboard-notif-row ${!n.read ? "unread" : ""}`}
                      style={{ animation: `fadeUp .32s ${i * 45}ms ease both` }}
                    >
                      <div className={`dashboard-notif-dot ${!n.read ? "unread" : "read"}`} />
                      <div>
                        <div className={`dashboard-notif-msg ${!n.read ? "unread" : "read"}`}>
                          {n.msg ?? n.message}
                        </div>
                        <div className="dashboard-notif-time">
                          {n.time ?? n.created_at ?? ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          }

          {tab === "settings" && (
            <div className="dashboard-settings-grid">
              <div className="dashboard-avatar-col">
                <div
                  className="dashboard-avatar-edit"
                  style={avStyle(preview || user?.profile_pic)}
                  onClick={() => fileRef.current?.click()}
                >
                  {!preview && !user?.profile_pic && (
                    <span
                      style={{
                        fontSize: 34,
                        fontWeight: 700,
                        color: "#fa8128",
                        fontFamily: "'Playfair Display',serif",
                      }}
                    >
                      {(user?.name ?? "U")[0].toUpperCase()}
                    </span>
                  )}
                  <div className="dashboard-avatar-overlay">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    Change
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
                <div className="dashboard-settings-name">{user?.name ?? "User"}</div>
                <div className="dashboard-settings-email">{user?.email}</div>
              </div>

              <form className="dashboard-settings-form" onSubmit={handleSave}>
                <div>
                  <label className="dashboard-form-label">Full Name</label>
                  <input
                    className="dashboard-form-input"
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="dashboard-form-label">Email</label>
                  <input
                    className={`dashboard-form-input ${emailErr ? "error" : ""}`}
                    type="email"
                    value={uEmail}
                    onChange={(e) => {
                      setUEmail(e.target.value);
                      setEmailErr(
                        e.target.value &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)
                          ? "Invalid email"
                          : "",
                      );
                    }}
                    placeholder="you@email.com"
                  />
                  {emailErr && <div className="dashboard-form-error">{emailErr}</div>}
                </div>
                <div>
                  <label className="dashboard-form-label">Phone Number</label>
                  <input
                    className={`dashboard-form-input ${phoneErr ? "error" : ""}`}
                    value={uPhone}
                    onChange={(e) => {
                      setUPhone(e.target.value);
                      setPhoneErr(
                        e.target.value && e.target.value.length < 7
                          ? "Invalid number"
                          : "",
                      );
                    }}
                    placeholder="+233 XX XXX XXXX"
                  />
                  {phoneErr && <div className="dashboard-form-error">{phoneErr}</div>}
                </div>
                <div className="dashboard-form-footer">
                  <button
                    type="submit"
                    className="dashboard-submit-btn"
                    disabled={
                      !!emailErr || !!phoneErr || saveState === "saving"
                    }
                  >
                    {saveState === "saving" ? (
                      <>
                        <span className="dashboard-spinner" /> Saving…
                      </>
                    ) : saveState === "saved" ? (
                      "✓ Saved!"
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.userState.user,
  wishlist: state.discountState.wishlist,
  notifications: state.userState.notifications,
  organizer: state.organizerState.organizer,
  loading: state.appState.loading,
  token: state.userState.token,
});

const mapDispatchToProps = (dispatch) => ({
  addToWishlist: (data) => dispatch(addToWishlistAPI(data)),
  removeFromWishlist: (data) => dispatch(removeFromWishlistAPI(data)),
  getWishlist: () => dispatch(getWishlistAPI()),
  getUserNotifications: () => dispatch(getUserNotificationsAPI()),
  updateUser: (data) => dispatch(userUpdateAPI(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
