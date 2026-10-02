import React from "react";

// Curated modern gradient color pairs (Linear / Slack style)
const GRADIENT_PALETTES = [
  { from: "#4f46e5", to: "#06b6d4" }, // Indigo -> Cyan
  { from: "#7c3aed", to: "#ec4899" }, // Violet -> Pink
  { from: "#059669", to: "#10b981" }, // Emerald -> Green
  { from: "#ea580c", to: "#f59e0b" }, // Orange -> Amber
  { from: "#0284c7", to: "#6366f1" }, // Sky -> Indigo
  { from: "#db2777", to: "#f43f5e" }, // Pink -> Rose
  { from: "#2563eb", to: "#9333ea" }, // Blue -> Purple
  { from: "#0d9488", to: "#14b8a6" }, // Teal -> Mint
];

export const Avatar = ({
  user,
  size = "md",
  className = "",
  showBorder = true,
}) => {
  const sizeMap = {
    xs: { dim: "h-6 w-6", text: "text-[10px]" },
    sm: { dim: "h-7 w-7", text: "text-xs" },
    md: { dim: "h-9 w-9", text: "text-xs" },
    lg: { dim: "h-11 w-11", text: "text-sm" },
    xl: { dim: "h-14 w-14", text: "text-base" },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  // Extract display initials (e.g. "Ashish Kumar" -> "AK", "ash456" -> "AS")
  const getInitials = () => {
    if (!user) return "U";
    if (user.fullName && user.fullName.trim().length > 0) {
      const parts = user.fullName.trim().split(" ");
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user.username && user.username.trim().length > 0) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user.email && user.email.trim().length > 0) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  // Deterministic palette selection based on user string hash
  const getPalette = () => {
    const seed = user?.username || user?.fullName || user?.email || "default";
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return GRADIENT_PALETTES[Math.abs(hash) % GRADIENT_PALETTES.length];
  };

  const rawUrl = user?.avatar?.url || user?.avatar;
  const isInvalidPlaceholder =
    !rawUrl ||
    typeof rawUrl !== "string" ||
    rawUrl.includes("placehold.co") ||
    rawUrl.includes("via.placeholder") ||
    rawUrl.includes("placeholder.com") ||
    rawUrl.includes("200x200");

  const borderStyle = showBorder
    ? "ring-2 ring-slate-200/80 dark:ring-slate-800"
    : "";

  // Render actual custom image if uploaded by the user
  if (rawUrl && !isInvalidPlaceholder) {
    return (
      <img
        src={rawUrl}
        alt={user?.fullName || user?.username || "User avatar"}
        onError={(e) => {
          // Graceful fallback to CSS gradient avatar on image load failure
          e.target.style.display = "none";
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = "flex";
          }
        }}
        className={`rounded-full object-cover shrink-0 ${selectedSize.dim} ${borderStyle} ${className}`}
      />
    );
  }

  const palette = getPalette();
  const initials = getInitials();

  return (
    <div
      title={user?.fullName || user?.username || "User"}
      style={{
        background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
      }}
      className={`flex items-center justify-center rounded-full font-bold text-white shadow-xs select-none shrink-0 ${selectedSize.dim} ${selectedSize.text} ${borderStyle} ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;