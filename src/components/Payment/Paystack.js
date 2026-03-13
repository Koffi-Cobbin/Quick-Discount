import React, { useEffect, useRef, useCallback } from "react";
import { PaystackButton } from "react-paystack";
import styled, { keyframes } from "styled-components";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  verifyPaymentAPI,
  setLoadingMessage,
  setCreateDiscountStatus,
  setLoading,
  setPayment,
  setPendingRedirect,
} from "../../actions";
import * as messages from "../../utils/messages";

// ─── Theme tokens (light — matching DiscountForm) ─────────────────────────────
const T = {
  bg: "#f5f4f2",
  surface: "#ffffff",
  border: "rgba(0,0,0,0.1)",
  borderFocus: "rgba(250,129,40,0.55)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.1)",
  orangeGlow: "rgba(250,129,40,0.06)",
  text: "#1a1a16",
  textMuted: "rgba(20,20,15,0.45)",
  textSub: "rgba(20,20,15,0.6)",
  radius: "12px",
  radiusSm: "8px",
};

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0 20px;
  width: 100%;
  animation: ${fadeUp} 0.4s ease-out;
`;

// ─── Payment Card ─────────────────────────────────────────────────────────────
const PaymentCard = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-top: 1px solid rgba(250, 129, 40, 0.3);
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.07);
  width: 100%;
  max-width: 380px;
  padding: 28px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 24px 18px;
  }

  /* Top accent line */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(250, 129, 40, 0.55) 50%,
      transparent 100%
    );
  }
`;

// ─── Header ───────────────────────────────────────────────────────────────────
const PaymentTitle = styled.h3`
  font-family: "Georgia", serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${T.text};
  margin: 0 0 6px;
  letter-spacing: -0.01em;
`;

const PaymentSubtitle = styled.p`
  font-size: 0.83rem;
  color: ${T.textMuted};
  margin: 0 0 24px;
  line-height: 1.5;
`;

// ─── Amount Display ───────────────────────────────────────────────────────────
const AmountDisplay = styled.div`
  background: linear-gradient(
    135deg,
    rgba(250, 129, 40, 0.08) 0%,
    rgba(250, 129, 40, 0.04) 100%
  );
  border: 1px solid rgba(250, 129, 40, 0.2);
  border-radius: ${T.radius};
  padding: 20px;
  margin-bottom: 24px;
`;

const AmountLabel = styled.span`
  display: block;
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${T.textMuted};
  margin-bottom: 6px;
`;

const AmountValue = styled.span`
  display: block;
  font-family: "Georgia", serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: ${T.orange};
  letter-spacing: -0.02em;
`;

const PackageInfo = styled.span`
  display: block;
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.textSub};
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(250, 129, 40, 0.15);
`;

// ─── Paystack Button Wrapper ──────────────────────────────────────────────────
const PaystackButtonWrap = styled.div`
  .paystack-button {
    width: 100%;
    padding: 14px 28px;
    border-radius: 40px;
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s;
    background: ${T.orange};
    border: 1px solid ${T.orange};
    color: #fff;

    &:hover {
      background: #e67020;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(250, 129, 40, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: rgba(250, 129, 40, 0.2);
      border-color: transparent;
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.25);
      transform: none;
      box-shadow: none;
    }
  }
`;

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${T.border};
  }
`;

const DividerText = styled.span`
  padding: 0 12px;
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.textMuted};
`;

// ─── Secure Note ─────────────────────────────────────────────────────────────
const SecureNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 0.72rem;
  color: ${T.textMuted};
  animation: ${pulse} 2.5s ease-in-out infinite;
`;

// ─── Component ────────────────────────────────────────────────────────────────
const PaystackComponent = (props) => {
  const navigate = useNavigate();
  const hasProcessedPayment = useRef(false);

  const publicKey = props.payment.public_key;
  const amount = `${parseFloat(props.payment.amount).toFixed(2) * 100}`;
  const email = props.payment.email;
  const currency = "GHS";
  const reference = props.payment.ref_code;

  const extraData = {
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
  };

  const handleSuccess = useCallback(
    (paystack_response) => {
      console.log("Payment successful!", paystack_response);
      props.verifyPayment(paystack_response);
    },
    [props],
  );

  const handleFailure = useCallback(
    (error) => {
      console.error("Payment failed!", error);
    },
    [],
  );

useEffect(() => {
    if (props.payment?.verified && !hasProcessedPayment.current) {
      console.log("Payment verified! Showing success message and redirecting...");
      hasProcessedPayment.current = true;
      props.showLoader();
      props.setPendingRedirect("/");
      setTimeout(() => {
        props.showSuccessMessage(messages.CREATE_DISCOUNT_SUCCESS_MESSAGE);
      }, 100);
      props.resetCreateDiscountStatus?.();
      props.clearPayment?.();
      // ← navigate("/") removed — Loading.js handles it on close
    }
  }, [props.payment?.verified]); 

  return (
    <Container>
      <PaymentCard>
        <PaymentTitle>Complete Payment</PaymentTitle>
        <PaymentSubtitle>Complete payment to publish.</PaymentSubtitle>

        <AmountDisplay>
          <AmountLabel>Amount to Pay</AmountLabel>
          <AmountValue>GH&#8373; {props.payment.amount}</AmountValue>
          <PackageInfo>{props.package_type} Package</PackageInfo>
        </AmountDisplay>

        <PaystackButtonWrap>
          <PaystackButton
            text="Pay Now"
            className="paystack-button"
            publicKey={publicKey}
            amount={amount}
            currency={currency}
            reference={reference}
            email={email}
            metadata={extraData}
            onSuccess={handleSuccess}
            onClose={handleFailure}
          />
        </PaystackButtonWrap>

        <Divider>
          <DividerText>Secure Payment</DividerText>
        </Divider>

        <SecureNote>🔒 Powered by Paystack · SSL Encrypted</SecureNote>
      </PaymentCard>
    </Container>
  );
};

// ─── Redux ────────────────────────────────────────────────────────────────────
const mapStateToProps = (state) => ({
  user: state.userState.user,
  payment: state.userState.payment,
});

const mapDispatchToProps = (dispatch) => ({
  showLoader: () => dispatch(setLoading(true)),
  verifyPayment: (payload) => dispatch(verifyPaymentAPI(payload)),
  clearPayment: () => dispatch(setPayment(null)),
  showSuccessMessage: (message) => dispatch(setLoadingMessage(message)),
  resetCreateDiscountStatus: () => dispatch(setCreateDiscountStatus(null)),
  setPendingRedirect: (url) => dispatch(setPendingRedirect(url)),  // ← added
});

export default connect(mapStateToProps, mapDispatchToProps)(PaystackComponent);