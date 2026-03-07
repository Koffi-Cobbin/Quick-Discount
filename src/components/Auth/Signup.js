import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { signUpAPI } from "../../actions";
import { NavLink, useNavigate } from "react-router-dom";
import { isEmailValid, isPasswordValid, isContactValid } from "../../utils/middleware";

// ─── Left panel perks ────────────────────────────────────────────────────────
const PERKS = [
  { icon: "🏷️", title: "Discover deals instantly",   sub: "Browse hundreds of live discounts across Ghana." },
  { icon: "🔔", title: "Never miss a promo",          sub: "Get notified when your favourite shops go on sale." },
  { icon: "📣", title: "Post your own discount",      sub: "Reach thousands of buyers with a QuickDiscount ad." },
  { icon: "💸", title: "It's completely free",        sub: "Create an account and start browsing at no cost." },
];

// ─── Password strength helper ─────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  return score; // 0–4
};

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#e53e3e", "#dd6b20", "#d69e2e", "#38a169"];

// ─── Component ────────────────────────────────────────────────────────────────
const Signup = (props) => {
  const [email,         setEmail]        = useState("");
  const [username,      setUsername]     = useState("");
  const [contact,       setContact]      = useState("");
  const [password,      setPassword]     = useState("");
  const [showPassword,  setShowPassword] = useState(false);
  const [focusedField,  setFocusedField] = useState(null);
  const [activated,     setActivated]    = useState(false);

  // errors
  const [emailError,    setEmailError]    = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [contactError,  setContactError]  = useState("");

  const navigate    = useNavigate();
  const strength    = getStrength(password);
  const canSubmit   = password && email && contact && username && !emailError && !passwordError && !contactError;

  const validateEmail    = (v) => { setEmail(v);    setEmailError(isEmailValid(v)[1]     || ""); };
  const validatePassword = (v) => { setPassword(v); setPasswordError(isPasswordValid(v)[1] || ""); };
  const validateContact  = (v) => { setContact(v);  setContactError(isContactValid(v)[1]  || ""); };

  const handleSignup = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;
    props.signUp({ name: username, email, contact, password });
  };

  useEffect(() => {
    if (props.errors) {
      if (props.errors.email)   setEmailError(props.errors.email[0]);
      if (props.errors.contact) setContactError(props.errors.contact[0]);
    }
  }, [props.errors]);

  useEffect(() => {
    if (props.user) {
      navigate("/");
    } else if (props.activate_user) {
      setActivated(true);
      setTimeout(() => navigate("/login"), 5000);
    }
  }, [props.user, props.activate_user]);

  // ── Activation success screen ──
  if (activated) {
    return (
      <Page>
        <ActivationScreen>
          <ActivationGlow />
          <ActivationIcon>✉️</ActivationIcon>
          <ActivationTitle>Check your email</ActivationTitle>
          <ActivationSub>
            We sent a verification link to <ActivationEmail>{email}</ActivationEmail>.
            <br />Click it to activate your account.
          </ActivationSub>
          <ActivationMeta>Redirecting to login in 5 seconds…</ActivationMeta>
          <ActivationBar />
        </ActivationScreen>
      </Page>
    );
  }

  return (
    <Page>
      {/* ── Left panel ── */}
      <LeftPanel>
        <PanelGrain />
        <PanelGlow />

        <PanelContent>
          <PanelTagline>
            Join thousands of<br />
            <PanelAccent>savvy shoppers & sellers.</PanelAccent>
          </PanelTagline>
          <PanelSub>Free forever. No credit card needed.</PanelSub>

          <PerksList>
            {PERKS.map(({ icon, title, sub }) => (
              <PerkItem key={title}>
                <PerkIcon>{icon}</PerkIcon>
                <PerkText>
                  <PerkTitle>{title}</PerkTitle>
                  <PerkSub>{sub}</PerkSub>
                </PerkText>
              </PerkItem>
            ))}
          </PerksList>
        </PanelContent>
      </LeftPanel>

      {/* ── Right form panel ── */}
      <RightPanel>
        <FormCard>
          <FormHeader>
            <Greeting>Create your account</Greeting>
            <FormSubtitle>Start discovering deals in under a minute</FormSubtitle>
          </FormHeader>

          <FormBody onSubmit={handleSignup}>

            {/* Email */}
            <FieldGroup>
              <InputWrap>
                <FloatingInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  focused={focusedField === "email"}
                  placeholder=""
                  required
                />
                <FloatingLabel
                  htmlFor="email"
                  raised={focusedField === "email" || !!email}
                  focused={focusedField === "email"}
                >Email address</FloatingLabel>
              </InputWrap>
              {emailError && <FieldError>{emailError}</FieldError>}
            </FieldGroup>

            {/* Username */}
            <FieldGroup>
              <InputWrap>
                <FloatingInput
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  focused={focusedField === "username"}
                  placeholder=""
                  required
                />
                <FloatingLabel
                  htmlFor="username"
                  raised={focusedField === "username" || !!username}
                  focused={focusedField === "username"}
                >Username</FloatingLabel>
              </InputWrap>
            </FieldGroup>

            {/* Contact */}
            <FieldGroup>
              <InputWrap>
                <FloatingInput
                  id="contact"
                  type="tel"
                  value={contact}
                  onChange={(e) => validateContact(e.target.value)}
                  onFocus={() => setFocusedField("contact")}
                  onBlur={() => setFocusedField(null)}
                  focused={focusedField === "contact"}
                  placeholder=""
                  required
                />
                <FloatingLabel
                  htmlFor="contact"
                  raised={focusedField === "contact" || !!contact}
                  focused={focusedField === "contact"}
                >Phone number</FloatingLabel>
              </InputWrap>
              {contactError && <FieldError>{contactError}</FieldError>}
            </FieldGroup>

            {/* Password */}
            <FieldGroup>
              <PasswordWrap>
                <FloatingInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  focused={focusedField === "password"}
                  placeholder=""
                  required
                />
                <FloatingLabel
                  htmlFor="password"
                  raised={focusedField === "password" || !!password}
                  focused={focusedField === "password"}
                >Password</FloatingLabel>
                <TogglePassword
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </TogglePassword>
              </PasswordWrap>
              {password && (
                <StrengthRow>
                  <StrengthBars>
                    {[1, 2, 3, 4].map((i) => (
                      <StrengthBar key={i} filled={i <= strength} color={STRENGTH_COLORS[strength]} />
                    ))}
                  </StrengthBars>
                  <StrengthLabel color={STRENGTH_COLORS[strength]}>
                    {STRENGTH_LABELS[strength]}
                  </StrengthLabel>
                </StrengthRow>
              )}
              {passwordError && <FieldError>{passwordError}</FieldError>}
            </FieldGroup>

            {/* Submit */}
            <SubmitBtn type="submit" disabled={!canSubmit} onClick={handleSignup}>
              Create account
            </SubmitBtn>

          </FormBody>

          <Divider><DividerLine /><DividerText>or</DividerText><DividerLine /></Divider>

          <LoginPrompt>
            Already have an account?{" "}
            <LoginLink to="/login">Sign in →</LoginLink>
          </LoginPrompt>
        </FormCard>
      </RightPanel>
    </Page>
  );
};

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmerGlow = keyframes`
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 0.85; }
`;

