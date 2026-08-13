import { useState } from "react";
import { cn } from "../../utils/cn";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  /** Full name used to derive fallback initials and the accessible label. */
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return initials.toUpperCase();
}

/**
 * Avatar
 *
 * Shared avatar used across the header (profile menu, message previews,
 * anywhere a user needs a face). Renders an image when `src` loads
 * successfully; otherwise falls back to initials on a subtle
 * orange-tinted background. Falls back automatically if the image
 * fails to load (broken URL, 404, offline), not just when `src` is
 * omitted.
 *
 * Example:
 *   <Avatar name="Admin User" src="/avatar.jpg" size="md" />
 */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(src) && !imageError;

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium",
        "bg-orange-50 text-orange-600",
        SIZE_CLASSES[size],
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}