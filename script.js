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
        });
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

            // Stop the carousel slideshow when music starts playing
            if (typeof slideInterval !== 'undefined') {
                clearInterval(slideInterval);
            }
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
            
            // Only restart the automatic slideshow if no music is currently playing
            const isAnyAudioPlaying = Array.from(audioPlayers).some(p => !p.paused);
            if (!isAnyAudioPlaying) {
                startCarousel();
            }
        });
    });

    // Stat Counters Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const numbersSection = document.querySelector('.numbers-section');
    if (numbersSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                animateCounters();
            }
        }, { threshold: 0.5 });
        observer.observe(numbersSection);
    }

    // --- Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            
            // Close all other items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --- Smooth Page Transitions ---
    const transitionLinks = document.querySelectorAll('a[href="index.html"], a[href="classical.html"], a[href="pramlee.html"]');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetUrl = this.getAttribute('href');
            
            const preloader = document.getElementById('preloader');
            
            if (preloader) {
                // Fade out using the existing preloader overlay
                const loaderText = preloader.querySelector('.loader-text');
                if (loaderText) {
                    if (targetUrl === 'index.html') {
                        loaderText.innerText = "Returning to the Hall of Legends...";
                    } else if (targetUrl === 'classical.html') {
                        loaderText.innerText = "Traveling to the Classical Era...";
                    } else if (targetUrl === 'pramlee.html') {
                        loaderText.innerText = "Traveling to Studio Jalan Ampas...";
                    }
                }
                preloader.classList.remove('hidden');
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 800);
            } else {
                // Fade out the entire body for index.html
                document.body.style.transition = "opacity 0.8s ease-out";
                document.body.style.opacity = "0";
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 800);
            }
        });
    });

    // --- Lyrics Modal Logic ---
    const lyricsData = {
        "Getaran Jiwa": `Getaran jiwa melanda hatiku
Tersusun nada, irama dan lagu
Walau hanya sederhana
Tetapi tak mengapa
Moga dapat membangkitkan
Sedarlah kamu wahai insan

Tak mungkin hilang
Irama dan lagu
Bagaikan kembang
Sentiasa bermadu
Andai dipisah lagu dan irama
Lemah tiada berjiwa, hampa`,

        "Di Mana Kan Ku Cari Ganti": `Hendak ku nangis
Tiada berair mata
Hendak ku senyum
Tiada siapa nak teman

Kalaulah nasib
Sudah tersurat
Begini hebat
Apa nak buat

Di mana kan ku cari ganti
Serupa denganmu
Tak sanggup ku berpisah
Dan berhati patah, hidup gelisah

Alangkah pedih rasa hati
Selama kau pergi
Tinggalkan sendirian
Tiada berteman dalam kesepian

Dunia terang menjadi gelita
Cahaya indah tiada bergema
Keluhan hatiku membawa derita
Kini kau jua tak kunjung jelma

Di mana kan ku cari ganti
Mungkinkah di syurga
Untuk kawan berduka
Menangis bersama, selama-lamanya`,

        "Tunggu Sekejap": `Tunggu sekejap wahai kasih
Kerana hujan masih renyai
Tunggu sekejap dalam pelukan asmaraku
Jangan bimbang walaupun siang akan menjelma malam

Belum puas ku bercumbu dengan dinda
Tunggu sekejap wahai kasih
Tunggulah sampai hujan teduh
Mari ku dendang, jangan mengenang orang jauh
Jangan pulang, jangan tinggalkan daku seorang
Tunggu sekejap kasih, tunggu`,

        "Menceceh Bujang Lapok": `Oh menceceh, menceceh, menceceh, menceceh, menceceh
Oh menceceh, menceceh, menceceh, menceceh, menceceh

Bujang lapuk pakai songkok
Basikal cabuk tak pernah gosok
Tayar kempis roda bengkok
Badan pepes macam keropok

Bujang lapuk keliling kampung
Naik basikal hai pakai sarung
Minum air dah naik kembung
Sakit perut terpekik terlolong

Hai bujang lapuk tak boleh harap
Basikal cabuk dah naik kurap
Baru putus hai urat saraf
Masuk angin keluar asap

Bujang lapuk loyar buruk
Sana sini hai bikin sibuk
Naik basikal semacam beruk
Tak ada kerja tolak habuk`,

        "Anakku Sazali": `Anakku Sazali dengarlah
Lagu yang ayahanda karangi
Sifatkan laguku hai anak
Sebagai sahabatmu nanti

Anakku Sazali juwita
Laguku jadikan pelita
Penyuluh di gelap gelita
Pemandu ke puncak bahagia

Andainya kamilah kembali
Menyahut panggilan Ilahi
Laguku biarlah ganti
Di jiwamu hidup abadi
Dialah temanmu sejati
Menjagamu wahai Sazali

Anakku Sazali dengarlah
Lagu yang ayahanda karangi
Sifatkan laguku hai anak
Sebagai sahabatmu nanti`,

        "Nak Dara Rindu": `Di waktu malam bulan mengambang
Sunyi damai, hai, damai sekelilingku
Terdengar nan sayu bintang seribu
Membujuk rayu kerna merindu
Lagu yang dulu

Di waktu malam bulan purnama
Angin laut meniup-niup tenang
Mengatakan sayang, berlagu merdu
Bermadah sayu, lemah mendayu
Nak dara rindu

Tanjung Katung airnya biru
Tempat mandi nak dara jelita
Sama sekampung, hai, sedang dirindu
Ini kan lagi, hai, jauh di mata

Tanjung Katung airnya biru
Tempat mandi nak dara jelita
Sama sekampung, hai, sedang dirindu
Ini kan lagi, hai, jauh di mata`
    };

    const lyricsModal = document.getElementById('lyrics-modal');
    const lyricsButtons = document.querySelectorAll('.lyrics-btn');
    const closeLyricsBtn = document.getElementById('close-lyrics');
    const modalTitle = document.getElementById('modal-song-title');
    const modalText = document.getElementById('modal-lyrics-text');

    if (lyricsModal && lyricsButtons && closeLyricsBtn) {
        lyricsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const song = btn.getAttribute('data-song');
                if (lyricsData[song]) {
                    modalTitle.textContent = song;
                    modalText.textContent = lyricsData[song];
                    lyricsModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scroll
                    
                    // Stop the carousel slideshow when viewing lyrics
                    if (typeof slideInterval !== 'undefined') {
                        clearInterval(slideInterval);
                    }
                }
            });
        });

        const closeLyrics = () => {
            lyricsModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scroll
        };

        closeLyricsBtn.addEventListener('click', closeLyrics);
        lyricsModal.addEventListener('click', (e) => {
            if (e.target === lyricsModal) closeLyrics();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lyricsModal.classList.contains('active')) {
                closeLyrics();
            }
        });
    }

});
