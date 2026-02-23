import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { loginAPI } from "../../actions";
import { NavLink, useNavigate } from "react-router-dom";
import { isEmailValid, isPasswordValid, isContactValid } from "../../utils/middleware";

// ─── Decorative discount tags for the left panel ─────────────────────────────
const TAGS = [
  { label: "50% OFF",  top: "18%", left: "12%",  rotate: "-14deg", delay: "0s"    },
  { label: "SALE",     top: "32%", left: "68%",  rotate: "10deg",  delay: "0.1s"  },
  { label: "GHS 20",   top: "54%", left: "20%",  rotate: "6deg",   delay: "0.2s"  },
  { label: "30% OFF",  top: "70%", left: "58%",  rotate: "-8deg",  delay: "0.15s" },
  { label: "NEW",      top: "80%", left: "10%",  rotate: "12deg",  delay: "0.25s" },
  { label: "HOT 🔥",   top: "12%", left: "55%",  rotate: "-5deg",  delay: "0.05s" },
];

const Login = (props) => {
  const [email,          setEmail]          = useState("");
  const [contact,        setContact]        = useState("");
  const [password,       setPassword]       = useState("");
  const [loginChoice,    setLoginChoice]    = useState("email");
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [showPassword,   setShowPassword]   = useState(false);
  const [focusedField,   setFocusedField]   = useState(null);

  // errors
  const [emailError,    setEmailError]    = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [contactError,  setContactError]  = useState("");
  const [loginError,    setLoginError]    = useState("");

  const navigate = useNavigate();

  const handleRedirect = (url) => navigate(url || "/");

  const validateEmail   = (v) => { setEmail(v);   setEmailError(isEmailValid(v)[1]     || ""); };
  const validatePassword= (v) => { setPassword(v); setPasswordError(isPasswordValid(v)[1] || ""); };
  const validateContact = (v) => { setContact(v);  setContactError(isContactValid(v)[1]  || ""); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;
    props.signIn({ email, contact, password, rememberMe: keepMeLoggedIn });
  };

  useEffect(() => {
    if (props.errors?.login) setLoginError(props.errors.login);
    if (props.user) handleRedirect(props.previous_url);
  }, [props.errors, props.user, props.previous_url]);

  const canSubmit = password && (loginChoice === "email" ? email : contact);

  return (
    <Page>
      {/* ── Left decorative panel ── */}
      <LeftPanel>
        <PanelGrain />
        <PanelGlow />

        {TAGS.map(({ label, top, left, rotate, delay }) => (
          <FloatingTag key={label} style={{ top, left, transform: `rotate(${rotate})` }} delay={delay}>
            {label}
          </FloatingTag>
        ))}

        <PanelContent>
          <PanelLogo>
            <img src="/images/logo.png" alt="QuickDiscount" />
          </PanelLogo>
          <PanelTagline>
            Ghana's fastest way to<br />
            <PanelAccent>find & run discounts.</PanelAccent>
          </PanelTagline>
          <PanelSub>No wahala. Just deals.</PanelSub>

          <PanelStats>
            <Stat><StatNum>500+</StatNum><StatLabel>Active deals</StatLabel></Stat>
            <StatDivider />
            <Stat><StatNum>50+</StatNum><StatLabel>Categories</StatLabel></Stat>
            <StatDivider />
            <Stat><StatNum>Free</StatNum><StatLabel>To browse</StatLabel></Stat>
          </PanelStats>
        </PanelContent>
      </LeftPanel>

      {/* ── Right form panel ── */}
      <RightPanel>
        <FormCard>
          <FormHeader>
            <Greeting>Welcome back</Greeting>
            <FormSubtitle>Sign in to your QuickDiscount account</FormSubtitle>
          </FormHeader>

          {/* Method toggle */}
          <MethodToggle>
            <MethodBtn
              active={loginChoice === "email"}
              onClick={() => { setLoginChoice("email"); setContact(""); setContactError(""); }}
            >
              Email
            </MethodBtn>
            <MethodBtn
              active={loginChoice === "contact"}
              onClick={() => { setLoginChoice("contact"); setEmail(""); setEmailError(""); }}
            >
              Phone
            </MethodBtn>
            <MethodSlider offset={loginChoice === "contact" ? "50%" : "0%"} />
          </MethodToggle>

          {loginError && <ErrorBanner>{loginError}</ErrorBanner>}

          <FormBody onSubmit={handleLogin}>

            {/* Email or Contact */}
            {loginChoice === "email" ? (
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
            ) : (
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
            )}

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
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </TogglePassword>
              </PasswordWrap>
              {passwordError && <FieldError>{passwordError}</FieldError>}
            </FieldGroup>

            {/* Remember me + Forgot password */}
            <FormMeta>
              <RememberMe>
                <Checkbox
                  type="checkbox"
                  id="rememberMe"
                  checked={keepMeLoggedIn}
                  onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </RememberMe>
              <ForgotLink to="/forgetpassword">Forgot password?</ForgotLink>
            </FormMeta>

            {/* Submit */}
            <SubmitBtn type="submit" disabled={!canSubmit} onClick={handleLogin}>
              Sign in
            </SubmitBtn>
          </FormBody>

          <Divider><DividerLine /><DividerText>or</DividerText><DividerLine /></Divider>

          <SignupPrompt>
            New to QuickDiscount?{" "}
            <SignupLink to="/signup">Create a free account →</SignupLink>
          </SignupPrompt>
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

const float = keyframes`
  0%, 100% { transform: translateY(0)   rotate(var(--r)); }
  50%       { transform: translateY(-8px) rotate(var(--r)); }
`;

const shimmerGlow = keyframes`
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 0.85; }
`;

// ─── Page shell ───────────────────────────────────────────────────────────────

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  padding-top: 70px;              
  font-family: Inter, 'Roboto', sans-serif;
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
  background: radial-gradient(circle, rgba(250, 129, 40, 0.22) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${shimmerGlow} 4s ease-in-out infinite;
  pointer-events: none;
`;

const FloatingTag = styled.div`
  position: absolute;
  background: rgba(250, 129, 40, 0.12);
  border: 1px solid rgba(250, 129, 40, 0.3);
  color: rgba(250, 129, 40, 0.85);
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 6px 12px;
  border-radius: 20px;
  white-space: nowrap;
  --r: ${({ style }) => style?.transform?.match(/rotate\(([^)]+)\)/)?.[1] || '0deg'};
  animation: ${float} ${() => 3 + Math.random() * 2}s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay};
  pointer-events: none;
`;

const PanelContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 48px;
  text-align: left;
  animation: ${fadeUp} 0.7s ease both;
`;

const PanelLogo = styled.div`
  margin-bottom: 36px;
  img {
    height: 56px;
    object-fit: contain;
    filter: brightness(1.1);
  }
`;

const PanelTagline = styled.h2`
  font-size: clamp(1.6rem, 2.5vw, 2.4rem);
  font-weight: 700;
  color: #f5f0e8;
  line-height: 1.2;
  margin: 0 0 12px;
  font-family: Georgia, serif;
  letter-spacing: -0.02em;
`;

const PanelAccent = styled.span`
  color: #fa8128;
`;

const PanelSub = styled.p`
  font-size: 1rem;
  color: rgba(240, 236, 230, 0.45);
  margin: 0 0 40px;
`;

const PanelStats = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatNum = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fa8128;
  font-family: Georgia, serif;
`;

const StatLabel = styled.span`
  font-size: 11px;
  color: rgba(240, 236, 230, 0.4);
  letter-spacing: 0.05em;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 36px;
  background: rgba(240, 236, 230, 0.12);
`;

// ─── Right panel ──────────────────────────────────────────────────────────────

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f7f5;
  padding: 24px;

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

// ─── Form header ──────────────────────────────────────────────────────────────

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

// ─── Method toggle ────────────────────────────────────────────────────────────

const MethodToggle = styled.div`
  position: relative;
  display: flex;
  background: #f0ece8;
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 24px;
`;

const MethodSlider = styled.div`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: ${({ offset }) => `calc(${offset} + 3px)`};
  width: calc(50% - 6px);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  transition: left 0.25s ease;
`;

const MethodBtn = styled.button`
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 9px 0;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  color: ${({ active }) => (active ? "#0e0c0b" : "#999")};
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.2s;
  font-family: inherit;
`;

// ─── Error banner ─────────────────────────────────────────────────────────────

const ErrorBanner = styled.div`
  background: #fff2f2;
  border: 1px solid #ffd5d5;
  border-left: 3px solid #e53e3e;
  color: #c53030;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 18px;
  animation: ${fadeUp} 0.3s ease;
`;

// ─── Form body + fields ───────────────────────────────────────────────────────

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
  top: ${({ raised }) => (raised ? '8px' : '50%')};
  transform: ${({ raised }) => (raised ? 'none' : 'translateY(-50%)')};
  font-size: ${({ raised }) => (raised ? '11px' : '14px')};
  color: ${({ focused }) => (focused ? '#fa8128' : '#aaa')};
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
  border: 1.5px solid ${({ focused }) => (focused ? '#fa8128' : '#e8e4e0')};
  border-radius: 10px;
  font-size: 15px;
  color: #0e0c0b;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  box-shadow: ${({ focused }) => (focused ? '0 0 0 3px rgba(250,129,40,0.1)' : 'none')};
`;

const PasswordWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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

// ─── Form meta row ────────────────────────────────────────────────────────────

const FormMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #666;

  label { cursor: pointer; }
`;

const Checkbox = styled.input`
  width: 15px;
  height: 15px;
  accent-color: #fa8128;
  cursor: pointer;
`;

const ForgotLink = styled(NavLink)`
  font-size: 13px;
  color: #fa8128;
  text-decoration: none;
  font-weight: 500;

  &:hover { color: #e06010; text-decoration: underline; }
`;

// ─── Submit ───────────────────────────────────────────────────────────────────

const SubmitBtn = styled.button`
  width: 100%;
  height: 50px;
  background: ${({ disabled }) => disabled ? "#e0dbd6" : "#fa8128"};
  color: ${({ disabled }) => disabled ? "#b0aaa4" : "#fff"};
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
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

// ─── Divider ──────────────────────────────────────────────────────────────────

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

// ─── Signup prompt ────────────────────────────────────────────────────────────

const SignupPrompt = styled.p`
  text-align: center;
  font-size: 13.5px;
  color: #888;
  margin: 0;
`;

const SignupLink = styled(NavLink)`
  color: #fa8128;
  font-weight: 600;
  text-decoration: none;

  &:hover { color: #e06010; text-decoration: underline; }
`;

// ─── Redux ────────────────────────────────────────────────────────────────────

const mapStateToProps = (state) => ({
  previous_url: state.appState.previous_url,
  user: state.userState.user,
  errors: state.appState.errors,
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (payload) => dispatch(loginAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);