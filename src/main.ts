import './index.css';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise lucide icons
    // We are using a CDN script that provides window.lucide
    if ((window as any).lucide) {
        (window as any).lucide.createIcons();
    }

    // 2. Fetch SVG background
    fetch('/assets/cerchi.svg')
        .then(res => res.text())
        .then(html => {
            const container = document.querySelector('.eutekne-svg-container');
            if (container) container.innerHTML = html;
        })
        .catch(err => console.error("Could not load cerchi.svg:", err));

    // 3. Scroll tracking for navbar styling & active section
    const navLinks = document.querySelectorAll('.nav-link');
    const subnav = document.getElementById('sticky-subnav');
    const sections = ['informazione', 'professione', 'formazione', 'supporto', 'eutekne-ai', 'contact-form'];

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Subnav styling
        if (subnav) {
            if (scrollY > 50) {
                subnav.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
                subnav.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                subnav.style.backdropFilter = "blur(12px)";
                subnav.style.webkitBackdropFilter = "blur(12px)";
                subnav.style.paddingTop = "8px";
                subnav.style.paddingBottom = "8px";
            } else {
                subnav.style.backgroundColor = "rgba(255, 255, 255, 0)";
                subnav.style.boxShadow = "none";
                subnav.style.backdropFilter = "blur(0px)";
                subnav.style.webkitBackdropFilter = "blur(0px)";
                subnav.style.paddingTop = "16px";
                subnav.style.paddingBottom = "16px";
            }
        }

        // Active section tracking
        let current = '';
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 100) {
                    current = section;
                }
            }
        }
        
        navLinks.forEach(link => {
            const id = link.getAttribute('href')?.substring(1);
            const indicator = link.querySelector('.nav-indicator');
            if (id === current) {
                link.classList.add('text-[var(--color-brand-primary)]');
                link.classList.remove('text-text-secondary');
                if (indicator) indicator.classList.remove('hidden');
            } else {
                link.classList.remove('text-[var(--color-brand-primary)]');
                link.classList.add('text-text-secondary');
                if (indicator) indicator.classList.add('hidden');
            }
        });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 4. Smooth scrolling for anchor links
    const handleSmoothScroll = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a');
        if (!target) return;
        
        const href = target.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            const elementId = href.substring(1);
            const element = document.getElementById(elementId);
            
            if (element) {
                e.preventDefault();
                const navbarHeight = 176;
                const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - window.scrollY - navbarHeight + window.scrollY;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800; // ms
                let start: number | null = null;
                
                window.requestAnimationFrame(function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const easeProgress = progress / duration;
                    const easing = easeProgress < 0.5 
                        ? 8 * Math.pow(easeProgress, 4)
                        : 1 - Math.pow(-2 * easeProgress + 2, 4) / 2;
                        
                    window.scrollTo(0, startPosition + distance * easing);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        window.scrollTo(0, targetPosition);
                    }
                });
            }
        }
    };
    document.addEventListener('click', handleSmoothScroll);

    // 5. Intersection Observer for trigger animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    (child as HTMLElement).style.transitionDelay = `${index * 150}ms`;
                    requestAnimationFrame(() => {
                        child.classList.add('active');
                    });
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stagger-container').forEach(container => {
        staggerObserver.observe(container);
    });

    // Observe stray reveal elements not inside stagger-containers
    document.querySelectorAll('.reveal:not(.stagger-container .reveal)').forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Form submission handling
    const contactForm = document.getElementById('contact-form-el') as HTMLFormElement;
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = '/thank-you.html';
        });
    }

    // 7. Modal Handlers
    const modal = document.getElementById('card-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalIconBox = document.getElementById('modal-icon-box');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    const openModal = (cardData: { icon: string, title: string, text: string }) => {
        if (!modal || !modalTitle || !modalText || !modalIconBox) return;
        
        modalTitle.textContent = cardData.title + '.';
        modalText.textContent = cardData.text;
        
        modalIconBox.innerHTML = `<i data-lucide="${cardData.icon}" class="h-8 w-8 mb-4 text-[var(--color-brand-primary)]"></i>`;
        
        if ((window as any).lucide) {
           (window as any).lucide.createIcons({ root: modalIconBox });
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.querySelectorAll('.card-trigger').forEach(card => {
        card.addEventListener('click', () => {
            const icon = card.getAttribute('data-icon') || 'square';
            const title = card.getAttribute('data-title') || '';
            const text = card.getAttribute('data-text') || '';
            openModal({ icon, title, text });
        });
    });

    // 8. Horizontal Scroll Buttons
    document.querySelectorAll('[data-scroll-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = btn.getAttribute('data-scroll-target');
            const amount = parseInt(btn.getAttribute('data-scroll-amount') || '0', 10);
            if (targetId) {
                const container = document.getElementById(targetId);
                if (container) {
                    container.scrollBy({ left: amount, behavior: 'smooth' });
                }
            }
        });
    });
});
