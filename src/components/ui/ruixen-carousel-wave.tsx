'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { samplePhotos } from '@/lib/sample-photos';

interface RuixenCardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  badge?: {
    text: string;
    variant: 'pink' | 'indigo' | 'orange';
  };
  href?: string;
  id?: string;
}

// Convert sample photos to carousel cards
const cards: RuixenCardProps[] = samplePhotos.slice(0, 8).map((photo, index) => ({
  title: photo.location,
  subtitle: photo.caption,
  image: photo.url,
  badge: {
    text: photo.tags[0] || 'Travel',
    variant: ['pink', 'indigo', 'orange'][index % 3] as 'pink' | 'indigo' | 'orange'
  },
  href: '#',
  id: photo.id
}));

export default function Slider_01() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const shift = (direction: 'next' | 'prev') => {
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % cards.length
        : (currentIndex - 1 + cards.length) % cards.length;
    setCurrentIndex(nextIndex);
  };

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        shift('next');
      }, 3000); // 3 seconds between each auto-scroll
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    // Start auto-scroll
    startAutoScroll();

    // Cleanup on unmount
    return () => {
      stopAutoScroll();
    };
  }, [currentIndex]); // Re-run when currentIndex changes

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      let position = i - currentIndex;
      if (position < -Math.floor(cards.length / 2)) {
        position += cards.length;
      } else if (position > Math.floor(cards.length / 2)) {
        position -= cards.length;
      }

      const x = position * 320;
      const y = position === 0 ? 20 : 0;
      const scale = position === 0 ? 1.03 : 0.95;

      if (Math.abs(position) > 2) {
        gsap.set(card, { x, y, scale });
      } else {
        gsap.to(card, {
          x,
          y,
          scale,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });
  }, [currentIndex]);

  const badgeColors = {
    pink: 'bg-pink-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    orange: 'bg-orange-500 text-white',
  };

  return (
    <div 
      className="h-full w-full relative px-6 py-12 overflow-hidden"
      onMouseEnter={() => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current);
          autoScrollRef.current = null;
        }
      }}
      onMouseLeave={() => {
        if (!autoScrollRef.current) {
          autoScrollRef.current = setInterval(() => {
            shift('next');
          }, 3000);
        }
      }}
    >
      <div className="relative flex items-center justify-center h-[400px]">
        {cards.map((card, index) => (
          <div
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute transition-transform"
          >
            <div className="flex flex-col group">
              <Link
                href={card.href ?? '#'}
                className="relative block overflow-hidden rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-tr from-white/50 to-zinc-100 dark:from-zinc-900/40 dark:to-zinc-800/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="relative h-[300px] w-[260px]">
                  <Image
                    src={card.image ?? ''}
                    alt={card.title ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>

                {/* Badge */}
                {card.badge && (
                  <div className="absolute top-4 -left-10 transform -rotate-45">
                    <div
                      className={cn(
                        'px-3 py-0.5 text-xs font-bold shadow-md',
                        badgeColors[card.badge.variant]
                      )}
                    >
                      {card.badge.text}
                    </div>
                  </div>
                )}


              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        <button
          onClick={() => shift('prev')}
          className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:scale-110 transition"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-white" />
        </button>
        <button
          onClick={() => shift('next')}
          className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:scale-110 transition"
        >
          <ChevronRight className="w-5 h-5 text-zinc-700 dark:text-white" />
        </button>
      </div>
    </div>
  );
} 