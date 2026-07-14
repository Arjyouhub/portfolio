import React, { useRef, useEffect } from 'react';

export default function CinematicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes for clean, modern 2D dust motes
    const particleCount = 65;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        baseVx: 0,
        baseVy: 0,
        radius: Math.random() * 2.5 + 1.0,
        alpha: Math.random() * 0.25 + 0.08
      });
      // Store original velocities
      particles[i].baseVx = particles[i].vx;
      particles[i].baseVy = particles[i].vy;
    }

    // Mouse and Touch coordinates tracking
    const pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const onMouseMove = (e) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        pointer.targetX = touch.clientX;
        pointer.targetY = touch.clientY;
      }
    };

    const onMouseLeave = () => {
      pointer.targetX = -1000;
      pointer.targetY = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    // Resize
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Animation Loop
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.002;

      // Clear Canvas (Black theme base)
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Smooth pointer coordinate interpolation
      if (pointer.targetX !== -1000) {
        if (pointer.x === -1000) {
          pointer.x = pointer.targetX;
          pointer.y = pointer.targetY;
        } else {
          pointer.x += (pointer.targetX - pointer.x) * 0.08;
          pointer.y += (pointer.targetY - pointer.y) * 0.08;
        }
      } else {
        pointer.x = -1000;
        pointer.y = -1000;
      }

      // 1. Drifting Ambient Radial Lights (highly optimized 2D gradients)
      const maxDim = Math.max(width, height);
      
      // Light 1 (Blue)
      const l1x = width / 2 + Math.sin(time * 0.8) * (width / 4);
      const l1y = height / 2 + Math.cos(time * 0.6) * (height / 4);
      const grad1 = ctx.createRadialGradient(l1x, l1y, 0, l1x, l1y, maxDim * 0.45);
      grad1.addColorStop(0, 'rgba(59, 130, 246, 0.035)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Light 2 (Purple)
      const l2x = width / 2 - Math.sin(time * 0.5) * (width / 4);
      const l2y = height / 2 - Math.cos(time * 0.8) * (height / 4);
      const grad2 = ctx.createRadialGradient(l2x, l2y, 0, l2x, l2y, maxDim * 0.45);
      grad2.addColorStop(0, 'rgba(139, 92, 246, 0.035)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Render and Drift particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Normal drift movement
        p.x += p.vx;
        p.y += p.vy;

        // Boundaries loop checks
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse coordinates warp repulsion
        if (pointer.x !== -1000) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const force = (130 - dist) / 130;
            // Push points outwards
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 2.8;
            p.y += Math.sin(angle) * force * 2.8;
            
            // Speed up temporarily
            p.vx = p.baseVx + Math.cos(angle) * force * 0.5;
            p.vy = p.baseVy + Math.sin(angle) * force * 0.5;
          } else {
            // Restore default velocities
            p.vx += (p.baseVx - p.vx) * 0.05;
            p.vy += (p.baseVy - p.vy) * 0.05;
          }
        } else {
          p.vx += (p.baseVx - p.vx) * 0.05;
          p.vy += (p.baseVy - p.vy) * 0.05;
        }

        // Draw particle circles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`; // Premium soft violet
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }} 
    />
  );
}
