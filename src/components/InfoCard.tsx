import { type ReactNode, type JSX } from "react";

/**
 * CardProps: Properties for the InfoCard component.
 */
export type CardProps = {
  /** Titel der Karte */
  title: string;
  /** SVG-Icon als ReactNode */
  icon: ReactNode;
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
  className = "",
  style
}: CardProps): React.JSX.Element {
  return (
    <div
      className={`flex-1 flex flex-col items-start gap-5 bg-neutral-800/90 rounded-lg  w-full p-2 min-w-[220px] max-w-[320px] transition-all duration-300 hover:scale-[1.025] hover:shadow-gold/60 ${className} md:min-w-[520px]`}
      style={{
        boxShadow: "0 6px 30px 0 rgba(214,186,109,0.05), 0 1.5px 8px 0 rgba(0,0,0,0.08)",
        ...style
      }}
    >
      <div className="flex items-center gap-4">
        <span className="min-w-12 h-12 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
          {icon}
        </span>
        <h2 className="text-sm font-regular  tracking-tight drop-shadow-gold md:text-lg">{title}</h2>
      </div>
    </div>
  );
}

/**
 * ExpandableCardProps: Properties for the ExpandableCard component.
 */
export type ExpandableCardProps = {
  /** Title of the card */
  title: string;
  /** SVG icon as ReactNode or file path string */
  icon: ReactNode | string;
  /** Bullet points (shown only when expanded) */
  points: string[];
  /** Benefit section (ReactNode or string) */
  benefit: ReactNode | string;
  /** Whether the card is open (controlled) */
  open: boolean;
  /** Callback when the card is toggled */
  onToggle: () => void;
  /** Additional CSS classes for the card */
  className?: string;
  /** Inline styles for the card */
  style?: React.CSSProperties;
};

