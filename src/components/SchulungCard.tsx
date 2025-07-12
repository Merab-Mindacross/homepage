
/**
 * SchulungCardProps: Properties for the SchulungCard component.
 */
export type SchulungCardProps = {
  /** Title of the training */
  title: string;
  /** Category chip text (e.g., "Grundlagen", "Qualitätsmanagement") */
  category: string;
  /** Description of the training */
  description: string;
  /** Additional CSS classes for the card */
  className?: string;
  /** Inline styles for the card */
  style?: React.CSSProperties;
};

/**
 * SchulungCard: Training card with category chip in top right corner.
 * @param {SchulungCardProps} props - The properties of the training card
 * @returns {JSX.Element} The rendered training card
 */
export function SchulungCard({
  title,
  category,
  description,
  className = "",
  style
}: SchulungCardProps): React.JSX.Element {
  return (
    <div
      className={`flex-1 flex flex-col items-start gap-4 bg-neutral-800/90 rounded-lg w-full p-4 md:p-6 max-w-full transition-all duration-300 hover:scale-[1.025] hover:shadow-gold/60 relative ${className}`}
      style={{
        boxShadow: "0 6px 30px 0 rgba(214,186,109,0.05), 0 1.5px 8px 0 rgba(0,0,0,0.08)",
        ...style
      }}
    >
      {/* Category chip positioned in top right, with responsive margin */}
      <div className="absolute right-3 -top-3 md:-top-3 backdrop-blur-2xl">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-[#d6ba6d]/20 text-[#d6ba6d] rounded-full border border-[#d6ba6d]/30">
          {category}
        </span>
      </div>
      
      {/* Content with padding to avoid overlap with chip */}
      <div className="w-full pr-20">
        <h2 className="text-sm font-semibold tracking-tight drop-shadow-gold md:text-lg text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
} 