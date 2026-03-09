import React from "react";
import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Paystack from "./Paystack";
import { checkoutAPI, setUserOrder } from "../../actions";
import { isContactValid, isEmailValid } from "../../utils/middleware";

// ─── Theme tokens (light — matching DiscountForm) ─────────────────────────────
const T = {
  bg: "#f5f4f2",
  surface: "#ffffff",
  surfaceHover: "rgba(0,0,0,0.025)",
  border: "rgba(0,0,0,0.1)",
  borderFocus: "rgba(250,129,40,0.55)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.1)",
  orangeGlow: "rgba(250,129,40,0.06)",
  text: "#1a1a16",
  textMuted: "rgba(20,20,15,0.45)",
  textSub: "rgba(20,20,15,0.6)",
  error: "#d93025",
  errorBg: "rgba(217,48,37,0.06)",
  radius: "12px",
  radiusSm: "8px",
};

// ─── Styled Components ────────────────────────────────────────────────────────
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
`;

const OrderSummary = styled.div`
  background: linear-gradient(135deg, rgba(250,129,40,0.07) 0%, rgba(250,129,40,0.03) 100%);
  border: 1px solid rgba(250,129,40,0.2);
  border-radius: ${T.radius};
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-family: "Georgia", serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${T.text};
  margin: 0 0 16px;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${T.border};

  &:last-child {
    border-bottom: none;
    padding-top: 12px;
    margin-top: 4px;
    border-top: 1px solid rgba(250, 129, 40, 0.2);
  }
`;

const SummaryLabel = styled.span`
  font-family: "Courier New", monospace;
  font-size: 0.82rem;
  color: ${T.textSub};
`;

const SummaryValue = styled.span`
  font-family: "Georgia", serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${T.text};
`;

const TotalValue = styled.span`
  font-family: "Georgia", serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${T.orange};
`;

// ─── Payment method section ───────────────────────────────────────────────────
const PaymentSection = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  padding: 20px;
  margin-bottom: 16px;
`;

const PaymentMethodTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const PaymentTab = styled.button`
  flex: 1;
  padding: 11px 16px;
  border-radius: ${T.radiusSm};
  font-family: "Courier New", monospace;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid ${({ active }) => (active ? T.orange : T.border)};
  background: ${({ active }) => (active ? T.orangeDim : "transparent")};
  color: ${({ active }) => (active ? T.orange : T.textSub)};

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }
`;

// ─── Input styles matching DiscountForm ──────────────────────────────────────
const baseInput = css`
  width: 100%;
  background: #faf9f7;
  border: 1px solid ${T.border};
  border-radius: ${T.radiusSm};
  color: ${T.text};
  font-size: 0.92rem;
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: ${T.textMuted};
  }

  &:focus {
    border-color: ${T.borderFocus};
    background: ${T.surface};
    box-shadow: 0 0 0 3px rgba(250, 129, 40, 0.08);
  }

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: ${T.error};
      background: ${T.errorBg};
    `}
`;

const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

const FieldLabel = styled.label`
  display: block;
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.textMuted};
  margin-bottom: 7px;
`;

const Input = styled.input`
  ${baseInput}
  height: 44px;
  padding: 0 14px;
`;

const FieldError = styled.p`
  font-size: 0.78rem;
  color: ${T.error};
  margin: 5px 0 0;
  font-family: "Courier New", monospace;
`;

const FieldHint = styled.p`
  font-size: 0.75rem;
  color: ${T.textMuted};
  margin: 5px 0 0;
  line-height: 1.5;
  font-family: "Courier New", monospace;
`;

// ─── Two-col row ──────────────────────────────────────────────────────────────
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Submit button ────────────────────────────────────────────────────────────
const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 24px;
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
  margin-top: 8px;

  &:hover {
    background: #e67020;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(250, 129, 40, 0.3);
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
`;

