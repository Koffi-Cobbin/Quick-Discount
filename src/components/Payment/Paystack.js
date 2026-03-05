import React, { useEffect, useRef, useCallback } from "react";
import { PaystackButton } from "react-paystack";
import styled, { keyframes } from "styled-components";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyPaymentAPI, 
  setLoadingMessage, 
  setCreateDiscountStatus,
  setLoading,
  setPayment
 } from "../../actions";
import * as messages from "../../utils/messages";

// ─── Theme tokens (matching DiscountForm) ─────────────────────────────────────
const T = {
  bg: "#0e0d0b",
  surface: "rgba(255,255,255,0.035)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(240,236,230,0.08)",
  borderFocus: "rgba(250,129,40,0.55)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.18)",
  orangeGlow: "rgba(250,129,40,0.08)",
  text: "#f0ece6",
  textMuted: "rgba(240,236,230,0.45)",
  textSub: "rgba(240,236,230,0.65)",
  error: "#ff6b6b",
  errorBg: "rgba(255,107,107,0.07)",
  radius: "12px",
  radiusSm: "8px",
};

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// ─── Container with dark theme background ─────────────────────────────────────
const Container = styled.div`
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  animation: ${fadeUp} 0.4s ease-out;

  /* Wider on mobile/phone screens */
  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

// ─── Payment Card ─────────────────────────────────────────────────────────────
const PaymentCard = styled.div`
  background: rgba(255, 255, 255, 0.032);
  border: 1px solid rgba(240, 236, 230, 0.07);
  border-top: 1px solid rgba(250, 129, 40, 0.2);
  border-radius: 16px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 32px 80px rgba(0, 0, 0, 0.45),
    0 0 120px rgba(250, 129, 40, 0.04);
  width: 100%;
  max-width: 360px;
  padding: 28px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;

  /* Wider on mobile/phone screens */
  @media (max-width: 480px) {
    min-width: 90%;
    padding: 24px 20px;
  }

  @media (max-width: 360px) {
    min-width: 94%;
    padding: 20px 16px;
  }

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
      rgba(250, 129, 40, 0.5) 50%,
      transparent 100%
    );
  }
`;

// ─── Payment Header ───────────────────────────────────────────────────────────
const PaymentTitle = styled.h3`
  font-family: "Georgia", serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${T.text};
  margin: 0 0 8px;
  letter-spacing: -0.01em;
`;

const PaymentSubtitle = styled.p`
  font-size: 0.85rem;
  color: ${T.textMuted};
  margin: 0 0 24px;
  line-height: 1.5;
`;

// ─── Amount Display ──────────────────────────────────────────────────────────
const AmountDisplay = styled.div`
  background: linear-gradient(135deg, rgba(250,129,40,0.12) 0%, rgba(250,129,40,0.06) 100%);
  border: 1px solid rgba(250,129,40,0.25);
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
  border-top: 1px solid rgba(250,129,40,0.15);
`;

// ─── Paystack Button Wrapper ─────────────────────────────────────────────────
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
      box-shadow: 0 6px 20px rgba(250, 129, 40, 0.35);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: rgba(250, 129, 40, 0.25);
      border-color: transparent;
      cursor: not-allowed;
      color: rgba(255, 255, 255, 0.4);
      transform: none;
      box-shadow: none;
    }
  }
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
  animation: ${pulse} 2s infinite;
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


const Paystack = (props) => {
  const navigate = useNavigate();
  const hasProcessedPayment = useRef(false);

  // Paystack configuration
  const publicKey = props.payment.public_key;
  const amount = `${parseFloat(props.payment.amount).toFixed(2) * 100}`;
  const email = props.payment.email;
  const currency = "GHS"; // Currency code
  const reference = props.payment.ref_code;

  const extraData = {
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
  };

  // Handle successful payment
  const handleSuccess = useCallback((paystack_response) => {
    console.log("Payment successful!", paystack_response);
    props.verifyPayment(paystack_response);
  }, [props]);

  // Handle failed payment
  const handleFailure = useCallback((error) => {
    console.error("Payment failed!", error);
  }, []);

  // Consolidated effect: Handle payment verification and redirect
  useEffect(() => {
    // Prevent multiple processing
    if (hasProcessedPayment.current) return;
    
    // Only proceed if payment is verified
    if (!props.payment?.paid) return;
    
    // If still loading, wait for it to complete
    if (props.loading) return;

    // Mark as processed to prevent re-running
    hasProcessedPayment.current = true;

    // Show loader with success message when payment is verified
    props.showLoader();
    props.showSuccessMessage(messages.CREATE_DISCOUNT_SUCCESS_MESSAGE);
    console.log("PAYMENT VERIFIED - Success message shown");
    
    // Auto-redirect after showing success message (gives time for user to see it)
    const redirectTimer = setTimeout(() => {
      console.log("Loader dismissed, redirecting to dashboard...");
      props.clearPayment();
      props.resetCreateDiscountStatus();
      navigate('/dashboard');
    }, 2500);

    return () => clearTimeout(redirectTimer);
  }, [props.payment?.paid, props.loading, props, navigate]);


  return (
    <Container>
      <PaymentCard>
        <PaymentTitle>Complete Payment</PaymentTitle>
        <PaymentSubtitle>
          Your discount ad is ready. Complete payment to publish.
        </PaymentSubtitle>

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

        <SecureNote>
          🔒 Powered by Paystack · SSL Encrypted
        </SecureNote>
      </PaymentCard>
    </Container>
  );
};

// ─── Redux mapStateToProps ─────────────────────────────────────────────────────
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    payment: state.userState.payment,
  };
};

// ─── Redux mapDispatchToProps ────────────────────────────────────────────────
const mapDispatchToProps = (dispatch) => ({
  showLoader: () => dispatch(setLoading(true)),
  verifyPayment: (payload) => dispatch(verifyPaymentAPI(payload)),
  clearPayment: () => dispatch(setPayment(null)),
  showSuccessMessage: (message) => dispatch(setLoadingMessage(message)),
  resetCreateDiscountStatus: () => dispatch(setCreateDiscountStatus(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Paystack);
