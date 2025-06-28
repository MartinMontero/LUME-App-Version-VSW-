import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  size: number;
  color: string;
  left: number;
  duration: number;
  drift: number;
  opacity: number;
}

export const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = ['glow', 'warm', 'soft', 'spark'];

  useEffect(() => {
    const createParticle = (id: number): Particle => ({
      id,
      size: Math.random() * 4 + 2, // 2-6px
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100, // 0-100%
      duration: Math.random() * 10 + 15, // 15-25s
      drift: (Math.random() - 0.5) * 200, // -100px to 100px drift
      opacity: Math.random() * 0.3 + 0.3 // 0.3-0.6 opacity
    });

    // Create initial particles
    const initialParticles = Array.from({ length: 20 }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    // Add new particles periodically
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle = createParticle(Date.now());
        // Keep only the last 30 particles for performance
        return [...prev.slice(-29), newParticle];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`light-particle ${particle.color}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            '--drift': `${particle.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};