const SecureNote = styled.p`
  font-size: 0.75rem;
  color: ${T.textMuted};
  text-align: center;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

// ─── Component ────────────────────────────────────────────────────────────────
const Payment = (props) => {
  const [email, setEmail] = useState(props.user?.email || "");
  const [contact, setContact] = useState(props.user?.contact || "");
  const [momoNumber, setMomoNumber] = useState(props.user?.contact || "");
  const [username, setUsername] = useState(props.user?.name || "");

  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [momoContactError, setMomoContactError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [enableSubmit, setEnableSubmit] = useState(false);

  const totalAmount = props.amount?.toFixed(2) || "0.00";

  const validateEmail = (value) => {
    setEmail(value);
    const res = isEmailValid(value);
    setEmailError(res[1] ? res[1] : "");
  };

  const validateContact = (value, type) => {
    const res = isContactValid(value);
    if (type === "momo") {
      setMomoNumber(value);
      setMomoContactError(res[1] ? res[1] : "");
    } else {
      setContact(value);
      setContactError(res[1] ? res[1] : "");
    }
  };

  // Enable submit only when required fields are valid
  useEffect(() => {
    const baseValid = username && email && !emailError && contact && !contactError;
    const momoValid = paymentMethod !== "momo" || (momoNumber && !momoContactError);
    setEnableSubmit(!!(baseValid && momoValid));
  }, [username, email, emailError, contact, contactError, momoNumber, momoContactError, paymentMethod]);

  const handleCheckout = (e) => {
    e.preventDefault();
    const payload = {
      username,
      email,
      contact,
      momoNumber,
    };
    props.checkout?.(payload);
  };

  useEffect(() => {
    if (props.createDiscountStatus) {
      const payload = { username, email, contact, momoNumber };
      props.checkout?.(payload);
    }
  }, [props.createDiscountStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show Paystack widget once checkout API has returned payment details
  if (props.payment) {
    return (
      <Wrapper>
        <Paystack payment={props.payment} package_type={props.package_type} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* ── Order Summary ── */}
      <OrderSummary>
        <SectionTitle>📋 Order Summary</SectionTitle>
        <SummaryRow>
          <SummaryLabel>Package</SummaryLabel>
          <SummaryValue>{props.package_type || "Standard"}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Subtotal</SummaryLabel>
          <SummaryValue>GH&#8373; {totalAmount}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Total</SummaryLabel>
          <TotalValue>GH&#8373; {totalAmount}</TotalValue>
        </SummaryRow>
      </OrderSummary>

      {/* ── Payment Method + Form ── */}
      <PaymentSection>
        <SectionTitle>💳 Payment Method</SectionTitle>

        <PaymentMethodTabs>
          <PaymentTab
            type="button"
            active={paymentMethod === "momo"}
            onClick={() => setPaymentMethod("momo")}
          >
            Mobile Money
          </PaymentTab>
          <PaymentTab
            type="button"
            active={paymentMethod === "card"}
            onClick={() => setPaymentMethod("card")}
          >
            Card Payment
          </PaymentTab>
        </PaymentMethodTabs>

        <form onSubmit={handleCheckout}>
          <TwoCol>
            <FieldGroup>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your full name"
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Email Address</FieldLabel>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                hasError={!!emailError}
                onChange={(e) => validateEmail(e.target.value)}
                required
              />
              {emailError && <FieldError>{emailError}</FieldError>}
            </FieldGroup>
          </TwoCol>

          <FieldGroup>
            <FieldLabel>Contact Number</FieldLabel>
            <Input
              type="tel"
              id="contact"
              name="contact"
              placeholder="+233 20 000 0000"
              value={contact}
              onChange={(e) => validateContact(e.target.value, "cnt")}
              hasError={!!contactError}
              required
            />
            {contactError && <FieldError>{contactError}</FieldError>}
          </FieldGroup>

          {paymentMethod === "momo" && (
            <FieldGroup>
              <FieldLabel>Mobile Money Number</FieldLabel>
              <Input
                type="tel"
                id="momoNumber"
                name="momoNumber"
                placeholder="+233 50 000 0000"
                value={momoNumber}
                onChange={(e) => validateContact(e.target.value, "momo")}
                hasError={!!momoContactError}
                required
              />
              {momoContactError && <FieldError>{momoContactError}</FieldError>}
              <FieldHint>
                We'll send an OTP to this number for payment verification
              </FieldHint>
            </FieldGroup>
          )}

          <SubmitButton type="submit" disabled={!enableSubmit}>
            Pay GH&#8373; {totalAmount} &rarr;
          </SubmitButton>

          <SecureNote>🔒 Secure payment powered by Paystack</SecureNote>
        </form>
      </PaymentSection>
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  user: state.userState.user,
  payment: state.userState.payment,
  createDiscountStatus: state.discountState.createDiscountStatus,
});

const mapDispatchToProps = (dispatch) => ({
  checkout: (payload) => dispatch(checkoutAPI(payload)),
  clearOrder: () => dispatch(setUserOrder(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);