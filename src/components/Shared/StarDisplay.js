import { useState } from "react";

export default function StarDisplay({
  value = 0,
  defaultValue = 0,
  max = 5,
  size = 16,
  interactive = false,
  onChange,

  activeColor   = "var(--star-active,   #fa8128)",
  inactiveColor = "var(--star-inactive, rgba(250, 129, 40, 0.25))",
  gap = 2,

  allowHalf = false,
  readOnly = false,

  renderIcon,
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);

  const currentValue  = value ?? internalValue;
  const displayValue  = interactive && !readOnly ? (hover || currentValue) : currentValue;

  const handleSelect = (val) => {
    if (readOnly || !interactive) return;
    if (value === undefined) setInternalValue(val);
    onChange?.(val);
  };

  return (
    <span
      style={{ display: "inline-flex", gap, alignItems: "center" }}
      role={interactive ? "radiogroup" : undefined}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const active    = starValue <= displayValue;

        const icon = renderIcon ? (
          renderIcon({ active, size, index: starValue })
        ) : (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={active ? activeColor : "rgba(250, 129, 40, 0.08)"}
            stroke={active ? activeColor : inactiveColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <path d="M12 2l2.9 6.3 6.8 1-4.9 4.8 1.2 6.9L12 17.8 6 21l1.2-6.9L2.3 9.3l6.8-1L12 2z" />
          </svg>
        );

        return (
          <span
            key={starValue}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? starValue === currentValue : undefined}
            tabIndex={interactive ? 0 : -1}
            style={{
              cursor: interactive && !readOnly ? "pointer" : "default",
              display: "inline-flex",
            }}
            onClick={() => handleSelect(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            onMouseLeave={() => interactive && setHover(0)}
            onKeyDown={(e) => {
              if (!interactive) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(starValue);
              }
            }}
          >
            {icon}
          </span>
        );
      })}
    </span>
  );
}