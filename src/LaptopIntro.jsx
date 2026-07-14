import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function LaptopIntro({ onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Sync ref when onComplete prop changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050508', 0.03);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 8, 22);
    
    // Smooth camera look target helper
    const lookTarget = new THREE.Vector3(0, 2.0, 0);
    const clock = new THREE.Clock();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. Laptop Meshes
    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0x444654,
      metalness: 0.85,
      roughness: 0.18,
      name: 'Chassis'
    });

    const screenBezelMaterial = new THREE.MeshBasicMaterial({
      color: 0x050505
    });

    // Glass overlay: highly transparent standard gloss
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });

    // Laptop Group
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    // Laptop Base
    const baseGeometry = new THREE.BoxGeometry(10, 0.25, 7);
    const laptopBase = new THREE.Mesh(baseGeometry, aluminumMaterial);
    laptopBase.position.y = 0.125;
    laptopGroup.add(laptopBase);

    // Keyboard Canvas Texture
    const kbCanvas = document.createElement('canvas');
    kbCanvas.width = 512;
    kbCanvas.height = 256;
    const kbCtx = kbCanvas.getContext('2d');
    kbCtx.fillStyle = '#101014';
    kbCtx.fillRect(0, 0, 512, 256);
    kbCtx.strokeStyle = '#202028';
    kbCtx.lineWidth = 2;
    kbCtx.strokeRect(176, 170, 160, 70); // Trackpad
    
    // Draw Keyboard rows
    kbCtx.fillStyle = '#08080a';
    const keyW = 27;
    const keyH = 20;
    const gap = 5;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 14; c++) {
        const x = 38 + c * (keyW + gap);
        const y = 20 + r * (keyH + gap);
        kbCtx.fillRect(x, y, keyW, keyH);
        kbCtx.strokeStyle = 'rgba(99, 102, 241, 0.35)'; // backlighting glow
        kbCtx.lineWidth = 1;
        kbCtx.strokeRect(x, y, keyW, keyH);
      }
    }
    const keyboardTexture = new THREE.CanvasTexture(kbCanvas);
    
    const kbGeometry = new THREE.PlaneGeometry(9.2, 5.8);
    const kbMaterial = new THREE.MeshStandardMaterial({
      map: keyboardTexture,
      roughness: 0.4
    });
    const keyboardPlane = new THREE.Mesh(kbGeometry, kbMaterial);
    keyboardPlane.rotation.x = -Math.PI / 2;
    keyboardPlane.position.y = 0.26;
    keyboardPlane.position.z = 0.2;
    laptopGroup.add(keyboardPlane);

    // Screen Lid Group (Pivot hinge at back center edge)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.2, -3.4);
    laptopGroup.add(lidGroup);

    // Outer Lid Shell
    const outerLidGeometry = new THREE.BoxGeometry(10, 6.8, 0.15);
    const outerLid = new THREE.Mesh(outerLidGeometry, aluminumMaterial);
    outerLid.position.set(0, 3.4, -0.075);
    lidGroup.add(outerLid);

    // Bezel border
    const bezelGeometry = new THREE.BoxGeometry(9.6, 6.4, 0.05);
    const bezel = new THREE.Mesh(bezelGeometry, screenBezelMaterial);
    bezel.position.set(0, 3.4, 0.05);
    lidGroup.add(bezel);

    // Screen Canvas Texture for robust website screenshot mapping
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1536;
    screenCanvas.height = 695;
    const screenCtx = screenCanvas.getContext('2d');
    
    // Fill initially with black
    screenCtx.fillStyle = '#050508';
    screenCtx.fillRect(0, 0, 1536, 695);
    
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.generateMipmaps = false;



    // Load website screenshot
    const image = new Image();
    image.src = '/img/website-screenshot.png';
    let imageLoaded = false;
    image.onload = () => {
      console.log('LaptopIntro: Website screenshot loaded successfully.');
      imageLoaded = true;
    };
    image.onerror = (err) => {
      console.error('LaptopIntro: Failed to load website screenshot image:', err);
    };

    const drawScreen = (time) => {
      // Clear canvas base (dark theme)
      screenCtx.fillStyle = '#050508';
      screenCtx.fillRect(0, 0, 1536, 695);

      if (time < 3.6) {
        // Draw cyber-tech terminal initializing screen
        screenCtx.font = 'bold 38px monospace';
        screenCtx.fillStyle = '#8b5cf6';
        screenCtx.shadowColor = '#8b5cf6';
        screenCtx.shadowBlur = 12;
        screenCtx.fillText('> INITIALIZING NEURAL NET...', 120, 190);

        screenCtx.font = '26px monospace';
        screenCtx.fillStyle = '#3b82f6';
        screenCtx.shadowColor = '#3b82f6';
        screenCtx.fillText('Establishing secure handshake...', 120, 260);
        screenCtx.fillText('Loading system modules...', 120, 310);

        // Pulsing dot loader
        const dots = '.'.repeat(Math.floor(time * 3.5) % 4);
        screenCtx.fillStyle = '#ffffff';
        screenCtx.shadowColor = '#ffffff';
        screenCtx.fillText(`[ CONNECTING${dots} ]`, 120, 370);
        
        // Progress outline
        screenCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        screenCtx.lineWidth = 4;
        screenCtx.strokeRect(120, 420, 600, 32);
        
        // Progress fill
        const barPct = Math.min(time / 3.4, 1.0);
        screenCtx.fillStyle = '#8b5cf6';
        screenCtx.fillRect(122, 422, 596 * barPct, 28);
        screenCtx.shadowBlur = 0; // reset
      } else {
        // Switch to the actual website screenshot
        if (imageLoaded) {
          screenCtx.drawImage(image, 0, 0, 1536, 695);
        } else {
          // Fallback loader text
          screenCtx.font = 'bold 36px monospace';
          screenCtx.fillStyle = '#8b5cf6';
          screenCtx.fillText('> LAUNCHING SYSTEM...', 120, 190);
        }
      }
      screenTexture.needsUpdate = true;
    };

    // Monitor screen mesh matching 1536x695 aspect ratio perfectly
    const screenGeometry = new THREE.PlaneGeometry(9.2, 4.16);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true,
      opacity: 0.0
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.set(0, 3.4, 0.08);
    lidGroup.add(screenMesh);

    // Reflective glass layer
    const glassGeometry = new THREE.PlaneGeometry(9.2, 4.16);
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.position.set(0, 3.4, 0.09);
    lidGroup.add(glassMesh);

    // Close the lid initially
    lidGroup.rotation.x = Math.PI;

    // 5. Ambient Particles Field
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 0.12,
      transparent: true,
      opacity: 0
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Lighting rigs
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.0);
    scene.add(ambientLight);

    const blueRimLight = new THREE.DirectionalLight(0x3b82f6, 0.0);
    blueRimLight.position.set(-15, 5, -10);
    scene.add(blueRimLight);

    const purpleRimLight = new THREE.DirectionalLight(0x8b5cf6, 0.0);
    purpleRimLight.position.set(15, 5, -10);
    scene.add(purpleRimLight);

    const keyLight = new THREE.SpotLight(0xffffff, 0.0, 50, Math.PI / 6, 0.5, 1);
    keyLight.position.set(0, 20, 15);
    scene.add(keyLight);

    // Screen glow pointlight (illuminating keyboard)
    const screenGlowLight = new THREE.PointLight(0x8b5cf6, 0.0, 15);
    screenGlowLight.position.set(0, 2.5, -2.0);
    scene.add(screenGlowLight);

    // 7. GSAP Cinematic Choreography
    console.log('LaptopIntro: Initializing GSAP timeline.');
    const tl = gsap.timeline({
      onComplete: () => {
        console.log('LaptopIntro: GSAP Timeline complete. Fading overlay...');
        gsap.to(container, {
          opacity: 0,
          duration: 0.8,
          ease: 'none',
          onComplete: () => {
            console.log('LaptopIntro: Overlay fade complete. Invoking onComplete()...');
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }
        });
      }
    });

    // Step 1: Materialize laptop from darkness
    tl.to(particleMaterial, { opacity: 0.8, duration: 2.0 }, 0.5)
      .to(ambientLight, { intensity: 0.35, duration: 2.5 }, 0.5)
      .to(keyLight, { intensity: 4.5, duration: 2.5 }, 0.5)
      .to(blueRimLight, { intensity: 2.5, duration: 2.5 }, 0.5)
      .to(purpleRimLight, { intensity: 2.5, duration: 2.5 }, 0.5);

    // Step 2: Camera pans/orbits, lid opens slowly
    tl.to(camera.position, {
      x: 0,
      y: 3.5,
      z: 14,
      duration: 4.5,
      ease: 'power2.inOut'
    }, 1.5);

    tl.to(lookTarget, {
      x: 0,
      y: 2.5,
      z: -1.0,
      duration: 4.5,
      ease: 'power2.inOut'
    }, 1.5);

    tl.to(lidGroup.rotation, {
      x: -Math.PI / 6, // open back by -30 degrees
      duration: 3.5,
      ease: 'back.out(0.8)'
    }, 2.2);

    // Step 3: Screen powers on (Website reveals with glow)
    tl.to(screenMaterial, {
      opacity: 1.0,
      duration: 1.2,
      ease: 'power1.out'
    }, 1.8); // Power on early so user sees loading screen while opening

    tl.to(screenGlowLight, {
      intensity: 3.5,
      duration: 1.2,
      ease: 'power1.out'
    }, 1.8);

    // Step 4: Final zoom directly into the screen center
    // Centered look target relative to tilted screen Y=3.14, Z=-5.10
    tl.to(lookTarget, {
      x: 0,
      y: 3.14,
      z: -5.10,
      duration: 3.5,
      ease: 'power3.in'
    }, 6.0);

    // Camera aligns perpendicular directly in front of the screen: Y=5.65, Z=-0.75
    tl.to(camera.position, {
      x: 0,
      y: 5.65,
      z: -0.75,
      duration: 3.5,
      ease: 'power3.in'
    }, 6.0);

    // 8. Resize logic
    const resize = () => {
      if (!containerRef.current) return;
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);

    // 9. Animation Loop
    let animationFrameId;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      
      particles.rotation.y += 0.002;
      laptopGroup.position.y = Math.sin(Date.now() * 0.001) * 0.12;

      // Update screen text/screenshot only during preloading stage (time < 4.2s)
      // Once loaded, we freeze texture updates to ensure high-performance zoom transitions
      if (elapsed < 4.2) {
        drawScreen(elapsed);
      }

      // Force camera to trace lookTarget helper
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      tl.kill(); // Kill the GSAP timeline to prevent overlapping renders
      baseGeometry.dispose();
      outerLidGeometry.dispose();
      bezelGeometry.dispose();
      screenGeometry.dispose();
      glassGeometry.dispose();
      particleGeometry.dispose();
      
      aluminumMaterial.dispose();
      screenBezelMaterial.dispose();
      glassMaterial.dispose();
      kbMaterial.dispose();
      screenMaterial.dispose();
      particleMaterial.dispose();
      
      keyboardTexture.dispose();
      screenTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="laptop-intro-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050508',
        zIndex: 10000,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%' 
        }} 
      />
    </div>
  );
}
