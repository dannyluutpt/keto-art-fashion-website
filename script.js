/* ==========================================================================
   KETO ART ATELIER - DYNAMIC INTERACTION SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CUSTOM MAGNETIC CURSOR
       ========================================================================== */
    const cursorDot = document.getElementById('cursorDot');
    const cursorCircle = document.getElementById('cursorCircle');
    
    let mouseX = 0, mouseY = 0; // Current mouse coordinates
    let dotX = 0, dotY = 0;     // Current dot coordinates
    let circleX = 0, circleY = 0; // Current circle coordinates
    
    // Disable custom cursor on touch devices (handled by CSS, but good to double-guard)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice && cursorDot && cursorCircle) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth physics-based tracking for cursor elements
        const animateCursor = () => {
            // Instant tracking for the gold dot
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;

            // Delayed smooth tracking for the outer ring
            circleX += (mouseX - circleX) * 0.12;
            circleY += (mouseY - circleY) * 0.12;
            cursorCircle.style.left = `${circleX}px`;
            cursorCircle.style.top = `${circleY}px`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover effect listener on interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, .quick-view-btn, .lookbook-nav-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hovering');
            });
        });

        // Click scale-down effect
        document.addEventListener('mousedown', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.6)';
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursorCircle.style.borderColor = 'var(--color-gold)';
        });

        document.addEventListener('mouseup', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorCircle.style.borderColor = 'var(--color-primary-mid)';
        });
    }

    /* ==========================================================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-fade');
    
    if (revealElements.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, no need to track it anymore
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // Viewport
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: '0px 0px -50px 0px' // Offset slightly to feel more organic
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // Force hero entrance reveal instantly on load
    setTimeout(() => {
        const heroReveals = document.querySelectorAll('#hero .scroll-reveal-fade');
        heroReveals.forEach(el => el.classList.add('revealed'));
    }, 100);


    /* ==========================================================================
       3. NAVIGATION BAR SCROLL STATE
       ========================================================================== */
    const header = document.getElementById('mainHeader');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Trigger initial call


    /* ==========================================================================
       4. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggleBtn && navMenu) {
        menuToggleBtn.addEventListener('click', () => {
            menuToggleBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggleBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    /* ==========================================================================
       5. INTERACTIVE LOOKBOOK SLIDER
       ========================================================================== */
    const lookbookTrack = document.getElementById('lookbookTrack');
    const lookbookPrev = document.getElementById('lookbookPrev');
    const lookbookNext = document.getElementById('lookbookNext');
    const lookbookCounterCurr = document.querySelector('#lookbookCounter .current');
    
    if (lookbookTrack && lookbookPrev && lookbookNext) {
        let currentSlide = 0;
        const totalSlides = 2; // Slide count

        const updateLookbook = (index) => {
            currentSlide = index;
            // Translate the track: each slide takes 50% of track width (which is 200%)
            lookbookTrack.style.transform = `translateX(-${currentSlide * 50}%)`;
            
            // Toggle active classes on slides
            const slides = lookbookTrack.querySelectorAll('.lookbook-slide');
            slides.forEach((slide, idx) => {
                if (idx === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update numerical counter
            if (lookbookCounterCurr) {
                lookbookCounterCurr.textContent = `0${currentSlide + 1}`;
            }
        };

        lookbookNext.addEventListener('click', () => {
            let nextIndex = currentSlide + 1;
            if (nextIndex >= totalSlides) nextIndex = 0; // Wrap around
            updateLookbook(nextIndex);
        });

        lookbookPrev.addEventListener('click', () => {
            let prevIndex = currentSlide - 1;
            if (prevIndex < 0) prevIndex = totalSlides - 1; // Wrap around
            updateLookbook(prevIndex);
        });
    }


    /* ==========================================================================
       6. COLLECTION QUICK-VIEW MODAL SYSTEM
       ========================================================================== */
    // Detailed product database
    const productsDb = {
        "1": {
            name: "Aura Silk Gown",
            category: "Đầm Dạ Hội Haute Couture",
            price: "18,500,000 ₫",
            image: "assets/images/dress.png",
            material: "100% Lụa tơ tằm thiên nhiên bảo hành hoàng gia",
            desc: "Được thiết kế riêng cho những buổi dạ tiệc vương giả, Aura Silk Gown khoác lên mình sắc xanh băng nhạt cực kỳ thanh nhã. Từng chi tiết draping thủ công chạy quanh eo tôn vinh dáng vẻ quý phái quý tộc của người mặc."
        },
        "2": {
            name: "Royale Tailored Suit",
            category: "Bespoke Suit Nam/Nữ",
            price: "24,000,000 ₫",
            image: "assets/images/suit.png",
            material: "Dạ len Merino cao cấp kết hợp lót lụa satin",
            desc: "Thiết kế suit cách tân mang hơi hướng quý tộc châu Âu thế kỷ 19. Phom dáng cứng cáp với những đường chỉ phối màu xanh dương nhạt tinh xảo trên nền vải trắng tuyết, thể hiện sự sang trọng đỉnh cao, lịch lãm."
        },
        "3": {
            name: "Noblesse Leather Bag",
            category: "Phụ Kiện Hoàng Gia",
            price: "9,500,000 ₫",
            image: "assets/images/accessory.png",
            material: "Da bê nguyên tấm thuộc thảo mộc thủ công",
            desc: "Chiếc túi cầm tay hoàn hảo cho các quý cô quý ông thượng lưu. Khóa cài mạ vàng Champagne sang trọng và dây đeo kim loại phối da tạo điểm nhấn quý phái tinh tế cho tổng thể trang phục."
        }
    };

    const modal = document.getElementById('quickViewModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    const modalProductImg = document.getElementById('modalProductImg');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductCategory = document.getElementById('modalProductCategory');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalProductDesc = document.getElementById('modalProductDesc');
    const modalProductMaterial = document.getElementById('modalProductMaterial');
    
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');

    const openModal = (productId) => {
        const productData = productsDb[productId];
        if (!productData) return;

        // Populate modal contents
        modalProductImg.src = productData.image;
        modalProductImg.alt = productData.name;
        modalProductName.textContent = productData.name;
        modalProductCategory.textContent = productData.category;
        modalProductPrice.textContent = productData.price;
        modalProductDesc.textContent = productData.desc;
        modalProductMaterial.textContent = productData.material;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scroll
    };

    quickViewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.getAttribute('data-product');
            openModal(productId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });


    /* ==========================================================================
       7. CONTACT REGISTRATION SUBMIT
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('inputName').value;
            const email = document.getElementById('inputEmail').value;
            
            // Create royal popup notification
            const notification = document.createElement('div');
            notification.className = 'royal-notification';
            notification.innerHTML = `
                <div class="notif-content">
                    <span class="notif-crest">K</span>
                    <h3>Chào mừng quý khách, ${name}</h3>
                    <p>Yêu cầu gia nhập thành viên hoàng gia của quý khách đã được ghi nhận. Thư mời chính thức sẽ gửi đến hòm thư <strong>${email}</strong> sau khi được Atelier xét duyệt.</p>
                    <button class="btn btn-primary notif-close-btn">Đóng</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Style the notification dynamically so we don't pollute style.css unnecessarily
            Object.assign(notification.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(26, 46, 64, 0.6)',
                backdropFilter: 'blur(10px)',
                webkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '3000',
                opacity: '0',
                transition: 'opacity 0.4s ease'
            });
            
            const notifContent = notification.querySelector('.notif-content');
            Object.assign(notifContent.style, {
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-gold)',
                padding: '3rem',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            });
            
            const crest = notification.querySelector('.notif-crest');
            Object.assign(crest.style, {
                fontFamily: 'var(--font-serif)',
                fontSize: '2.5rem',
                color: 'var(--color-gold)',
                border: '1px solid var(--border-gold)',
                width: '60px',
                height: '60px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                marginBottom: '1.5rem'
            });
            
            const title = notification.querySelector('h3');
            Object.assign(title.style, {
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                color: 'var(--color-primary-dark)',
                marginBottom: '1rem'
            });

            const text = notification.querySelector('p');
            Object.assign(text.style, {
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                color: 'var(--color-text-muted)',
                marginBottom: '2rem',
                lineHeight: '1.7'
            });
            
            // Fade-in animation
            setTimeout(() => notification.style.opacity = '1', 50);
            
            // Close event
            const closeBtn = notification.querySelector('.notif-close-btn');
            closeBtn.addEventListener('click', () => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 400);
                contactForm.reset();
            });
        });
    }

    /* ==========================================================================
       8. PAGE ROUTING & GATE TRANSITION SYSTEM
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const gateTransition = document.getElementById('gateTransition');
    let isTransitioning = false;

    const switchPage = (targetId) => {
        if (!targetId || isTransitioning) return;
        
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        // If target is already active, just scroll to top
        if (targetSection.classList.contains('active-page')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        isTransitioning = true;
        
        // 1. Close the Gates
        if (gateTransition) {
            gateTransition.classList.add('active');
        }

        // 2. Perform switch under cover of gates (after 950ms transition)
        setTimeout(() => {
            // Hide all sections, show target
            sections.forEach(sec => {
                sec.classList.remove('active-page');
            });
            targetSection.classList.add('active-page');

            // Reset page scroll position instantly
            window.scrollTo(0, 0);

            // Update navigation active states
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === targetId) {
                    link.classList.add('active');
                }
            });

            // Trigger animations inside the new page
            const pageReveals = targetSection.querySelectorAll('.scroll-reveal, .scroll-reveal-fade');
            pageReveals.forEach(el => el.classList.add('revealed'));

            // 3. Open the Gates
            setTimeout(() => {
                if (gateTransition) {
                    gateTransition.classList.remove('active');
                }
                isTransitioning = false;
            }, 50); // Tiny layout stabilization delay before opening

        }, 950); // Matches CSS transition duration
    };

    // Handle hash on page load
    const initHashPage = () => {
        const hash = window.location.hash;
        let startPageId = '#hero';
        
        if (hash && document.querySelector(hash)) {
            startPageId = hash;
        }

        sections.forEach(sec => {
            if (`#${sec.id}` === startPageId) {
                sec.classList.add('active-page');
                // Force reveal elements on load
                const reveals = sec.querySelectorAll('.scroll-reveal, .scroll-reveal-fade');
                reveals.forEach(el => el.classList.add('revealed'));
            } else {
                sec.classList.remove('active-page');
            }
        });

        // Set active class on nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === startPageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Hook click event to any links pointing to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Push state to URL hash silently without jumping
            history.pushState(null, null, targetId);
            
            switchPage(targetId);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#hero';
        switchPage(hash);
    });

    // Initialize page states
    initHashPage();

    // Entrance Gate Reveal: slide gates open after page ready
    setTimeout(() => {
        if (gateTransition) {
            gateTransition.classList.remove('active');
        }
    }, 700); // 700ms initial delay for a theatrical entrance!

});
