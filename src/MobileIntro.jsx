import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function MobileIntro({ onComplete }) {
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
    scene.fog = new THREE.FogExp2('#050508', 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);
    
    // Smooth camera look target helper
    const lookTarget = new THREE.Vector3(0, 0, 0);
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

    // 4. Smartphone Materials
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2029, // sleek dark titanium
      metalness: 0.9,
      roughness: 0.18,
      name: 'PhoneChassis'
    });

    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      roughness: 0.25,
      metalness: 0.6
    });

    const buttonMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3d4d,
      metalness: 0.9,
      roughness: 0.15
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });

    const cameraLensMaterial = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.02,
      metalness: 0.98
    });

    // Mobile Phone Group
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Phone Dimensions: Width: 4.0, Height: 8.4, Depth: 0.3
    // Main Chassis Base
    const chassisGeometry = new THREE.BoxGeometry(4.0, 8.4, 0.3);
    const phoneChassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
    phoneGroup.add(phoneChassis);

    // Inner Screen Bezel Layer
    const bezelGeometry = new THREE.BoxGeometry(3.86, 8.26, 0.32);
    const phoneBezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
    phoneGroup.add(phoneBezel);

    // Side Buttons (Power on Right, Volume on Left)
    const powerBtnGeom = new THREE.BoxGeometry(0.04, 0.7, 0.1);
    const powerButton = new THREE.Mesh(powerBtnGeom, buttonMaterial);
    powerButton.position.set(2.02, 0.8, 0);
    phoneGroup.add(powerButton);

    const volUpBtnGeom = new THREE.BoxGeometry(0.04, 0.45, 0.1);
    const volUpButton = new THREE.Mesh(volUpBtnGeom, buttonMaterial);
    volUpButton.position.set(-2.02, 1.2, 0);
    phoneGroup.add(volUpButton);

    const volDownButton = new THREE.Mesh(volUpBtnGeom, buttonMaterial);
    volDownButton.position.set(-2.02, 0.6, 0);
    phoneGroup.add(volDownButton);

    // Camera Module on Back
    const camBumpGeom = new THREE.BoxGeometry(1.4, 1.4, 0.06);
    const camBump = new THREE.Mesh(camBumpGeom, chassisMaterial);
    camBump.position.set(-0.9, 2.8, -0.16);
    phoneGroup.add(camBump);

    // Camera Rings
    const ringGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24);
    ringGeom.rotateX(Math.PI / 2);
    const lensGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.07, 24);
    lensGeom.rotateX(Math.PI / 2);

    const cam1 = new THREE.Mesh(ringGeom, buttonMaterial);
    cam1.position.set(-0.9, 3.15, -0.2);
    const lens1 = new THREE.Mesh(lensGeom, cameraLensMaterial);
    lens1.position.set(-0.9, 3.15, -0.21);
    phoneGroup.add(cam1, lens1);

    const cam2 = new THREE.Mesh(ringGeom, buttonMaterial);
    cam2.position.set(-0.9, 2.45, -0.2);
    const lens2 = new THREE.Mesh(lensGeom, cameraLensMaterial);
    lens2.position.set(-0.9, 2.45, -0.21);
    phoneGroup.add(cam2, lens2);

    const cam3 = new THREE.Mesh(ringGeom, buttonMaterial);
    cam3.position.set(-0.45, 2.8, -0.2);
    const lens3 = new THREE.Mesh(lensGeom, cameraLensMaterial);
    lens3.position.set(-0.45, 2.8, -0.21);
    phoneGroup.add(cam3, lens3);

    // Screen Canvas Texture - Portrait proportions
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 750;
    screenCanvas.height = 1624; // iPhone-like aspect ratio
    const screenCtx = screenCanvas.getContext('2d');
    
    // Fill initially with deep black
    screenCtx.fillStyle = '#050508';
    screenCtx.fillRect(0, 0, 750, 1624);
    
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.generateMipmaps = false;

    // Load mobile screenshot
    const image = new Image();
    image.src = '/img/mobile-screenshot.png';
    let imageLoaded = false;
    image.onload = () => {
      console.log('MobileIntro: Mobile screenshot loaded successfully.');
      imageLoaded = true;
    };
    image.onerror = () => {
      // Fallback: If mobile-screenshot doesn't load or exist, fall back to desktop screenshot
      console.warn('MobileIntro: Failed to load mobile-screenshot.png, trying desktop website-screenshot.png...');
      image.src = '/img/website-screenshot.png';
    };

    const drawScreen = (time) => {
      // Clear canvas base (dark theme)
      screenCtx.fillStyle = '#050508';
      screenCtx.fillRect(0, 0, 750, 1624);

      if (time < 3.6) {
        // Top status bar simulation
        screenCtx.font = 'bold 24px monospace';
        screenCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        screenCtx.fillText('9:41', 50, 60);
        screenCtx.fillText('5G', 610, 60);
        screenCtx.fillText('100%', 660, 60);

        // Draw vertical cyber-tech terminal initializing screen
        screenCtx.font = 'bold 36px monospace';
        screenCtx.fillStyle = '#8b5cf6'; // Indigo/Purple accent
        screenCtx.shadowColor = '#8b5cf6';
        screenCtx.shadowBlur = 10;
        screenCtx.fillText('> INITIALIZING SYSTEM', 60, 250);

        screenCtx.font = '24px monospace';
        screenCtx.fillStyle = '#3b82f6'; // Blue accent
        screenCtx.shadowColor = '#3b82f6';
        screenCtx.fillText('Connecting mobile port...', 60, 330);
        screenCtx.fillText('Loading neural layouts...', 60, 390);
        screenCtx.fillText('Handshake: SECURE', 60, 450);

        // Active processes list
        screenCtx.fillStyle = '#10b981'; // Green
        screenCtx.shadowColor = '#10b981';
        if (time > 1.0) screenCtx.fillText('✔ core_modules.bin [OK]', 60, 530);
        if (time > 1.8) screenCtx.fillText('✔ threejs_core.gl  [OK]', 60, 590);
        if (time > 2.5) screenCtx.fillText('✔ responsive_ui.css [OK]', 60, 650);

        // Pulsing connecting indicator
        const dots = '.'.repeat(Math.floor(time * 3.5) % 4);
        screenCtx.fillStyle = '#ffffff';
        screenCtx.shadowColor = '#ffffff';
        screenCtx.fillText(`[ BOOTING DEVICE${dots} ]`, 60, 750);
        
        // Progress outline
        screenCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        screenCtx.lineWidth = 4;
        screenCtx.strokeRect(60, 830, 630, 24);
        
        // Progress fill
        const barPct = Math.min(time / 3.4, 1.0);
        screenCtx.fillStyle = '#8b5cf6';
        screenCtx.fillRect(62, 832, 626 * barPct, 20);
        screenCtx.shadowBlur = 0; // reset
      } else {
        // Switch to the actual screenshot
        if (imageLoaded) {
          // If screenshot is loaded, draw it. Crop/cover to fit the portrait canvas aspect ratio
          const imgRatio = image.width / image.height;
          const canvasRatio = 750 / 1624;
          
          if (imgRatio > canvasRatio) {
            // Image is wider than canvas (like desktop screenshot fallback)
            const sourceWidth = image.height * canvasRatio;
            const sourceX = (image.width - sourceWidth) / 2;
            screenCtx.drawImage(image, sourceX, 0, sourceWidth, image.height, 0, 0, 750, 1624);
          } else {
            // Image is taller or matches
            const sourceHeight = image.width / canvasRatio;
            screenCtx.drawImage(image, 0, 0, image.width, sourceHeight, 0, 0, 750, 1624);
          }
        } else {
          // Fallback system load message
          screenCtx.font = 'bold 32px monospace';
          screenCtx.fillStyle = '#8b5cf6';
          screenCtx.fillText('> LOADING SYSTEM...', 60, 250);
        }
      }
      screenTexture.needsUpdate = true;
    };

    // Actual Screen Mesh - fitting the bezel dimensions
    const screenGeometry = new THREE.PlaneGeometry(3.72, 8.12);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true,
      opacity: 0.0
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.set(0, 0, 0.165);
    phoneGroup.add(screenMesh);

    // Reflective glass layer
    const glassGeometry = new THREE.PlaneGeometry(3.72, 8.12);
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.position.set(0, 0, 0.175);
    phoneGroup.add(glassMesh);

    // Dynamic Island Pill Mesh (flat on front glass)
    const islandGeom = new THREE.CapsuleGeometry(0.08, 0.22, 12, 12);
    islandGeom.rotateZ(Math.PI / 2); // horizontal pill
    const islandMaterial = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const island = new THREE.Mesh(islandGeom, islandMaterial);
    island.position.set(0, 3.75, 0.18);
    phoneGroup.add(island);

    // Initial position/rotation angles (facing away initially to reveal metal & camera rings)
    phoneGroup.rotation.set(Math.PI / 8, Math.PI * 1.5, 0);

    // 5. Ambient Particles Field
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 0.1,
      transparent: true,
      opacity: 0
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Lighting rigs
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.0);
    scene.add(ambientLight);

    const blueRimLight = new THREE.DirectionalLight(0x3b82f6, 0.0);
    blueRimLight.position.set(-10, 3, -8);
    scene.add(blueRimLight);

    const purpleRimLight = new THREE.DirectionalLight(0x8b5cf6, 0.0);
    purpleRimLight.position.set(10, 3, -8);
    scene.add(purpleRimLight);

    const keyLight = new THREE.SpotLight(0xffffff, 0.0, 40, Math.PI / 6, 0.5, 1);
    keyLight.position.set(0, 15, 10);
    scene.add(keyLight);

    // Screen glow pointlight (casting purple light forwards)
    const screenGlowLight = new THREE.PointLight(0x8b5cf6, 0.0, 10);
    screenGlowLight.position.set(0, 0, 1.5);
    scene.add(screenGlowLight);

    // 7. GSAP Cinematic Choreography
    console.log('MobileIntro: Initializing GSAP timeline.');
    const tl = gsap.timeline({
      onComplete: () => {
        console.log('MobileIntro: GSAP Timeline complete. Fading overlay...');
        gsap.to(container, {
          opacity: 0,
          duration: 0.8,
          ease: 'none',
          onComplete: () => {
            console.log('MobileIntro: Overlay fade complete. Invoking onComplete()...');
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }
        });
      }
    });

    // Step 1: Materialize phone and light setup
    tl.to(particleMaterial, { opacity: 0.8, duration: 2.0 }, 0.5)
      .to(ambientLight, { intensity: 0.45, duration: 2.5 }, 0.5)
      .to(keyLight, { intensity: 4.0, duration: 2.5 }, 0.5)
      .to(blueRimLight, { intensity: 3.0, duration: 2.5 }, 0.5)
      .to(purpleRimLight, { intensity: 3.0, duration: 2.5 }, 0.5);

    // Step 2: Spin/orient phone towards camera
    tl.to(phoneGroup.rotation, {
      x: 0,
      y: Math.PI * 2, // Spin a full 360 degrees to settle flat at 0 degrees
      z: 0,
      duration: 4.8,
      ease: 'power2.inOut'
    }, 1.2);

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 11.5,
      duration: 4.8,
      ease: 'power2.inOut'
    }, 1.2);

    // Step 3: Screen powers on (Website reveals with glow)
    tl.to(screenMaterial, {
      opacity: 1.0,
      duration: 1.0,
      ease: 'power1.out'
    }, 1.8);

    tl.to(screenGlowLight, {
      intensity: 3.0,
      duration: 1.0,
      ease: 'power1.out'
    }, 1.8);

    // Step 4: Final zoom directly into the screen center
    // Centered look target flat on the screen Y=0, Z=0.17
    tl.to(lookTarget, {
      x: 0,
      y: 0,
      z: 0.17,
      duration: 3.2,
      ease: 'power3.in'
    }, 6.0);

    // Camera zooms straight down the barrel into the center of the phone screen
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 4.45, // exact Z distance that matches viewport bounding height of 8.12 at 45 degree FOV
      duration: 3.2,
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
      
      particles.rotation.y += 0.001;
      
      // Floating physics
      // Only float when not performing the final zoom step to avoid alignment issues
      if (elapsed < 6.0) {
        phoneGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.14;
        phoneGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.025;
      } else {
        phoneGroup.position.y = 0;
        phoneGroup.rotation.z = 0;
      }

      // Update screen text/screenshot only during booting stage
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
      tl.kill(); // Prevent overlapping timeline execution
      
      // Dispose geometries
      chassisGeometry.dispose();
      bezelGeometry.dispose();
      powerBtnGeom.dispose();
      volUpBtnGeom.dispose();
      camBumpGeom.dispose();
      ringGeom.dispose();
      lensGeom.dispose();
      screenGeometry.dispose();
      glassGeometry.dispose();
      islandGeom.dispose();
      particleGeometry.dispose();
      
      // Dispose materials
      chassisMaterial.dispose();
      bezelMaterial.dispose();
      buttonMaterial.dispose();
      glassMaterial.dispose();
      cameraLensMaterial.dispose();
      screenMaterial.dispose();
      islandMaterial.dispose();
      particleMaterial.dispose();
      
      // Dispose textures & renderer
      screenTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="mobile-intro-container"
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
