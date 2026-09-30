import React from 'react'

// Картинки с WebP + JPG-фолбэком, фиксированными размерами (нет сдвига вёрстки)
// и ленивой загрузкой ниже первого экрана.
export function TripImage({ card, alt, eager = false, width = 1200, height = 800 }) {
  return (
    <picture>
      {card.imageWebp && <source type="image/webp" srcSet={card.imageWebp} />}
      <img
        src={card.image}
        alt={alt || `${card.title} — ${card.region}`}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}

export function Img({ src, webp, alt, width, height, className = '', eager = false }) {
  return (
    <picture>
      {webp && <source type="image/webp" srcSet={webp} />}
      <img src={src} alt={alt} width={width} height={height} className={className}
           loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </picture>
  )
}
