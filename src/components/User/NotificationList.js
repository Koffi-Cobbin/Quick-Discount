import { useState } from "react";
import styled, { keyframes, css } from "styled-components";

// ─── Animations ───────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Layout ───────────────────────────────────────────────────
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  max-width: 960px;
  min-height: 28px;
  margin-bottom: 12px;
`;

const Pill = styled.span`
  font-size: 12px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
  background: #fa81281a;
  color: #fa8128;
`;

const Grid = styled.div`
  display: grid;
  width: 100%;
  max-width: 960px;
  gap: 12px;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 960px;
  margin-top: 16px;
`;

// ─── Card ─────────────────────────────────────────────────────
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  border: 0.5px solid var(--color-border-tertiary);
  background: var(--color-background-primary);
  transition: background 0.15s ease;
  animation: ${fadeUp} 0.32s ${({ $index }) => $index * 45}ms ease both;

  ${({ $unread }) =>
    $unread &&
    css`
      border-left: 3px solid #fa8128;
      padding-left: 13px;
      background: var(--color-background-secondary);
    `}
`;

// ─── Card top row ─────────────────────────────────────────────
const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const Thumbnail = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 0.5px solid var(--color-border-tertiary);
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
  background: ${({ $unread }) =>
    $unread ? "#fa8128" : "var(--color-border-secondary)"};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  text-align: left;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const TypeLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 20px;
  background: #fa81281a;
  color: #fa8128;
`;

const Title = styled.div`
  font-size: 14px;
  line-height: 1.4;
  font-weight: ${({ $unread }) => ($unread ? 500 : 400)};
  color: ${({ $unread }) =>
    $unread ? "var(--color-text-primary)" : "var(--color-text-secondary)"};
  text-align: left;
`;

// ─── Message + Read more ──────────────────────────────────────
const MessageWrap = styled.div`
  width: 100%;
  text-align: left;
`;

const Message = styled.p`
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? "unset" : 2)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  animation: ${({ $expanded }) => ($expanded ? fadeIn : "none")} 0.2s ease;
`;

const ReadMoreBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #fa8128;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 3px;

  &:hover { opacity: 0.75; }
`;

// ─── Card footer ──────────────────────────────────────────────
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: var(--color-text-tertiary);
`;

const MarkReadBtn = styled.button`
  background: none;
  border: 0.5px solid var(--color-border-secondary);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  &:hover {
    background: var(--color-background-secondary);
    color: var(--color-text-primary);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

// ─── Mark all as read ─────────────────────────────────────────
const MarkAllBtn = styled.button`
  background: none;
  border: 0.5px solid var(--color-border-secondary);
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover:not(:disabled) {
    background: var(--color-background-secondary);
    color: var(--color-text-primary);
    border-color: var(--color-border-primary);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

// ─── NotificationRow ──────────────────────────────────────────
function NotificationRow({ notification, index, readIds, onMarkRead }) {
  const [expanded, setExpanded] = useState(false);

  const {
    id,
    title,
    message,
    notification_type_display,
    related_discount_data,
    is_read,
    created_at,
  } = notification;

  const isRead = is_read || readIds.has(id);
  const isLong = message?.length > 100;

  const formattedTime = created_at
    ? new Date(created_at).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Card $unread={!isRead} $index={index}>
      <CardTop>
        {related_discount_data?.flyer ? (
          <Thumbnail
            src={related_discount_data.flyer}
            alt={related_discount_data.title}
          />
        ) : (
          <Dot $unread={!isRead} />
        )}

        <Body>
          <Meta>
            {notification_type_display && (
              <TypeLabel>{notification_type_display}</TypeLabel>
            )}
            {!isRead && <Badge>New</Badge>}
          </Meta>
          <Title $unread={!isRead}>{title}</Title>
        </Body>
      </CardTop>

      {message && (
        <MessageWrap>
          <Message $expanded={expanded}>{message}</Message>
          {isLong && (
            <ReadMoreBtn onClick={() => setExpanded((p) => !p)}>
              {expanded ? "Show less ↑" : "Read more ↓"}
            </ReadMoreBtn>
          )}
        </MessageWrap>
      )}

      <CardFooter>
        <Timestamp>{formattedTime}</Timestamp>
        <MarkReadBtn
          disabled={isRead}
          onClick={() => !isRead && onMarkRead(id)}
        >
          {isRead ? "✓ Read" : "Mark as read"}
        </MarkReadBtn>
      </CardFooter>
    </Card>
  );
}

// ─── Main export ──────────────────────────────────────────────
export default function NotificationList({ notifications, onMarkRead, onMarkAllRead }) {
  const [readIds, setReadIds] = useState(new Set());

  const items = notifications?.results ?? [];
  const unread = items.filter((n) => !n.is_read && !readIds.has(n.id)).length;
  const allRead = unread === 0;

  const handleMarkRead = (id) => {
    setReadIds((prev) => new Set([...prev, id]));
    onMarkRead?.(id); // call API handler passed from parent
  };

  const handleMarkAllRead = () => {
    const allIds = items.filter((n) => !n.is_read).map((n) => n.id);
    setReadIds(new Set(allIds));
    onMarkAllRead?.(); // call API handler passed from parent
  };

  if (items.length === 0) return null;

  return (
    <Wrapper>
      <Header>
        {unread > 0 && <Pill>{unread} unread</Pill>}
      </Header>

      <Grid>
        {items.map((n, i) => (
          <NotificationRow
            key={n.id ?? i}
            notification={n}
            index={i}
            readIds={readIds}
            onMarkRead={handleMarkRead}
          />
        ))}
      </Grid>

      <Footer>
        <MarkAllBtn disabled={allRead} onClick={handleMarkAllRead}>
          {allRead ? "✓ All caught up" : "Mark all as read"}
        </MarkAllBtn>
      </Footer>
    </Wrapper>
  );
}