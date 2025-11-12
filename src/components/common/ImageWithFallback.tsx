import { useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/assets/JoinUs_Logo.png";

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  onError,
  ...rest
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src ?? fallbackSrc);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setCurrentSrc(fallbackSrc);
    onError?.(event);
  };

  return <img src={currentSrc} alt={alt} onError={handleError} {...rest} />;
}
