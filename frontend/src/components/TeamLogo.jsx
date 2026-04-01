import { useState } from 'react';

export default function TeamLogo({ src, abbrev, className }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className={`flex items-center justify-center text-slate-500 font-bold text-xs ${className}`}>
        {abbrev?.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={abbrev}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
