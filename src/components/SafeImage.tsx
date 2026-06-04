import { useState } from "react";
import type * as React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils.ts";

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackLabel?: string;
  fallbackClassName?: string;
};

export default function SafeImage({
  src,
  alt,
  className,
  fallbackLabel,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className={cn(
          "flex min-h-16 min-w-16 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-pink-50 to-white p-3 text-center text-sm font-black text-pink-500 ring-1 ring-pink-100",
          className,
          fallbackClassName,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-4 w-4 shrink-0" />
        <span className="line-clamp-2">{fallbackLabel || alt || "Image"}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
