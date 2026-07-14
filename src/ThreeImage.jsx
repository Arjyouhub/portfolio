import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeImage({ src, className, style }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ hover: 0, targetHover: 0 });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let animationFrameId;

    // Dimensions
    let width = container.clientWidth || 320;
    let height = container.clientHeight || 420;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2,
      height / 2, height / -2,
      1, 1000
    );
    camera.position.z = 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Load Texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load(src, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      // Trigger a re-render/resize checks once loaded
      resize();
    });

    // Custom Shader Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uHover: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uHover;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          
          // Liquid waves on hover
          float waveX = sin(uv.y * 8.0 + uTime * 2.5) * 0.03 * uHover;
          float waveY = cos(uv.x * 8.0 + uTime * 2.5) * 0.03 * uHover;
          
          vec2 distortedUv = vec2(uv.x + waveX, uv.y + waveY);
          
          // Keep UV boundaries intact
          distortedUv = clamp(distortedUv, 0.0, 1.0);
          
          vec4 color = texture2D(uTexture, distortedUv);
          
          // Monochrome translation
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          
          // Cool duotone overlay (blue/violet)
          vec3 duotone = vec3(gray);
          duotone.r = gray * 0.65;
          duotone.g = gray * 0.72;
          duotone.b = gray * 1.25;
          
          // Smooth blend between monochrome duotone and original color on hover
          vec3 finalColor = mix(duotone, color.rgb, uHover);
          
          gl_FragColor = vec4(finalColor, color.a);
        }
      `,
      transparent: true
    });

    // Plane Geometry
    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize Handler
    const resize = () => {
      if (!containerRef.current) return;
      width = container.clientWidth;
      height = container.clientHeight;

      renderer.setSize(width, height);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();

      // Update plane size
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(width, height);
    };

    window.addEventListener('resize', resize);

    // Hover Listeners on the container
    const onMouseEnter = () => {
      mouseRef.current.targetHover = 1.0;
    };
    const onMouseLeave = () => {
      mouseRef.current.targetHover = 0.0;
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.05;
      material.uniforms.uTime.value = time;

      // Smooth interpolation for hover state
      mouseRef.current.hover += (mouseRef.current.targetHover - mouseRef.current.hover) * 0.08;
      material.uniforms.uHover.value = mouseRef.current.hover;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (container) {
        container.removeEventListener('mouseenter', onMouseEnter);
        container.removeEventListener('mouseleave', onMouseLeave);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [src]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        ...style 
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        }} 
      />
    </div>
  );
}
