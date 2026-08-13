import { cn } from "../../utils/cn";

export interface PromoBannerProps {
  imageUrl: string;
  storeLabel: string;
  headline: string;
  discountLabel: string;
  onClick?: () => void;
  className?: string;
}
export function PromoBanner({
  imageUrl,
  headline,
  onClick,
  className,
}: PromoBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full overflow-hidden rounded-[10px] text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500",
        className
      )}
    >
      <img
        src={imageUrl}
        alt={headline}
        className="h-54 w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* <div className="absolute left-4 top-4 text-xs font-medium uppercase tracking-wide text-white/80">
        {storeLabel}
      </div> */}

      {/* <div className="absolute bottom-4 left-4">
        <p className="text-lg font-bold uppercase leading-tight text-white">
          {headline}
        </p>
        <span className="mt-1 inline-block rounded bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
          {discountLabel}
        </span>
      </div> */}
    </button>
  );
}