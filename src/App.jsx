import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, 
  X, 
  ExternalLink, 
  Code, 
  ShieldCheck, 
  Database, 
  Mail, 
  MapPin, 
  ChevronUp, 
  Download, 
  User, 
  Cpu, 
  Layers, 
  Terminal,
  Globe,
  MessageSquare
} from 'lucide-react';
import SmoothScroll from './SmoothScroll';
import LaptopIntro from './LaptopIntro';
import CinematicBackground from './CinematicBackground';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Navigation states
  const [menuActive, setMenuActive] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isSticky, setIsSticky] = useState(false);

  // Cinematic 3D Laptop Intro State
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.innerWidth < 768;
      return !prefersReducedMotion && !isMobile;
    }
    return false;
  });

  const handleIntroComplete = useCallback(() => {
    console.log('App: handleIntroComplete invoked. Setting showIntro to false.');
    setShowIntro(false);
  }, []);







  // Project filter state
  const [projectFilter, setProjectFilter] = useState('all');

  // Form submission state
  const [formStatus, setFormStatus] = useState({ submitted: false, error: false });

  // Typewriter text rotation
  const words = ['Full-Stack MERN Developer', 'React Developer', 'Ethical Hacker'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[currentWordIndex];
    
    // Typing speeds
    const typeSpeed = isDeleting ? 40 : 85;
    
    const handleType = () => {
      if (!isDeleting) {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        
        if (displayedText.length === currentWord.length) {
          // Pause at full word before deleting
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1));
        
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }
      
      timer = setTimeout(handleType, typeSpeed);
    };

    timer = setTimeout(handleType, typeSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIndex]);

  // Handle scroll events for sticky nav and active section spy
  useEffect(() => {
    const handleScroll = () => {
      // Sticky header
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Scroll Spy
      const sections = document.querySelectorAll('section');
      let current = 'home';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id') || 'home';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP ScrollTrigger Section Transitions (Subtle Depth & Parallax sways)
  useEffect(() => {
    if (showIntro) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll('section');
    sections.forEach((sec) => {
      const container = sec.querySelector('.container');
      if (!container) return;

      gsap.fromTo(container,
        { opacity: 0.25, y: 30, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 1.0,
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [showIntro]);

  // Project List
  const projects = [
    {
      id: 1,
      title: 'Netrave Fashion',
      category: 'fullstack',
      description: 'A premium fashion storefront featuring responsive product grids, collection carousels, and an integrated direct order booking system via WhatsApp API.',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
      tags: ['React', 'Tailwind CSS', 'WhatsApp API', 'E-Commerce'],
      demoLink: 'https://netravefashion.vercel.app/'
    },
    {
      id: 2,
      title: 'Weather App',
      category: 'frontend',
      description: 'A fully responsive live meteorological forecast dashboard fetching third-party API data. Features real-time weather analytics, geographical search, and a neat UI.',
      img: '/img/d928b13082a7ab424985d2c9239684e8.jpg',
      tags: ['React', 'Tailwind API', 'WeatherAPI'],
      demoLink: 'https://weatheratapp.netlify.app/'
    },
    {
      id: 3,
      title: 'Masterfit',
      category: 'fullstack',
      description: 'A modern fitness tracking and trainer administration portal. Features personal client dashboards, exercise library navigation, and trainer schedules.',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      tags: ['React', 'Express.js', 'MongoDB', 'Node.js'],
      demoLink: 'https://masterfit-delta.vercel.app/'
    },
    {
      id: 4,
      title: 'Facebook Login Clone',
      category: 'frontend',
      description: 'Pixel-perfect replication of Facebook\'s landing login authentication interface. Built to practice responsive form states, modern Flex layouts, and exact micro-spacings.',
      img: '/img/turned-gray-laptop-computer.jpg',
      tags: ['HTML', 'Tailwind CSS', 'Mobile First'],
      demoLink: 'https://newprojectclone.netlify.app/'
    },
    {
      id: 5,
      title: 'Lori UAE',
      category: 'frontend',
      description: 'A static corporate services landing website engineered for business logistics in the UAE. Constructed with high loading speed, complete layout responsiveness, and SEO keywords.',
      img: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&auto=format&fit=crop&q=80',
      tags: ['HTML5', 'CSS3', 'Tailwind CSS', 'Static Page'],
      demoLink: 'https://loriauae.com/'
    }
  ];

  const filteredProjects = projectFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === projectFilter);

  // Formspree Submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/mjkaprwy', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setFormStatus({ submitted: true, error: false });
        form.reset();
      } else {
        setFormStatus({ submitted: false, error: true });
      }
    } catch (err) {
      setFormStatus({ submitted: false, error: true });
    }
  };

  return (
    <SmoothScroll>
      {showIntro && <LaptopIntro onComplete={handleIntroComplete} />}
      {!showIntro && <CinematicBackground />}
      <div className={`portfolio-container-wrapper ${showIntro ? 'intro-active' : 'intro-fade-in'}`}>
      {/* Header / Navbar */}
      <header className={isSticky ? 'sticky' : ''}>
        <div className="container header-container">
          <a href="#home" className="logo">
            Arjun <span>Chandran</span>
          </a>

          <button 
            className="menu-toggle" 
            onClick={() => setMenuActive(!menuActive)}
            aria-label="Toggle navigation menu"
          >
            {menuActive ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`navbar ${menuActive ? 'active' : ''}`}>
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'skills', label: 'Skills' },
              { id: 'services', label: 'Services' },
              { id: 'portfolio', label: 'Projects' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={() => setMenuActive(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-tagline">
              <Terminal size={16} /> MERN Stack Developer
            </div>
            <h1 className="hero-title">
              Hi, I am <br />
              <span className="name">Arjun Chandran</span>
            </h1>
            <div className="hero-subtitle">
              And I'm a <span className="typed-text">{displayedText}</span>
            </div>
            <p className="hero-desc">
              A self-taught Full-Stack MERN Developer with a passion for architecting clean, secure, and responsive web systems. I engineer pixel-perfect frontends combined with scalable APIs and database logic.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-primary">
                Let's Talk <Mail size={18} />
              </a>
              <a 
                href="/cv/Arjun_k_k_-_ (15).pdf" 
                download="Arjun_k_k_-_ (15).pdf" 
                className="btn btn-secondary"
              >
                Download CV <Download size={18} />
              </a>
            </div>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/arjun-k-k" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn Profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="https://www.instagram.com/arj_.u__" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram Profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="social-icon" aria-label="GitHub Profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </a>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-border">
              <img 
                src="/img/arjun-profile.jpg" 
                alt="Arjun Profile" 
                className="hero-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=500&h=500&q=80";
                }}
              />
            </div>
            
            {/* Floating Badges */}
            <div className="floating-badge badge-1">
              <div className="floating-badge-icon">
                <Code size={18} />
              </div>
              <div className="floating-badge-info">
                <div>React.js</div>
                <span>Frontend Core</span>
              </div>
            </div>

            <div className="floating-badge badge-2">
              <div className="floating-badge-icon">
                <Database size={18} />
              </div>
              <div className="floating-badge-info">
                <div>MERN Stack</div>
                <span>Full-Stack Web</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Get to Know Me</span>
            <h2 className="section-title">About <span>Me</span></h2>
          </div>

          <div className="about-grid">
            <div className="about-text">
              <h3>Transforming designs into clean, responsive web experiences.</h3>
              <p>
                As an enthusiastic MERN Stack Developer (Fresher), I love bringing designs to life and building interactive web applications. I have built a solid foundation in React, Node.js, Express, and MongoDB by studying modern web patterns and building hands-on projects, focusing on neat code and mobile-friendly layouts.
              </p>
              <p>
                I am constantly learning new concepts, frontend designs, and server management. I am eager to join a team where I can apply my skills, learn from experienced developers, and contribute to building meaningful applications.
              </p>

              <div className="about-stats">
                <div className="stat-item glass-panel">
                  <div className="stat-num">4+</div>
                  <div className="stat-label">Real Projects</div>
                </div>
                <div className="stat-item glass-panel">
                  <div className="stat-num">10+</div>
                  <div className="stat-label">Core Tools</div>
                </div>
                <div className="stat-item glass-panel">
                  <div className="stat-num">24/7</div>
                  <div className="stat-label">Fast Learner</div>
                </div>
              </div>

              <a href="/cv/Arjun_k_k_-_ (15).pdf" download="Arjun_k_k_-_ (15).pdf" className="btn btn-primary">
                Download CV <Download size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills" id="skills">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Technical Stacks</span>
            <h2 className="section-title">My <span>Skills</span></h2>
          </div>

          <div className="skills-grid">
            {/* Frontend Skills */}
            <div className="skill-category glass-panel">
              <h3><Cpu size={20} /> Frontend Stacks</h3>
              <div className="skills-list">
                {[
                  { name: 'React / Next.js', val: '85%' },
                  { name: 'JavaScript (ES6+)', val: '80%' },
                  { name: 'Tailwind CSS', val: '90%' },
                  { name: 'HTML5 & CSS3', val: '95%' }
                ].map((s) => (
                  <div className="skill-item" key={s.name}>
                    <div className="skill-info">
                      <span className="skill-name">{s.name}</span>
                      <span className="skill-percentage">{s.val}</span>
                    </div>
                    <div className="skill-bar-bg">
                      <div className="skill-bar-fill" style={{ width: s.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend & DB Skills */}
            <div className="skill-category glass-panel">
              <h3><Database size={20} /> Backend & DB</h3>
              <div className="skills-list">
                {[
                  { name: 'Node.js', val: '75%' },
                  { name: 'Express.js', val: '80%' },
                  { name: 'MongoDB / Mongoose', val: '75%' },
                  { name: 'REST APIs & Socket.io', val: '70%' }
                ].map((s) => (
                  <div className="skill-item" key={s.name}>
                    <div className="skill-info">
                      <span className="skill-name">{s.name}</span>
                      <span className="skill-percentage">{s.val}</span>
                    </div>
                    <div className="skill-bar-bg">
                      <div className="skill-bar-fill" style={{ width: s.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Stacks & Tools */}
            <div className="skill-category glass-panel">
              <h3><Layers size={20} /> Devops & Audits</h3>
              <div className="skills-list">
                {[
                  { name: 'Git & GitHub Versioning', val: '85%' },
                  { name: 'Penetration Testing Basics', val: '60%' },
                  { name: 'Web Application Security', val: '65%' },
                  { name: 'API Routing & Postman', val: '75%' }
                ].map((s) => (
                  <div className="skill-item" key={s.name}>
                    <div className="skill-info">
                      <span className="skill-name">{s.name}</span>
                      <span className="skill-percentage">{s.val}</span>
                    </div>
                    <div className="skill-bar-bg">
                      <div className="skill-bar-fill" style={{ width: s.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">What I Provide</span>
            <h2 className="section-title">My <span>Services</span></h2>
          </div>

          <div className="services-grid">
            {/* Service 1 */}
            <div className="service-card glass-panel">
              <div className="service-icon-box">
                <Code size={24} />
              </div>
              <h3>Web Development</h3>
              <p>
                Developing pixel-perfect responsive web solutions. Converting design mockups to robust, lightning-fast UI components optimized for desktop, tablet, and mobile views.
              </p>
            </div>

            {/* Service 2 */}
            <div className="service-card glass-panel">
              <div className="service-icon-box">
                <Globe size={24} />
              </div>
              <h3>Full-Stack MERN Apps</h3>
              <p>
                Engineering scalable Node/Express server architectures linked to MongoDB schemas. Hooking up real-time websocket environments and complex backend state routines.
              </p>
            </div>


            {/* Service 4 */}
            <div className="service-card glass-panel">
              <div className="service-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Security Audits</h3>
              <p>
                Testing server endpoints against common OWASP Top 10 vulnerabilities. Suggesting secure HTTP headers, sanitizing fields, and reviewing codebases for potential security gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects / Portfolio Section */}
      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Showcase Portfolio</span>
            <h2 className="section-title">Latest <span>Projects</span></h2>
          </div>

          {/* Project Filtering Buttons */}
          <div className="projects-filter">
            <button 
              className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`}
              onClick={() => setProjectFilter('all')}
            >
              All Projects
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'frontend' ? 'active' : ''}`}
              onClick={() => setProjectFilter('frontend')}
            >
              Frontend UI
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'fullstack' ? 'active' : ''}`}
              onClick={() => setProjectFilter('fullstack')}
            >
              Fullstack & Realtime
            </button>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((proj) => (
              <div className="project-card glass-panel" key={proj.id}>
                <div className="project-img-container">
                  <img 
                    src={proj.img} 
                    alt={proj.title} 
                    className="project-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=500&h=300&q=80";
                    }}
                  />
                  <div className="project-overlay">
                    <a href={proj.demoLink} className="project-link-btn" target="_blank" rel="noopener noreferrer" aria-label="Open Demo">
                      <ExternalLink size={22} />
                    </a>
                  </div>
                </div>
                <div className="project-details">
                  <div className="project-tags">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Reach Out</span>
            <h2 className="section-title">Contact <span>Me</span></h2>
          </div>

          <div className="contact-grid">
            <div className="contact-info-column">
              <h3>Let's build something epic together.</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Have an idea, project blueprint, or full-time opportunity? Fill out the form, or reach out directly. I am active and open for freelance web work.
              </p>

              <div className="contact-info-card glass-panel">
                <div className="contact-info-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-info-details">
                  <p>Email Me</p>
                  <p>arjyouhub@gmail.com</p>
                </div>
              </div>

              <div className="contact-info-card glass-panel">
                <div className="contact-info-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-info-details">
                  <p>My Location</p>
                  <p>Calicut, Kerala</p>
                </div>
              </div>

              <div className="contact-info-card glass-panel">
                <div className="contact-info-icon">
                  <MessageSquare size={20} />
                </div>
                <div className="contact-info-details">
                  <p>Online Socials</p>
                  <p>Active on LinkedIn & IG</p>
                </div>
              </div>
            </div>

            <div className="contact-form-panel glass-panel">
              <form onSubmit={handleFormSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="form-name" className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      id="form-name" 
                      name="name" 
                      className="form-input" 
                      placeholder="e.g. John Doe" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-email" className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      id="form-email" 
                      name="email" 
                      className="form-input" 
                      placeholder="e.g. john@example.com" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-mobile" className="form-label">Mobile Number</label>
                    <input 
                      type="tel" 
                      id="form-mobile" 
                      name="mobileNumber" 
                      className="form-input" 
                      placeholder="e.g. +91 98765 43210" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-subject" className="form-label">Subject</label>
                    <input 
                      type="text" 
                      id="form-subject" 
                      name="subject" 
                      className="form-input" 
                      placeholder="Project discussion" 
                      required 
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label htmlFor="form-message" className="form-label">Message</label>
                    <textarea 
                      id="form-message" 
                      name="message" 
                      className="form-input" 
                      placeholder="Detail your requirements here..." 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>

                {formStatus.submitted && (
                  <p style={{ color: 'var(--color-accent)', marginTop: '1rem', fontWeight: '600', textAlign: 'center' }}>
                    Success! Your message was sent successfully. I will get back to you shortly.
                  </p>
                )}
                {formStatus.error && (
                  <p style={{ color: '#ef4444', marginTop: '1rem', fontWeight: '600', textAlign: 'center' }}>
                    Oops! Something went wrong. Please check your connections and try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-container">
          <div className="footer-text">
            <p>&copy; {new Date().getFullYear()} Arjun Chandran | All Rights Reserved.</p>
          </div>
          <a href="#home" className="footer-scroll-top" aria-label="Scroll back to top">
            <ChevronUp size={20} />
          </a>
        </div>
      </footer>
      </div>
    </SmoothScroll>
  );
}
