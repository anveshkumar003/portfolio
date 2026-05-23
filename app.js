document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it has animated in, we can stop observing it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Dynamic Navigation Active Link Tracking ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${activeId}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of section enters viewport
        rootMargin: '-100px 0px -50% 0px' // Highlighting window (top-half of screen)
    });

    sections.forEach(sec => navObserver.observe(sec));

    // --- Video Modal Controls ---
    const modal = document.getElementById('videoModal');
    const modalContent = modal ? modal.querySelector('.video-container') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    const modalExternalLink = modal ? modal.querySelector('#modalExternalLink') : null;
    const playButtons = document.querySelectorAll('.play-trigger');

    if (modal && modalContent && modalClose) {
        
        const openModal = (videoUrl) => {
            let embedUrl = '';
            
            // Set dynamic watch link
            if (modalExternalLink) {
                modalExternalLink.href = videoUrl;
            }
            
            // Check if it's a YouTube Link
            if (videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com')) {
                let videoId = '';
                if (videoUrl.includes('youtu.be/')) {
                    videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
                } else if (videoUrl.includes('v=')) {
                    videoId = videoUrl.split('v=')[1].split('&')[0];
                }
                embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                
                modalContent.innerHTML = `<iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop page scrolling
            } 
            // If Instagram, Instagram blocks iframe loads. We show a nice container card redirecting them or open in new tab.
            else if (videoUrl.includes('instagram.com')) {
                window.open(videoUrl, '_blank');
            } 
            else {
                // Default fallback fallback
                window.open(videoUrl, '_blank');
            }
        };

        const closeModal = () => {
            modal.classList.remove('active');
            modalContent.innerHTML = ''; // Destroy the iframe to stop video playback
            document.body.style.overflow = ''; // Re-enable page scrolling
        };

        // Hook click handlers to play buttons
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = btn.getAttribute('data-video-url');
                if (videoUrl) {
                    openModal(videoUrl);
                }
            });
        });

        // Close on close button click
        modalClose.addEventListener('click', closeModal);

        // Close on clicking outside the modal content box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on ESC key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- Interactive Form Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="spinner" style="animation: spin 1s linear infinite; margin-right: 8px; display: inline-block;">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                    <path d="M4 12a8 8 0 0 1 8-8"></path>
                </svg> Sending...
            `;
            
            // Simulate API transmission delay
            setTimeout(() => {
                // Create a beautiful custom success banner
                const successMsg = document.createElement('div');
                successMsg.className = 'glass-card reveal active';
                successMsg.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: rgba(13, 110, 80, 0.9);
                    border: 1px solid #10B981;
                    padding: 20px 30px;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    z-index: 5000;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.5s ease;
                `;
                successMsg.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Message Sent Successfully! I'll contact you soon.
                `;
                
                document.body.appendChild(successMsg);
                
                // Clear form inputs
                contactForm.reset();
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Remove success toast after 4s
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    successMsg.style.transform = 'translateY(20px)';
                    setTimeout(() => successMsg.remove(), 500);
                }, 4000);
                
            }, 1500);
        });
    }
});

// Spin Animation CSS Inject helper
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);
