import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { connect } from "react-redux";
import { setLoading, setLoadingMessage } from "../../actions";

const Loading = (props) => {
  const [visible, setVisible] = useState(false);
  const autoDismissTimer = useRef(null);

  // Slight delay before showing — prevents flash on fast loads
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss whenever a message appears (success or error)
  // FIX: was `props.loading_message && props.loading` — but setLoading(false)
  // is dispatched before/alongside setLoadingMessage, so props.loading is
  // already false by the time this effect runs. Condition must be message-only.
  useEffect(() => {
    if (autoDismissTimer.current) clearTimeout(autoDismissTimer.current);

    if (props.loading_message) {
      autoDismissTimer.current = setTimeout(() => {
        props.close();
      }, 3000);
    }

    return () => {
      if (autoDismissTimer.current) clearTimeout(autoDismissTimer.current);
    };
  }, [props.loading_message]);

  // Clear timer if user manually closes the loader
  const handleClose = () => {
    if (autoDismissTimer.current) clearTimeout(autoDismissTimer.current);
    props.close();
  };

  // Determine if message is an error/success
  const isError = props.loading_message &&
    (props.loading_message.props?.children?.some?.(c => c?.props?.style?.color === 'red') ||
     String(props.loading_message).includes('error') ||
     String(props.loading_message).includes('Failed'));

  return (
    <Overlay visible={visible}>
      {/* Ambient orbs for depth */}
      <Orb top="15%" left="10%"  size="320px" color="rgba(220,103,14,0.13)" delay="0s"  />
      <Orb top="60%" left="75%"  size="260px" color="rgba(220,103,14,0.09)" delay="1.4s"/>
      <Orb top="40%" left="50%"  size="180px" color="rgba(255,255,255,0.04)" delay="0.7s"/>

      <Card hasMessage={!!props.loading_message}>
        {/* Close button */}
        <CloseBtn onClick={handleClose} aria-label="Dismiss">&times;</CloseBtn>

        {props.loading_message ? (
          <MessageContent>
            <MessageIcon>
              <SuccessIcon
                src={isError ? "/images/icons/error.svg" : "/images/icons/tick-circle.svg"}
                alt={isError ? "Error" : "Success"}
              />
            </MessageIcon>
            <MessageText isError={isError}>{props.loading_message}</MessageText>
          </MessageContent>
        ) : (
          <SpinnerContent>
            <RingWrap>
              <RingOuter />
              <RingMiddle />
              <RingInner />
              <CoreDot />
            </RingWrap>
            <Label>
              <LabelDot />
              Loading
              <Ellipsis>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </Ellipsis>
            </Label>
          </SpinnerContent>
        )}

        {/* Bottom progress bar */}
        <ProgressBar />
      </Card>
    </Overlay>
  );
};

/* ─── Keyframes ──────────────────────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const spinCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const spinCCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.3); opacity: 0.7; }
`;

const orbFloat = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(18px, -22px) scale(1.07); }
  66%       { transform: translate(-14px, 12px) scale(0.95); }
`;

const dotBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
  40%            { transform: translateY(-5px); opacity: 1; }
`;

const progressSweep = keyframes`
  0%   { width: 0%;   opacity: 1; }
  70%  { width: 85%;  opacity: 1; }
  95%  { width: 98%;  opacity: 1; }
  100% { width: 100%; opacity: 0; }
`;

const cardIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

/* ─── Overlay ────────────────────────────────────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 5, 2, 0.78);
  backdrop-filter: blur(14px) saturate(1.6);
  -webkit-backdrop-filter: blur(14px) saturate(1.6);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  animation: ${fadeIn} 0.35s ease;
`;

/* ─── Floating ambient orbs ──────────────────────────────────────────────── */

const Orb = styled.div`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: radial-gradient(circle, ${({ color }) => color} 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: ${orbFloat} 6s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay};
`;

/* ─── Card ───────────────────────────────────────────────────────────────── */

const Card = styled.div`
  position: relative;
  width: ${({ hasMessage }) => hasMessage ? '320px' : '200px'};
  background: rgba(20, 13, 6, 0.82);
  border: 1px solid rgba(220, 103, 14, 0.28);
  border-radius: 20px;
  padding: 36px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 24px 60px rgba(0, 0, 0, 0.55),
    0 0 40px rgba(220, 103, 14, 0.08);
  overflow: hidden;
  animation: ${cardIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

/* ─── Close ──────────────────────────────────────────────────────────────── */

const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.35);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 4px;
  transition: color 0.2s;
  &:hover { color: rgba(255, 255, 255, 0.8); }
`;

/* ─── Spinner ────────────────────────────────────────────────────────────── */

const SpinnerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const RingWrap = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ringBase = css`
  position: absolute;
  border-radius: 50%;
  border-style: solid;
  border-color: transparent;
`;

const RingOuter = styled.div`
  ${ringBase}
  width: 72px;
  height: 72px;
  border-width: 3px;
  border-top-color: #fa8128;
  border-right-color: rgba(250, 129, 40, 0.3);
  animation: ${spinCW} 1.1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const RingMiddle = styled.div`
  ${ringBase}
  width: 52px;
  height: 52px;
  border-width: 2.5px;
  border-top-color: rgba(255, 255, 255, 0.6);
  border-left-color: rgba(255, 255, 255, 0.15);
  animation: ${spinCCW} 0.85s linear infinite;
`;

const RingInner = styled.div`
  ${ringBase}
  width: 34px;
  height: 34px;
  border-width: 2px;
  border-top-color: rgba(220, 103, 14, 0.5);
  border-right-color: rgba(220, 103, 14, 0.2);
  animation: ${spinCW} 1.4s ease-in-out infinite;
`;

const CoreDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fa8128;
  box-shadow: 0 0 10px 3px rgba(250, 129, 40, 0.55);
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

/* ─── Label ──────────────────────────────────────────────────────────────── */

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
`;

const LabelDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fa8128;
  box-shadow: 0 0 6px 2px rgba(250, 129, 40, 0.5);
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const Ellipsis = styled.span`
  display: inline-flex;
  gap: 1px;
  span {
    animation: ${dotBounce} 1.2s ease-in-out infinite;
    color: #fa8128;
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.18s; }
    &:nth-child(3) { animation-delay: 0.36s; }
  }
`;

/* ─── Progress bar ───────────────────────────────────────────────────────── */

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #fa8128 40%, #ffb366 80%, transparent 100%);
  border-radius: 0 0 20px 20px;
  animation: ${progressSweep} 2.4s ease-in-out infinite;
`;

/* ─── Message state ──────────────────────────────────────────────────────── */

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0 4px;
  width: 100%;
`;

const MessageIcon = styled.div`
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuccessIcon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const MessageText = styled.div`
  margin: 0;
  font-family: Inter, "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ isError }) => isError ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.85)'};
  text-align: center;
  line-height: 1.5;
  max-width: 260px;

  img { display: none; }

  p {
    margin: 0;
    color: inherit;
    font-size: 13px;
    line-height: 1.5;
  }
`;

/* ─── Redux ──────────────────────────────────────────────────────────────── */

const mapStateToProps = (state) => ({
  loading: state.appState.loading,
  loading_message: state.appState.loading_message,
});

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch(setLoadingMessage(null));
    dispatch(setLoading(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);