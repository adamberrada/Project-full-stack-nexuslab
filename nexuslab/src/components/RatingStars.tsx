import React from 'react';

type Props = {
  value: number | string | null | undefined;
  max?: number;
  className?: string;
};

function toClampedInt(value: number | string | null | undefined, max: number) {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const rounded = Math.round(numeric);
  return Math.max(0, Math.min(max, rounded));
}

export function RatingStars({ value, max = 5, className }: Props) {
  const filled = toClampedInt(value, max);
  const empty = Math.max(0, max - filled);

  return (
    <span className={className} aria-label={`Rating ${filled} out of ${max}`}>
      <span aria-hidden="true">{'★'.repeat(filled)}</span>
      <span aria-hidden="true" style={{ opacity: 0.35 }}>
        {'☆'.repeat(empty)}
      </span>
    </span>
  );
}
