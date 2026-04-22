import { useState } from "react";

export default function ReplyBox({
  isVisible = true,
  onSubmit,
  onSuccess,
  onError,
  placeholder = "Write a reply...",
  submitLabel = "Post reply",
  cancelLabel = "Cancel",
  triggerLabel = "Reply",
  headerLabel = "Replying",
  initialOpen = false,
  disabled = false,
}) {
  const [open, setOpen] = useState(initialOpen);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async () => {
    if (!content.trim() || !onSubmit) return;

    setLoading(true);
    try {
      const result = await onSubmit(content);

      setContent("");
      setOpen(false);

      onSuccess?.(result);
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          disabled={disabled}
          style={{
            background: "none",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)",
            padding: "5px 12px",
            fontSize: 12,
            color: "var(--color-text-secondary)",
            cursor: "pointer",
          }}
        >
          {triggerLabel}
        </button>
      ) : (
        <div
          style={{
            background: "var(--reply-bg, #f9f9f9)",
            borderRadius: "var(--border-radius-md)",
            padding: 12,
            border: "0.5px solid var(--color-border-tertiary)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {headerLabel}
          </p>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder={placeholder}
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
              fontSize: 13,
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => {
                setOpen(false);
                setContent("");
              }}
              style={{
                background: "none",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-md)",
                padding: "5px 14px",
                fontSize: 12,
                cursor: "pointer",
                color: "var(--color-text-secondary)",
              }}
            >
              {cancelLabel}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              style={{
                background: "var(--reply-primary, #000)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--border-radius-md)",
                padding: "5px 14px",
                fontSize: 12,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 500,
                opacity: content.trim() ? 1 : 0.5,
              }}
            >
              {loading ? "Posting..." : submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}