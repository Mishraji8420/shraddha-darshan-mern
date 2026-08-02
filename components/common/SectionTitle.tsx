"use client";

interface SectionTitleProps {
  badge: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
  center = true,
}: SectionTitleProps) {
  return (
    <div
      className={`mb-10 ${
        center
          ? "flex flex-col items-center text-center"
          : "flex flex-col items-start text-left"
      }`}
    >
      {/* Badge */}

      <span className="inline-flex items-center rounded-full border border-yellow-400/15 bg-yellow-400/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[2px] text-yellow-400">
        {badge}
      </span>

      {/* Title */}

      <h2
        className={`section-title mt-4 max-w-4xl text-white ${
          center ? "mx-auto" : ""
        }`}
      >
        {title}
      </h2>

      {/* Divider */}

      <div className="mt-4 h-[2px] w-14 rounded-full bg-yellow-400" />

      {/* Subtitle */}

      {subtitle && (
        <p
          className={`body-text mt-4 ${
            center ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}