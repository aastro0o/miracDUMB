class PresentationController {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 12;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.slidesWrapper = document.getElementById('slidesWrapper');
        
        this.init();
    }
    
    init() {
        // Set total slides
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Add event listeners
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextSlide();
        });
        
        // Click anywhere to advance (except on nav controls)
        document.addEventListener('click', (e) => {
            // Don't advance if clicking on nav controls or instructions
            if (e.target.closest('.nav-controls') || e.target.closest('.instructions')) {
                return;
            }
            this.nextSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        // Initialize first slide
        this.updateSlide();
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlide();
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlide();
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateSlide();
        }
    }
    
    updateSlide() {
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlide + 1;
        
        // Update slide visibility
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index < this.currentSlide) {
                slide.classList.add('prev');
            }
        });
        
        // Update navigation button states
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        // Update button opacity for visual feedback
        if (this.currentSlide === 0) {
            this.prevBtn.style.opacity = '0.3';
        } else {
            this.prevBtn.style.opacity = '1';
        }
        
        if (this.currentSlide === this.totalSlides - 1) {
            this.nextBtn.style.opacity = '0.3';
        } else {
            this.nextBtn.style.opacity = '1';
        }
    }
    
    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationController();
    
    // Make presentation controller globally available for debugging
    window.presentation = presentation;
});

// Prevent context menu on right click to avoid interrupting presentation
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent text selection while presenting
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});

// Handle focus management for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Allow tab navigation through nav controls
        return;
    }
});

// Handle window resize to ensure slides remain properly sized
window.addEventListener('resize', () => {
    // Force a repaint to ensure proper slide positioning
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.transform = slide.classList.contains('active') ? 'translateX(0)' : 
                               slide.classList.contains('prev') ? 'translateX(-100px)' : 'translateX(100px)';
    });
});

// Add smooth scrolling behavior for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Preload functionality to ensure smooth transitions
const preloadSlides = () => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        // Force browser to calculate layout for all slides
        slide.offsetHeight;
    });
};

// Call preload after a short delay to ensure DOM is fully rendered
setTimeout(preloadSlides, 100);