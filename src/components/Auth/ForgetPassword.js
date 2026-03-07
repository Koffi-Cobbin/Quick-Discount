import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { forgetPasswordAPI, setLoading, setLoadingMessage } from "../../actions";
import { isEmailValid } from "../../utils/middleware";
import { NavLink, useNavigate } from "react-router-dom";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmerGlow = keyframes`
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 0.85; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const ForgetPassword = (props) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    setEmail(value);
    const emailRes = isEmailValid(value);
    setEmailError(emailRes[1] ? emailRes[1] : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;

    const payload = { email };
    props.forgetPassword(payload);
  };

  useEffect(() => {
    if (props.loading_message) {
      if (props.loading_message === "Check mail to reset password") {
        setSubmitted(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    }
  }, [props.loading_message, navigate]);

  const canSubmit = email && !emailError;

  // ── Success screen ──
  if (submitted) {
    return (
      <Page>
        <LeftPanel>
          <PanelGrain />
          <PanelGlow />
          <PanelContent>
            <PanelTagline>
              No worries,<br />
              <PanelAccent>we've got you covered.</PanelAccent>
            </PanelTagline>
            <PanelSub>Check your email for reset instructions.</PanelSub>
          </PanelContent>
        </LeftPanel>
        <RightPanel>
          <FormCard>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessTitle>Email sent!</SuccessTitle>
            <SuccessSub>
              We've sent password reset instructions to <SuccessEmail>{email}</SuccessEmail>.
            </SuccessSub>
            <RedirectNote>Redirecting to login...</RedirectNote>
          </FormCard>
        </RightPanel>
      </Page>
    );
  }

  return (
    <Page>
      {/* ── Left decorative panel ── */}
      <LeftPanel>
        <PanelGrain />
        <PanelGlow />
        <PanelContent>
          <PanelTagline>
            Forgot your<br />
            <PanelAccent>password?</PanelAccent>
          </PanelTagline>
          <PanelSub>No worries. We'll help you reset it.</PanelSub>
          <BackToLogin>
            Remember your password? <LoginLink to="/login">Sign in</LoginLink>
          </BackToLogin>
        </PanelContent>
      </LeftPanel>

      {/* ── Right form panel ── */}
      <RightPanel>
        <FormCard>
          <FormHeader>
            <Greeting>Reset password</Greeting>
            <FormSubtitle>Enter your email to receive reset instructions</FormSubtitle>
          </FormHeader>

          <FormBody onSubmit={handleSubmit}>
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

            {/* Submit */}
            <SubmitBtn 
              type="submit" 
              disabled={!canSubmit} 
              onClick={handleSubmit}
            >
              Send reset link
            </SubmitBtn>
          </FormBody>

          <Divider>
            <DividerLine />
            <DividerText>or</DividerText>
            <DividerLine />
          </Divider>

          <SignupPrompt>
            New to QuickDiscount?{" "}
            <SignupLink to="/signup">Create a free account →</SignupLink>
          </SignupPrompt>
        </FormCard>
      </RightPanel>
    </Page>
  );
};

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

const PanelContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 48px;
  animation: ${fadeUp} 0.7s ease both;
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

const BackToLogin = styled.p`
  font-size: 13.5px;
  color: rgba(240, 236, 230, 0.4);
  margin: 0;
`;

const LoginLink = styled(NavLink)`
  color: #fa8128;
  font-weight: 600;
  text-decoration: none;

  &:hover { color: #e06010; text-decoration: underline; }
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
  text-align: center;

  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 16px;
  }
`;

// ─── Success state ───────────────────────────────────────────────────────────

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fa8128;
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const SuccessTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0e0c0b;
  margin: 0 0 12px;
  font-family: Georgia, serif;
`;

const SuccessSub = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px;
`;

const SuccessEmail = styled.strong`
  color: #fa8128;
`;

const RedirectNote = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #aaa;
  margin: 0;
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
  text-align: left;
`;

const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: #888;
  margin: 0;
  text-align: left;
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

const FieldError = styled.span`
  font-size: 12px;
  color: #e53e3e;
  padding-left: 4px;
  text-align: left;
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

// ─── Signup prompt ───────────────────────────────────────────────────────────

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
  user: state.userState.user,
  errors: state.appState.errors,
  loading_message: state.appState.loading_message,
});

const mapDispatchToProps = (dispatch) => ({
  forgetPassword: (payload) => dispatch(forgetPasswordAPI(payload)),
  closeLoader: () => {
    dispatch(setLoadingMessage(null));
    dispatch(setLoading(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
