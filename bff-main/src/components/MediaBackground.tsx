import { useTheme } from "@/lib/theme-context";
import { isVideoUrl } from "@/lib/utils";

interface MediaBackgroundProps {
  src: string;
  transparentSrc?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  active?: boolean;
  isVideo?: boolean;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}

export function MediaBackground({
  src,
  transparentSrc,
  alt = "",
  className = "",
  containerClassName = "",
  isVideo = false,
  loading = "lazy",
  style = {},
}: MediaBackgroundProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const checkVideo = isVideo || isVideoUrl(src);

  // Always use original src untouched in both light and dark themes.
  // Zero background-removal overrides or theme image swapping.
  const displaySrc = src;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        isLight ? "bg-[#F7F7F4]" : "bg-[#070E17]"
      } ${containerClassName}`}
      style={style}
    >
      {checkVideo ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className={`h-full w-full object-cover ${className}`}
        />
      ) : (
        <img
          src={displaySrc}
          alt={alt}
          loading={loading}
          className={`h-full w-full object-cover ${className}`}
        />
      )}
    </div>
  );
}
