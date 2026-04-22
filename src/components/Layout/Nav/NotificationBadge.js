function NotificationBadge() {
  const { state, dispatch, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);
  const pollRef = useRef(null);
 
  const fetchCount = useCallback(async () => {
    const { count } = await api.getUnreadCount();
    dispatch({ type: "SET_UNREAD", count });
  }, [dispatch]);
 
  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [notifs] = await Promise.all([api.getNotifications()]);
    dispatch({ type: "SET_NOTIFICATIONS", notifications: notifs });
    setLoading(false);
  }, [dispatch]);
 
  useEffect(() => {
    fetchCount();
    pollRef.current = setInterval(fetchCount, 45000);
    const onFocus = () => fetchCount();
    document.addEventListener("visibilitychange", onFocus);
    return () => { clearInterval(pollRef.current); document.removeEventListener("visibilitychange", onFocus); };
  }, [fetchCount]);
 
  useEffect(() => {
    if (!open) return;
    fetchAll();
    const onOutside = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open, fetchAll]);
 
  const handleMark = async (id) => {
    dispatch({ type: "MARK_READ", id });
    await api.markAsRead(id);
  };
 
  const handleMarkAll = async () => {
    dispatch({ type: "MARK_ALL_READ" });
    await api.bulkMarkRead();
    showToast("All notifications marked as read");
  };
 
  const ICONS = { review_reply: "💬", new_review: "⭐", follow: "👤", like: "❤️" };
 
  return (
    <div ref={dropRef} style={{ position: "relative" }}>
      <button
        aria-label={`Notifications${state.unreadCount ? `, ${state.unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{ position: "relative", background: "transparent", border: `0.5px solid var(--color-border-tertiary)`, borderRadius: "var(--border-radius-md)", padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--color-text-primary)", fontSize: 14 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Notifications
        {state.unreadCount > 0 && (
          <span aria-hidden style={{ position: "absolute", top: -6, right: -6, background: ORG, color: "#fff", borderRadius: "50%", minWidth: 18, height: 18, fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", lineHeight: 1 }}>
            {state.unreadCount > 9 ? "9+" : state.unreadCount}
          </span>
        )}
      </button>
 
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 340, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", zIndex: 1000, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>Notifications</span>
            {state.unreadCount > 0 && (
              <button onClick={handleMarkAll} style={{ background: "none", border: "none", color: ORG, fontSize: 12, cursor: "pointer", padding: 0 }}>Mark all read</button>
            )}
          </div>
 
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-background-secondary)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, background: "var(--color-background-secondary)", borderRadius: 4, marginBottom: 6, width: "80%" }} />
                    <div style={{ height: 10, background: "var(--color-background-secondary)", borderRadius: 4, width: "40%" }} />
                  </div>
                </div>
              ))
            ) : state.notifications.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>No notifications yet</div>
            ) : (
              state.notifications.map(n => (
                <div key={n.id} onClick={() => !n.read && handleMark(n.id)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", cursor: n.read ? "default" : "pointer", background: n.read ? "transparent" : ORG_DIM, transition: "background 0.15s" }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{ICONS[n.type] || "🔔"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--color-text-secondary)" }}>{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: ORG, flexShrink: 0, marginTop: 5 }} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}