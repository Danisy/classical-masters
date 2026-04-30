document.addEventListener("DOMContentLoaded", () => {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if(preloader) preloader.classList.add('hidden');
        }, 1500); // Extra time to ensure cinematic feel
    });

    // Fallback just in case
    setTimeout(() => {
        if(preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 5000);

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.querySelector('.theme-label');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'classical') {
                document.documentElement.removeAttribute('data-theme');
                themeLabel.textContent = 'Romantic';
            } else {
                document.documentElement.setAttribute('data-theme', 'classical');
                themeLabel.textContent = 'Classical';
            }
    }

    // --- Sidebar Toggle ---
    const burgerMenu = document.getElementById('burger-menu');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (burgerMenu && sidebar && closeSidebarBtn && sidebarOverlay) {
        function openSidebar() {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        }

        burgerMenu.addEventListener('click', openSidebar);
        closeSidebarBtn.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    // --- Video Autoplay Fallback (iOS Low Power Mode) ---
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        document.body.addEventListener('touchstart', () => {
            if (heroVideo.paused) {
                heroVideo.play().catch(e => console.log('Video play prevented:', e));
            }
        }, { once: true });
    }

    // --- Mobile Tooltip Toggle ---
    const tooltips = document.querySelectorAll('.hotspot, .map-pin');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('click', function(e) {
            // Close all other tooltips first
            tooltips.forEach(t => {
                if(t !== this) t.classList.remove('active');
            });
            this.classList.toggle('active');
            e.stopPropagation();
        });
    });

    // Close tooltips when clicking anywhere else on the document
    document.addEventListener('click', () => {
        tooltips.forEach(t => t.classList.remove('active'));
    });

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Audio Player Logic ---
    const audioPlayers = document.querySelectorAll('audio');

    audioPlayers.forEach(player => {
        player.addEventListener('play', () => {
            // Pause all other audio players when one starts playing
            audioPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player) {
                    otherPlayer.pause();
                }
            });
        });
    });

    // --- Custom Smooth Scrolling for Navigation ---
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800; // Animation duration in milliseconds
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    
                    // EaseInOutCubic function for a beautifully smooth glide
                    const easeInOutCubic = progress < duration / 2
                        ? 4 * Math.pow(progress / duration, 3)
                        : 1 - Math.pow(-2 * progress / duration + 2, 3) / 2;
                        
                    window.scrollTo(0, startPosition + distance * easeInOutCubic);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        window.scrollTo(0, targetPosition); // ensure it lands exactly on target
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        });
    });

    // --- Quote Carousel Logic ---
    const slides = document.querySelectorAll('.quote-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startCarousel() {
        if(slides.length > 0) {
            slideInterval = setInterval(nextSlide, 6000);
        }
    }

    startCarousel();

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startCarousel();
        });
    });
});
