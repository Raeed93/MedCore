import { motion } from 'motion/react';

interface MarqueeProps {
  items: string[];
  speed?: number;
}

export function Marquee({ items, speed = 20 }: MarqueeProps) {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      style={{
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            <span style={{ color: '#fca5a5' }}>•</span>
            <span>{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}