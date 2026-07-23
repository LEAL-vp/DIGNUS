document.addEventListener('DOMContentLoaded', () => {
    
    // Configura o padding de scroll dinamicamente para compensar o header fixo
    document.documentElement.style.scrollPaddingTop = '80px';

    /* ==========================================================================
       HEADER SCROLL EFFECT (Navbar fixa/borrada)
       ========================================================================== */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Executa inicialização caso o usuário recarregue a página já com scroll

    /* ==========================================================================
       MOBILE MENU (Hamburguer toggle)
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenu.setAttribute('aria-hidden', isExpanded);
        
        // Bloqueia scroll do body com menu mobile aberto
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em qualquer link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       FAQ ACCORDION LOGIC
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha outros itens de FAQ abertos (estilo acordeão único)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                }
            });
            
            // Alterna o estado do item atual
            if (isActive) {
                item.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================================================
       PORTFOLIO CAROUSEL / SLIDER LOGIC
       ========================================================================== */
    const pTrack = document.getElementById('portfolioTrack');
    const pSlides = Array.from(pTrack.children);
    const pPrevBtn = document.getElementById('portfolioPrev');
    const pNextBtn = document.getElementById('portfolioNext');
    const pIndicatorsContainer = document.getElementById('portfolioIndicators');
    const pIndicators = Array.from(pIndicatorsContainer.children);
    
    let pCurrentIndex = 0;
    
    // Retorna a quantidade de slides visíveis com base no tamanho da tela
    const getSlidesVisible = () => {
        const w = window.innerWidth;
        if (w >= 992) return 3;
        if (w >= 650) return 2;
        return 1;
    };
    
    // Atualiza a posição do carrossel do portfólio
    const updatePortfolioCarousel = () => {
        const visible = getSlidesVisible();
        const maxIndex = pSlides.length - visible;
        
        if (pCurrentIndex > maxIndex) pCurrentIndex = maxIndex;
        if (pCurrentIndex < 0) pCurrentIndex = 0;
        
        // Translada o track em porcentagem proporcional aos slides visíveis
        const percent = pCurrentIndex * (100 / visible);
        pTrack.style.transform = `translateX(-${percent}%)`;
        
        // Atualiza os indicadores ativos
        pIndicators.forEach((indicator, i) => {
            if (i === pCurrentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
            
            // Oculta indicadores que ultrapassam o índice máximo útil
            if (i > maxIndex) {
                indicator.style.display = 'none';
            } else {
                indicator.style.display = 'block';
            }
        });
    };
    
    // Eventos de clique nas setas de navegação
    pNextBtn.addEventListener('click', () => {
        pCurrentIndex++;
        updatePortfolioCarousel();
    });
    
    pPrevBtn.addEventListener('click', () => {
        pCurrentIndex--;
        updatePortfolioCarousel();
    });
    
    // Eventos de clique nos indicadores
    pIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pCurrentIndex = index;
            updatePortfolioCarousel();
        });
    });
    
    // Atualiza o carrossel em caso de redimensionamento da janela
    window.addEventListener('resize', updatePortfolioCarousel);
    
    // Inicialização do Portfólio Carousel
    updatePortfolioCarousel();

    // ---- SUPORTE A SWIPE/DRAG NO CARROSSEL DE PORTFÓLIO ----
    let startX = 0;
    let isDragging = false;
    
    const handleDragStart = (e) => {
        isDragging = true;
        startX = getPositionX(e);
        pTrack.style.transition = 'none'; // desativa transição durante o arrastar
    };
    
    const handleDragMove = (e) => {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const diffX = currentX - startX;
        const visible = getSlidesVisible();
        const trackWidth = pTrack.parentElement.offsetWidth;
        
        // Converte pixel arrastado em porcentagem
        const diffPercent = (diffX / trackWidth) * 100;
        const basePercent = -pCurrentIndex * (100 / visible);
        pTrack.style.transform = `translateX(${basePercent + diffPercent}%)`;
    };
    
    const handleDragEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        pTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        const endX = getPositionX(e);
        const diffX = endX - startX;
        
        // Se arrastou mais de 50px, muda de slide
        if (diffX < -50) {
            pCurrentIndex++;
        } else if (diffX > 50) {
            pCurrentIndex--;
        }
        updatePortfolioCarousel();
    };
    
    const getPositionX = (e) => {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    };
    
    const wrapper = pTrack.parentElement;
    // Eventos Touch
    wrapper.addEventListener('touchstart', handleDragStart, { passive: true });
    wrapper.addEventListener('touchmove', handleDragMove, { passive: true });
    wrapper.addEventListener('touchend', handleDragEnd);
    // Eventos Mouse
    wrapper.addEventListener('mousedown', handleDragStart);
    wrapper.addEventListener('mousemove', handleDragMove);
    wrapper.addEventListener('mouseup', handleDragEnd);
    wrapper.addEventListener('mouseleave', () => { if (isDragging) handleDragEnd(); });

    /* ==========================================================================
       GSAP + SCROLLTRIGGER ANIMATIONS
       ========================================================================== */
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // ---- ANIMAÇÕES HERO (Flutuação de mockups) ----
        gsap.to('.mockup-notebook', {
            y: -12,
            rotation: 0.5,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
        
        gsap.to('.mockup-tablet', {
            y: 8,
            rotation: -0.8,
            duration: 2.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 0.3
        });
        
        gsap.to('.mockup-phone', {
            y: -10,
            rotation: 1,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 0.6
        });

        // ---- ANIMAÇÕES DE REVEAL (ScrollTrigger) ----
        
        // Elementos Fade In
        document.querySelectorAll('.reveal-fade').forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0 }, 
                {
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Elementos Slide Up
        document.querySelectorAll('.reveal-slide-up').forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 40 }, 
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Cascata (Stagger) nos Cards de Diferenciais
        if (document.querySelector('.diferenciais-grid')) {
            gsap.fromTo('.diferencial-card', 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.diferenciais-grid',
                        start: 'top 82%'
                    }
                }
            );
        }

        // Cascata (Stagger) nos Cards de Selos de Credibilidade
        if (document.querySelector('.seals-grid')) {
            gsap.fromTo('.seal-card', 
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.seals-grid',
                        start: 'top 85%'
                    }
                }
            );
        }

        // Cascata (Stagger) nos Cards de Segmentos Atendidos
        if (document.querySelector('.segmentos-grid')) {
            gsap.fromTo('.segmento-card', 
                { opacity: 0, scale: 0.95, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.segmentos-grid',
                        start: 'top 82%'
                    }
                }
            );
        }
    } else {
        // Fallback básico caso o CDN do GSAP falhe (ativa classes por padrão)
        document.querySelectorAll('.reveal-fade, .reveal-slide-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    /* ==========================================================================
       ACTIVE NAV LINK HIGHLIGHT ON SCROLL (IntersectionObserver)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const mobileLinksList = document.querySelectorAll('.mobile-menu .mobile-link');

    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -55% 0px', // Ativa no centro da tela
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Atualiza links desktop
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Atualiza links mobile
                mobileLinksList.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    /* ==========================================================================
       SMOOTH PAGE ANCHOR LINKS (Com compensação de Offset do Header)
       ========================================================================== */
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignora hash vazio
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Fecha menu mobile se estiver aberto
                if (this.classList.contains('mobile-link')) {
                    if (mobileMenu.classList.contains('active')) {
                        toggleMenu();
                    }
                }
                
                // Rola suavemente até o elemento compensando os 80px do menu fixo
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
