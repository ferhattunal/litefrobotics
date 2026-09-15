import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.hostname.includes("supabase") || url.hostname === "localhost";
  } catch {
    return false;
  }
}

export function PublicImage({ src, alt, className, fill, width, height, sizes, priority }: Props) {
  if (!src) return null;
  const unoptimized = !canOptimize(src);
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || "100vw"}
        className={className}
        unoptimized={unoptimized}
        priority={priority}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 1200}
      height={height || 800}
      sizes={sizes}
      className={className}
      unoptimized={unoptimized}
      priority={priority}
    />
  );
}
