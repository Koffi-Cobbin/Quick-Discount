import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getOrganizerAPI, getOrganizerDiscountsAPI, getAnalyticsAPI, getUserNotificationsAPI, updateOrganizerAPI, deleteDiscountAPI } from "../../actions";
import Card from "../Shared/Card";

// Theme
const T = {
  bg: "#0e0d0b",
  surface: "rgba(255,255,255,0.035)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(240,236,230,0.08)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.18)",
  orangeGlow: "rgba(250,129,40,0.08)",
  text: "#f0ece6",
  textMuted: "rgba(240,236,230,0.45)",
  success: "#22c55e",
  successBg: "rgba(34,197,94,0.12)",
  error: "#ef4444",
  errorBg: "rgba(239,68,68,0.12)",
  radius: "12px",
};

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageWrap = styled.div`
  min-height: 100vh;
  background-color: ${T.bg};
  background-image:
    radial-gradient(ellipse 70% 45% at 50% 0%, rgba(250,129,40,0.13) 0%, transparent 68%),
    radial-gradient(ellipse 40% 30% at 80% 80%, rgba(250,129,40,0.05) 0%, transparent 60%);
  padding: 80px 16px 120px;
  @media (max-width: 480px) { padding: 72px 12px 100px; }
`;

const Container = styled.div`
  max-width: 80%;
  margin: 0 auto;
  animation: ${fadeUp} 0.5s ease;
  @media (max-width: 480px) { max-width: 100%; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  padding: 20px;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, ${T.orangeGlow} 0%, transparent 70%);
  }
`;

const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${T.orangeGlow};
  border: 1px solid ${T.orangeDim};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: ${T.orange};
  font-size: 16px;
`;

const StatValue = styled.div`
  font-family: "Georgia", serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ color }) => color || T.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: ${T.textMuted};
  text-transform: uppercase;
`;

const TabBar = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  padding: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabBtn = styled.button`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${({ active }) => active ? T.orange : 'transparent'};
  border: none;
  color: ${({ active }) => active ? '#fff' : T.textMuted};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover {
    background: ${({ active }) => active ? T.orange : T.surfaceHover};
    color: ${({ active }) => active ? '#fff' : T.text};
  }
`;

const TabBadge = styled.span`
  background: ${({ active }) => active ? 'rgba(255,255,255,0.25)' : T.orangeDim};
  color: ${({ active }) => active ? '#fff' : T.orange};
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 700;
`;

const Section = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${T.border};
`;

const SectionTitle = styled.h2`
  font-family: "Georgia", serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${T.text};
  margin: 0;
`;

const DiscountList = styled.div`padding: 8px;`;

const DiscountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
  &:hover { background: ${T.surfaceHover}; }
`;

const DiscountIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${T.orangeGlow};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const DiscountInfo = styled.div`flex: 1; min-width: 0;`;

const DiscountTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DiscountMeta = styled.div`
  font-size: 11px;
  color: ${T.textMuted};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div`
  width: 60px;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${T.orange};
  border-radius: 2px;
  width: ${({ pct }) => pct}%;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-family: "Courier New", monospace;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${({ status }) => status === 'active' ? T.successBg : status === 'pending' ? T.orangeDim : T.errorBg};
  color: ${({ status }) => status === 'active' ? T.success : status === 'pending' ? T.orange : T.error};
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${T.textMuted};
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 13px;
  margin: 0;
`;

