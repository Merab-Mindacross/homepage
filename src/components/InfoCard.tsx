import { type ReactNode } from "react";

/**
 * CardProps: Properties for the InfoCard component.
 */
export type CardProps = {
  /** Titel der Karte */
  title: string;
  /** SVG-Icon als ReactNode */
  icon: ReactNode;
  /** Stichpunkte als Liste von Strings */
  points: string[];
  /** Zusätzliche CSS-Klassen für die Karte */
  className?: string;
  /** Inline-Styles für die Karte */
  style?: React.CSSProperties;
};

/**
 * InfoCard: Wiederverwendbare Karte mit Titel, SVG-Icon und Stichpunkten.
 * @param {CardProps} props - Die Eigenschaften der Karte
 * @returns {JSX.Element} Die gerenderte Karte
 */
export function InfoCard({
  title,
  icon,
  points,
  className = "",
  style
}: CardProps): React.JSX.Element {
  return (
    <div
      className={`flex-1 flex flex-col items-start gap-5 bg-neutral-800/90 rounded-2xl shadow-2xl border border-[#d6ba6d]/40 p-8 min-w-[220px] max-w-[320px] transition-all duration-300 hover:scale-[1.025] hover:shadow-gold/60 ${className}`}
      style={{
        boxShadow: "0 6px 32px 0 rgba(214,186,109,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.18)",
        ...style
      }}
    >
      <div className="flex items-center gap-4 mb-2">
        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
          {icon}
        </span>
        <h2 className="text-2xl font-extrabold text-[#d6ba6d] tracking-tight drop-shadow-gold">{title}</h2>
      </div>
      <ul className="list-disc list-inside text-gray-100 text-lg leading-relaxed space-y-2 pl-2">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
} 