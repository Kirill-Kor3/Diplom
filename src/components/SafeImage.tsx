import { useEffect, useMemo, useState } from 'react';

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  kind?: 'product' | 'category';
  loading?: 'eager' | 'lazy';
};

const FALLBACKS = {
  product: '/placeholder-product.svg',
  category: '/placeholder-category.svg',
};

export default function SafeImage({
  src,
  alt,
  className,
  kind = 'product',
  loading = 'lazy',
}: SafeImageProps) {
  const fallback = FALLBACKS[kind];
  const initialSrc = useMemo(() => {
    const trimmed = src?.trim();
    return trimmed || fallback;
  }, [fallback, src]);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setCurrentSrc(fallback)}
    />
  );
}
