import { useState } from "react";
import styled, { keyframes } from "styled-components";
import StarDisplay from "../Shared/StarDisplay";


const BRAND = "#fa8128";
const BRAND_RING = "rgba(250, 129, 40, 0.12)";
const BRAND_RING_ERROR = "rgba(220, 38, 38, 0.1)";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Success State ────────────────────────────────────────────────────────────

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
  animation: ${fadeUp} 0.3s ease both;
`;

const SuccessIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
`;

const SuccessTitle = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 6px;
`;

const SuccessMessage = styled.p`
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.55;
`;

const ResetButton = styled.button`
  margin-top: 16px;
  background: none;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-md);
  padding: 6px 16px;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: border-color 0.18s, color 0.18s;

  &:hover {
    border-color: ${BRAND};
    color: ${BRAND};
  }
`;

// ─── Field Group ──────────────────────────────────────────────────────────────

const FieldGroup = styled.div`
  margin-bottom: ${({ mb }) => mb || "20px"};
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
`;

// ─── Rating ───────────────────────────────────────────────────────────────────

const RatingLabel = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 8px;
`;

// ─── Inputs ───────────────────────────────────────────────────────────────────

const baseInputStyles = `
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-md);
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  &:focus {
    border-color: ${BRAND};
    box-shadow: 0 0 0 3px ${BRAND_RING};
  }
`;

const TextInput = styled.input`
  ${baseInputStyles}
  height: 40px;
  border-color: ${({ $hasError }) =>
    $hasError ? "var(--color-border-danger)" : "var(--color-border-tertiary)"};

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? "var(--color-border-danger)" : BRAND};
    box-shadow: ${({ $hasError }) =>
      $hasError ? `0 0 0 3px ${BRAND_RING_ERROR}` : `0 0 0 3px ${BRAND_RING}`};
  }
`;

const TextArea = styled.textarea`
  ${baseInputStyles}
  resize: vertical;
  min-height: 96px;
  line-height: 1.6;
  border-color: ${({ $hasError }) =>
    $hasError ? "var(--color-border-danger)" : "var(--color-border-tertiary)"};

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? "var(--color-border-danger)" : BRAND};
    box-shadow: ${({ $hasError }) =>
      $hasError ? `0 0 0 3px ${BRAND_RING_ERROR}` : `0 0 0 3px ${BRAND_RING}`};
  }
`;

// ─── Counter Row ──────────────────────────────────────────────────────────────

const CounterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 4px;
`;

const CharCount = styled.span`
  font-size: 11px;
  color: ${({ $warn }) =>
    $warn ? "var(--color-text-warning)" : "var(--color-text-secondary)"};
  margin-left: auto;
  flex-shrink: 0;
`;

// ─── Error ────────────────────────────────────────────────────────────────────

const FieldError = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-text-danger);
  line-height: 1.4;
  flex: 1;
`;

// ─── Submit ───────────────────────────────────────────────────────────────────

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s, transform 0.12s, box-shadow 0.2s;

  background: ${({ disabled }) =>
    disabled ? "var(--color-background-secondary)" : BRAND};
  color: ${({ disabled }) =>
    disabled ? "var(--color-text-secondary)" : "#fff"};

  &:hover:not(:disabled) {
    background: #e67020;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(250, 129, 40, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewForm({
  onSubmit,
  onSuccess,
  onError,
  validate,
  maxLength = 800,
  minLength = 20,
  initialValues = { rating: 0, title: "", content: "" },
  labels = {},
  showSuccessState = true,
}) {
  const {
    ratingLabel      = "Your rating *",
    titleLabel       = "Review title *",
    contentLabel     = "Your review *",
    submitLabel      = "Submit review",
    submittingLabel  = "Submitting...",
    successTitle     = "Thank you for your review!",
    successMessage   = "Your feedback helps others make informed decisions.",
    resetLabel       = "Write another",
  } = labels;

  const [rating,    setRating]    = useState(initialValues.rating);
  const [title,     setTitle]     = useState(initialValues.title);
  const [content,   setContent]   = useState(initialValues.content);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);

  const defaultValidate = () => {
    const e = {};
    if (!rating) e.rating = "Please select a rating";
    if (!title.trim()) e.title = "Title is required";
    if (content.trim().length < minLength)
      e.content = `Review must be at least ${minLength} characters`;
    if (content.length > maxLength)
      e.content = `Review must be under ${maxLength} characters`;
    return e;
  };

  const runValidation = () =>
    validate ? validate({ rating, title, content }) : defaultValidate();

  const handleSubmit = async () => {
    const e = runValidation();
    setErrors(e);
    if (Object.keys(e).length || !onSubmit) return;

    setLoading(true);
    try {
      const result = await onSubmit({ rating, title, content });
      setSubmitted(true);
      onSuccess?.(result);
      if (!showSuccessState) resetForm();
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(initialValues.rating);
    setTitle(initialValues.title);
    setContent(initialValues.content);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted && showSuccessState) {
    return (
      <SuccessWrapper>
        <SuccessIcon>🎉</SuccessIcon>
        <SuccessTitle>{successTitle}</SuccessTitle>
        <SuccessMessage>{successMessage}</SuccessMessage>
        <ResetButton onClick={resetForm}>{resetLabel}</ResetButton>
      </SuccessWrapper>
    );
  }

  return (
    <div>
      {/* Rating */}
      <FieldGroup mb="20px">
        <RatingLabel>{ratingLabel}</RatingLabel>
        <StarDisplay value={rating} size={28} interactive onChange={setRating} />
        {errors.rating && <FieldError>{errors.rating}</FieldError>}
      </FieldGroup>

      {/* Title */}
      <FieldGroup mb="16px">
        <FieldLabel>{titleLabel}</FieldLabel>
        <TextInput
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Summarise your experience"
          $hasError={!!errors.title}
        />
        {errors.title && <FieldError>{errors.title}</FieldError>}
      </FieldGroup>

      {/* Content */}
      <FieldGroup mb="20px">
        <FieldLabel as="label">{contentLabel}</FieldLabel>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Share your experience..."
          $hasError={!!errors.content}
        />
        <CounterRow>
          {errors.content ? (
            <FieldError style={{ margin: 0 }}>{errors.content}</FieldError>
          ) : (
            <span />
          )}
          <CharCount $warn={content.length > maxLength * 0.875}>
            {content.length}/{maxLength}
          </CharCount>
        </CounterRow>
      </FieldGroup>

      {/* Submit */}
      <SubmitButton onClick={handleSubmit} disabled={loading}>
        {loading ? submittingLabel : submitLabel}
      </SubmitButton>
    </div>
  );
}