const fillBar = keyframes`
  from { width: 0%; }
  to   { width: 100%; }
`;

const perkSlide = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Page shell ───────────────────────────────────────────────────────────────

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  padding-top: 70px;               
  font-family: Inter, 'Roboto', sans-serif;
`;

// ─── Activation screen ────────────────────────────────────────────────────────

const ActivationScreen = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0e0c0b;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: ${fadeUp} 0.5s ease;
`;

const ActivationGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(250, 129, 40, 0.18) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${shimmerGlow} 3s ease-in-out infinite;
`;

const ActivationIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const ActivationTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #f5f0e8;
  font-family: Georgia, serif;
  margin: 0 0 16px;
  position: relative;
  z-index: 1;
`;

const ActivationSub = styled.p`
  font-size: 1rem;
  color: rgba(240, 236, 230, 0.55);
  line-height: 1.7;
  max-width: 400px;
  margin: 0 0 32px;
  position: relative;
  z-index: 1;
`;

const ActivationEmail = styled.strong`
  color: #fa8128;
  font-weight: 600;
`;

const ActivationMeta = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: rgba(240, 236, 230, 0.3);
  text-transform: uppercase;
  margin: 0 0 20px;
  position: relative;
  z-index: 1;
`;

const ActivationBar = styled.div`
  width: 200px;
  height: 2px;
  background: rgba(250, 129, 40, 0.2);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: #fa8128;
    animation: ${fillBar} 5s linear forwards;
  }
`;

// ─── Left panel ───────────────────────────────────────────────────────────────

const LeftPanel = styled.div`
  position: relative;
  width: 45%;
  background-color: #0e0c0b;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 860px) { display: none; }
`;

const PanelGrain = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
  pointer-events: none;
`;

const PanelGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(250, 129, 40, 0.18) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${shimmerGlow} 4s ease-in-out infinite;
  pointer-events: none;
`;

const PanelContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 48px;
  animation: ${fadeUp} 0.7s ease both;
`;