// Grid for discount cards
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  padding: 8px;
`;

// Main Component
const OrganizerDashboard = (props) => {
  const [tab, setTab] = useState("all");
  
  // Form state for settings
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [saveState, setSaveState] = useState(null);

  // Sync state with organizer prop
  useEffect(() => {
    if (props.organizer) {
      setOrgName(props.organizer.name || "");
      setOrgEmail(props.organizer.email || "");
      setOrgPhone(props.organizer.phone_number || "");
    }
  }, [props.organizer]);

  const handleSaveOrganizer = (e) => {
    e.preventDefault();
    setSaveState("saving");
    
    const fd = new FormData();
    fd.append("name", orgName);
    fd.append("email", orgEmail);
    fd.append("phone_number", orgPhone);
    
    props.updateOrganizer(fd);
    
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState(null), 3000);
    }, 900);
  };

  // Fetch data on mount
  useEffect(() => {
    // Fetch organizer data
    props.getOrganizer();
  }, []);

  // Fetch discounts and analytics when organizer is available
  useEffect(() => {
    if (props.organizer && props.organizer.id) {
      props.getOrganizerDiscounts(props.organizer.id);
      props.getAnalytics(props.organizer.id);
    }
  }, [props.organizer]);

  // Fetch notifications if not available
  useEffect(() => {
    if (!props.notifications) {
      props.getUserNotifications();
    }
  }, []);

  // Get discounts from props (from Redux store)
  const discountsData = props.discounts?.results || props.discounts || [];
  
  // Get analytics data
  const analytics = props.analytics || {};
  const discountSummary = analytics.discount_summary || {};
  const engagement = analytics.engagement || {};
  const organizerInfo = analytics.organizer || {};

  // Use analytics data for stats (with fallback to manual calculation)
  const activeDiscounts = discountSummary.active_discounts !== undefined 
    ? discountSummary.active_discounts 
    : discountsData.filter(d => d.status === 'active').length;
  const pendingDiscounts = discountSummary.pending_discounts !== undefined 
    ? discountSummary.pending_discounts 
    : discountsData.filter(d => d.status === 'pending').length;
  const rejectedDiscounts = discountSummary.rejected_discounts !== undefined 
    ? discountSummary.rejected_discounts 
    : discountsData.filter(d => d.status === 'rejected').length;
  const expiredDiscounts = discountSummary.expired_discounts || 0;
  
  // Engagement metrics from analytics API
  const totalLikes = engagement.total_likes || 0;
  const totalReviews = engagement.total_reviews || 0;
  const averageRating = engagement.average_rating || 0;
  const totalWishlists = engagement.total_wishlists || 0;
  const followersCount = organizerInfo.followers_count || 0;

  // Helper function to check if a discount is expired based on end_date
  const isExpiredDiscount = (discount) => {
    if (discount.status === 'expired') return true;
    if (discount.end_date) {
      const endDate = new Date(discount.end_date);
      return endDate < new Date();
    }
    return false;
  };

  // Calculate expired discounts count based on actual data
  const expiredDiscountsCount = discountSummary.expired_discounts !== undefined 
    ? discountSummary.expired_discounts 
    : discountsData.filter(d => isExpiredDiscount(d)).length;

  const stats = {
    totalDiscounts: discountSummary.total_discounts !== undefined 
      ? discountSummary.total_discounts 
      : discountsData.length,
    activeDiscounts,
    pendingDiscounts,
    rejectedDiscounts,
    expiredDiscounts: expiredDiscountsCount,
    totalLikes,
    totalReviews,
    averageRating,
    totalWishlists,
    followersCount,
  };

  // Use actual notifications or empty array
  const notificationsData = props.notifications || [];
  const unreadCount = notificationsData.filter(n => !n.read).length;

  const tabs = [
    { id: "all", label: "My Discounts", badge: stats.totalDiscounts },
    { id: "active", label: "Active", badge: stats.activeDiscounts },
    { id: "pending", label: "Pending", badge: stats.pendingDiscounts },
    { id: "rejected", label: "Rejected", badge: stats.rejectedDiscounts },
    { id: "expired", label: "Expired", badge: stats.expiredDiscounts },
    { id: "notifications", label: "Notifications", badge: unreadCount > 0 ? unreadCount : null },
    { id: "settings", label: "Settings" },
  ];

  const filteredDiscounts = tab === "all" 
    ? discountsData 
    : tab === "expired" 
      ? discountsData.filter(d => isExpiredDiscount(d)) 
      : discountsData.filter(d => d.status === tab);

  return (
    <PageWrap>
      <Container>
        <StatsGrid>
          <StatCard>
            <StatIcon>🏷️</StatIcon>
            <StatValue>{stats.totalDiscounts}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>✓</StatIcon>
            <StatValue color={T.success}>{stats.activeDiscounts}</StatValue>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>⏳</StatIcon>
            <StatValue color={T.orange}>{stats.pendingDiscounts}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>✕</StatIcon>
            <StatValue color={T.error}>{stats.rejectedDiscounts}</StatValue>
            <StatLabel>Rejected</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>📅</StatIcon>
            <StatValue>{stats.expiredDiscounts}</StatValue>
            <StatLabel>Expired</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>👥</StatIcon>
            <StatValue>{stats.followersCount}</StatValue>
            <StatLabel>Followers</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>❤️</StatIcon>
            <StatValue>{stats.totalLikes}</StatValue>
            <StatLabel>Likes</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>⭐</StatIcon>
            <StatValue>{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}</StatValue>
            <StatLabel>Avg Rating</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>📝</StatIcon>
            <StatValue>{stats.totalReviews}</StatValue>
            <StatLabel>Reviews</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>💝</StatIcon>
            <StatValue>{stats.totalWishlists}</StatValue>
            <StatLabel>Wishlists</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Tabs */}
        <TabBar>
          {tabs.map((t) => (
            <TabBtn key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
              {t.badge ? <TabBadge active={tab === t.id}>{t.badge}</TabBadge> : null}
            </TabBtn>
          ))}
        </TabBar>

        {/* Tab Content */}
        {tab === "notifications" ? (
          <Section>
            <SectionHeader>
              <SectionTitle>Notifications</SectionTitle>
              {unreadCount > 0 && <TabBadge active={false}>{unreadCount} unread</TabBadge>}
            </SectionHeader>
            <DiscountList>
              {notificationsData.length > 0 ? (
                notificationsData.map((n) => (
                  <DiscountItem key={n.id || n.pk} style={{ opacity: n.read ? 0.6 : 1 }}>
                    <DiscountIcon>{n.read ? "✓" : "●"}</DiscountIcon>
                    <DiscountInfo>
                      <DiscountTitle>{n.msg || n.message}</DiscountTitle>
                      <DiscountMeta>{n.time || n.created_at || ""}</DiscountMeta>
                    </DiscountInfo>
                  </DiscountItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyIcon>🔔</EmptyIcon>
                  <EmptyText>No notifications yet.</EmptyText>
                </EmptyState>
              )}
            </DiscountList>
          </Section>
        ) : tab === "settings" ? (
          <Section>
            <SectionHeader>
              <SectionTitle>Settings</SectionTitle>
            </SectionHeader>
            <form style={{ padding: '20px' }} onSubmit={handleSaveOrganizer}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: T.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organizer Name</label>
                <input 
                  value={orgName} 
                  onChange={(e) => setOrgName(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '8px', color: T.text, fontSize: '14px' }} 
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: T.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Email</label>
                <input 
                  value={orgEmail} 
                  onChange={(e) => setOrgEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '8px', color: T.text, fontSize: '14px' }} 
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: T.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</label>
                <input 
                  value={orgPhone} 
                  onChange={(e) => setOrgPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '8px', color: T.text, fontSize: '14px' }} 
                />
              </div>
              <button 
                type="submit" 
                disabled={saveState === "saving"}
                style={{ padding: '12px 24px', background: T.orange, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                {saveState === "saving" ? "Saving..." : saveState === "saved" ? "✓ Saved!" : "Save Changes"}
              </button>
            </form>
          </Section>
        ) : (
          <Section>
            <SectionHeader>
            <SectionTitle>
                {tab === "all" ? "All Discounts" : tab === "expired" ? "Expired Discounts" : tab.charAt(0).toUpperCase() + tab.slice(1) + " Discounts"}
              </SectionTitle>
            </SectionHeader>
            {filteredDiscounts.length > 0 ? (
              <CardGrid>
                {filteredDiscounts.map((discount) => (
                  <Card 
                    key={discount.id} 
                    discount={discount} 
                    isEditMode={true}
                    onDelete={(id) => {
                      if (window.confirm("Are you sure you want to delete this discount?")) {
                        props.deleteDiscount(id);
                      }
                    }}
                  />
                ))}
              </CardGrid>
            ) : (
              <EmptyState>
                <EmptyIcon>🏷️</EmptyIcon>
                <EmptyText>No {tab !== "all" ? tab : ""} discounts yet.</EmptyText>
              </EmptyState>
            )}
          </Section>
        )}
      </Container>
    </PageWrap>
  );
};

const mapStateToProps = (state) => ({
  organizer: state.organizerState.organizer,
  discounts: state.organizerState.discounts,
  analytics: state.organizerState.analytics,
  notifications: state.userState.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  getOrganizer: () => dispatch(getOrganizerAPI()),
  getOrganizerDiscounts: (organizer_id) => dispatch(getOrganizerDiscountsAPI(organizer_id)),
  getAnalytics: (organizer_id) => dispatch(getAnalyticsAPI(organizer_id)),
  getUserNotifications: () => dispatch(getUserNotificationsAPI()),
  updateOrganizer: (data) => dispatch(updateOrganizerAPI(data)),
  deleteDiscount: (discount_id) => dispatch(deleteDiscountAPI(discount_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerDashboard);

