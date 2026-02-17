"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Holo3DShapes from './Holo3DShapes';

export default function HeroBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Shapes
    class Shape3D {
      x: number;
      y: number;
      z: number;
      size: number;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      type: 'cube' | 'pyramid' | 'sphere' | 'torus';
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.z = Math.random() * 1000;
        this.size = Math.random() * 60 + 40;
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.speedZ = (Math.random() - 0.5) * 2;
        this.rotSpeedX = (Math.random() - 0.5) * 0.02;
        this.rotSpeedY = (Math.random() - 0.5) * 0.02;
        this.rotSpeedZ = (Math.random() - 0.5) * 0.02;
        this.type = ['cube', 'pyramid', 'sphere', 'torus'][Math.floor(Math.random() * 4)] as any;
        this.color = ['#ff6b35', '#ff8c42', '#f4a261', '#e76f51', '#d62828'][Math.floor(Math.random() * 5)];
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.z += this.speedZ;
        this.rotationX += this.rotSpeedX;
        this.rotationY += this.rotSpeedY;
        this.rotationZ += this.rotSpeedZ;

        // Wrap around
        if (this.x < -100) this.x = (canvas?.width || 800) + 100;
        if (this.x > (canvas?.width || 800) + 100) this.x = -100;
        if (this.y < -100) this.y = (canvas?.height || 600) + 100;
        if (this.y > (canvas?.height || 600) + 100) this.y = -100;
        if (this.z < -500) this.z = 1000;
        if (this.z > 1000) this.z = -500;
      }

      draw() {
        if (!ctx || !canvas) return;

        const scale = 1000 / (1000 + this.z);
        const x = this.x * scale + canvas.width / 2 * (1 - scale);
        const y = this.y * scale + canvas.height / 2 * (1 - scale);
        const size = this.size * scale;

        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = this.opacity * scale;

        // Draw based on type
        switch (this.type) {
          case 'cube':
            this.drawCube(size);
            break;
          case 'pyramid':
            this.drawPyramid(size);
            break;
          case 'sphere':
            this.drawSphere(size);
            break;
          case 'torus':
            this.drawTorus(size);
            break;
        }

        ctx.restore();
      }

      drawCube(size: number) {
        if (!ctx) return;
        
        // Simple 3D cube wireframe
        const s = size / 2;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        // Front face
        ctx.beginPath();
        ctx.moveTo(-s, -s);
        ctx.lineTo(s, -s);
        ctx.lineTo(s, s);
        ctx.lineTo(-s, s);
        ctx.closePath();
        ctx.stroke();
        
        // Back face (offset)
        const offset = s * 0.5;
        ctx.beginPath();
        ctx.moveTo(-s + offset, -s - offset);
        ctx.lineTo(s + offset, -s - offset);
        ctx.lineTo(s + offset, s - offset);
        ctx.lineTo(-s + offset, s - offset);
        ctx.closePath();
        ctx.stroke();
        
        // Connecting lines
        ctx.beginPath();
        ctx.moveTo(-s, -s);
        ctx.lineTo(-s + offset, -s - offset);
        ctx.moveTo(s, -s);
        ctx.lineTo(s + offset, -s - offset);
        ctx.moveTo(s, s);
        ctx.lineTo(s + offset, s - offset);
        ctx.moveTo(-s, s);
        ctx.lineTo(-s + offset, s - offset);
        ctx.stroke();
      }

      drawPyramid(size: number) {
        if (!ctx) return;
        
        const s = size / 2;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        // Base
        ctx.beginPath();
        ctx.moveTo(-s, s);
        ctx.lineTo(s, s);
        ctx.lineTo(s, s);
        ctx.lineTo(0, s);
        ctx.closePath();
        ctx.stroke();
        
        // Sides to apex
        ctx.beginPath();
        ctx.moveTo(-s, s);
        ctx.lineTo(0, -s);
        ctx.lineTo(s, s);
        ctx.stroke();
      }

      drawSphere(size: number) {
        if (!ctx) return;
        
        // Draw sphere as circles
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        // Main circle
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Horizontal line
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 2, size / 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Vertical line
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 4, size / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      drawTorus(size: number) {
        if (!ctx) return;
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Create shapes
    const shapes: Shape3D[] = [];
    for (let i = 0; i < 30; i++) {
      shapes.push(new Shape3D());
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
      {/* Canvas for 3D shapes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Add the holographic 3D shapes overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Holo3DShapes />
      </div>

      {/* Holographic grid overlay */}
      <div className="absolute inset-0 opacity-20 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Glassmorphism orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,66,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(214,40,40,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Scan lines effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          animation: 'scanlines 8s linear infinite'
        }} />
      </div>

      {/* Holographic light rays */}
      <div className="absolute inset-0 overflow-hidden opacity-30 z-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-full w-1 pointer-events-none"
            style={{
              left: `${20 + i * 20}%`,
              background: 'linear-gradient(180deg, transparent, rgba(255,107,53,0.3), transparent)',
              filter: 'blur(2px)',
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