const PanelTagline = styled.h2`
  font-size: clamp(1.5rem, 2.5vw, 2.2rem);
  font-weight: 700;
  color: #f5f0e8;
  line-height: 1.2;
  margin: 0 0 10px;
  font-family: Georgia, serif;
  letter-spacing: -0.02em;
`;

const PanelAccent = styled.span`
  color: #fa8128;
`;

const PanelSub = styled.p`
  font-size: 0.9rem;
  color: rgba(240, 236, 230, 0.4);
  margin: 0 0 36px;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.04em;
`;

const PerksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PerkItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  animation: ${perkSlide} 0.5s ease both;
  animation-delay: ${({ children }) => '0s'};

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
`;

const PerkIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
`;

const PerkText = styled.div``;

const PerkTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f5f0e8;
  margin-bottom: 2px;
`;

const PerkSub = styled.div`
  font-size: 12.5px;
  color: rgba(240, 236, 230, 0.4);
  line-height: 1.5;
`;

// ─── Right panel ──────────────────────────────────────────────────────────────

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f7f5;
  padding: 24px;
  overflow-y: auto;

  @media (max-width: 480px) { padding: 16px; }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.04);
  animation: ${fadeUp} 0.5s ease both;

  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 16px;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 28px;
`;

const Greeting = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0e0c0b;
  margin: 0 0 6px;
  font-family: Georgia, serif;
  letter-spacing: -0.02em;
`;

const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: #888;
  margin: 0;
`;

// ─── Form ─────────────────────────────────────────────────────────────────────

const FormBody = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InputWrap = styled.div`
  position: relative;
`;

const FloatingLabel = styled.label`
  position: absolute;
  left: 14px;
  top: ${({ raised }) => (raised ? "8px" : "50%")};
  transform: ${({ raised }) => (raised ? "none" : "translateY(-50%)")};
  font-size: ${({ raised }) => (raised ? "11px" : "14px")};
  color: ${({ focused }) => (focused ? "#fa8128" : "#aaa")};
  pointer-events: none;
  transition: top 0.18s ease, font-size 0.18s ease, color 0.18s ease, transform 0.18s ease;
  background: #fff;
  padding: 0 3px;
  line-height: 1;
  z-index: 1;
`;

const FloatingInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 20px 14px 6px;
  border: 1.5px solid ${({ focused }) => (focused ? "#fa8128" : "#e8e4e0")};
  border-radius: 10px;
  font-size: 15px;
  color: #0e0c0b;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  box-shadow: ${({ focused }) => (focused ? "0 0 0 3px rgba(250,129,40,0.1)" : "none")};
`;

const PasswordWrap = styled.div`
  position: relative;
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #fa8128;
  cursor: pointer;
  padding: 4px;
  letter-spacing: 0.04em;
  font-family: 'Courier New', monospace;

  &:hover { color: #e06010; }
`;

const FieldError = styled.span`
  font-size: 12px;
  color: #e53e3e;
  padding-left: 4px;
`;

// ─── Password strength ────────────────────────────────────────────────────────

const StrengthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 2px 0;
`;

const StrengthBars = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
`;

const StrengthBar = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${({ filled, color }) => (filled ? color : "#e8e4e0")};
  transition: background 0.3s ease;
`;

const StrengthLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  color: ${({ color }) => color};
  letter-spacing: 0.05em;
  min-width: 44px;
  text-align: right;
  transition: color 0.3s ease;
`;

// ─── Submit ───────────────────────────────────────────────────────────────────

const SubmitBtn = styled.button`
  width: 100%;
  height: 50px;
  background: ${({ disabled }) => (disabled ? "#e0dbd6" : "#fa8128")};
  color: ${({ disabled }) => (disabled ? "#b0aaa4" : "#fff")};
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  font-family: inherit;
  letter-spacing: 0.01em;
  margin-top: 4px;

  ${({ disabled }) => !disabled && css`
    &:hover {
      background: #e07010;
      box-shadow: 0 4px 16px rgba(250, 129, 40, 0.35);
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  `}
`;

// ─── Divider + footer ────────────────────────────────────────────────────────

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 20px;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #f0ece8;
`;

const DividerText = styled.span`
  font-size: 12px;
  color: #ccc;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
`;

const LoginPrompt = styled.p`
  text-align: center;
  font-size: 13.5px;
  color: #888;
  margin: 0;
`;

const LoginLink = styled(NavLink)`
  color: #fa8128;
  font-weight: 600;
  text-decoration: none;

  &:hover { color: #e06010; text-decoration: underline; }
`;

// ─── Redux ────────────────────────────────────────────────────────────────────

const mapStateToProps = (state) => ({
  user: state.userState.user,
  errors: state.appState.errors,
  activate_user: state.userState.activate_user,
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (payload) => dispatch(signUpAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);