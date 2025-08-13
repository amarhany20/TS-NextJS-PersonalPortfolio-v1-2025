"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Create particles
    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 25000); // Fewer particles

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3, // Smaller particles
          speedX: (Math.random() - 0.5) * 0.3, // Slower movement
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.08 + 0.02, // Ultra-light opacity
          color: `rgba(156, 163, 175, ${Math.random() * 0.05 + 0.01})`, // Very light gray
        });
      }

      particlesRef.current = particles;
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Subtle opacity oscillation
        particle.opacity += (Math.random() - 0.5) * 0.003; // Much smaller oscillation
        particle.opacity = Math.max(0.01, Math.min(0.08, particle.opacity)); // Ultra-light range

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(156, 163, 175, ${particle.opacity})`;
        ctx.shadowBlur = 0; // No glow
        ctx.fill();
      });

      // Skip connection drawing to make it invisible
      // (Connections are now invisible by not drawing them)

      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        background: "transparent",
      }}
    />
  );
}
