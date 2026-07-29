export function SegmentedControl({ options, value, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: COLORS.paper,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 999,
        padding: 3,
        gap: 2,
        marginBottom: 18,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 16px",
              borderRadius: 999,
              border: "none",
              background: active ? COLORS.ink : "transparent",
              color: active ? "#fff" : COLORS.inkMuted,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
