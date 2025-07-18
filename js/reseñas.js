 class TestimoniosCarousel {
            constructor() {
                this.currentSlide = 0;
                this.testimonios = document.querySelectorAll('.testimonio');
                this.totalSlides = this.testimonios.length;
                
                this.isAutoPlaying = true;
                this.autoPlayInterval = null;
                this.autoPlayDelay = 5000;
                
                this.track = document.getElementById('testimoniosTrack');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.indicators = document.querySelectorAll('.indicator');
                this.autoplayIndicator = document.getElementById('autoplayIndicator');
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.startAutoPlay();
                this.updateButtons();
                this.updateIndicators();
                this.observeSection();
            }

            bindEvents() {
                this.prevBtn.addEventListener('click', () => {
                    this.pauseAutoPlay();
                    this.previousSlide();
                    this.resumeAutoPlayAfterDelay();
                });
                
                this.nextBtn.addEventListener('click', () => {
                    this.pauseAutoPlay();
                    this.nextSlide();
                    this.resumeAutoPlayAfterDelay();
                });
                
                this.indicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => {
                        this.pauseAutoPlay();
                        this.goToSlide(index);
                        this.resumeAutoPlayAfterDelay();
                    });
                });

                this.autoplayIndicator.addEventListener('click', () => this.toggleAutoPlay());

                const carousel = document.querySelector('.testimonios-carousel');
                
                carousel.addEventListener('mouseenter', () => {
                    if (this.isAutoPlaying) {
                        this.pauseAutoPlay();
                        this.autoplayIndicator.classList.add('paused');
                        this.autoplayIndicator.querySelector('i').className = 'fas fa-pause';
                    }
                });

                carousel.addEventListener('mouseleave', () => {
                    if (!this.autoPlayInterval && this.isAutoPlaying) {
                        this.autoplayIndicator.classList.remove('paused');
                        this.autoplayIndicator.querySelector('i').className = 'fas fa-play';
                        this.startAutoPlay();
                    }
                });

                // Touch events
                let touchStartX = 0;
                let touchEndX = 0;

                this.track.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    this.pauseAutoPlay();
                }, { passive: true });

                this.track.addEventListener('touchmove', (e) => {
                    touchEndX = e.touches[0].clientX;
                }, { passive: true });

                this.track.addEventListener('touchend', () => {
                    if (touchEndX < touchStartX - 50) {
                        this.nextSlide();
                    }
                    if (touchEndX > touchStartX + 50) {
                        this.previousSlide();
                    }
                    this.resumeAutoPlayAfterDelay();
                });
            }

            goToSlide(slideIndex) {
                if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
                this.currentSlide = slideIndex;
                this.updateCarousel();
                this.updateButtons();
                this.updateIndicators();
            }

            nextSlide() {
                if (this.currentSlide < this.totalSlides - 1) {
                    this.goToSlide(this.currentSlide + 1);
                } else {
                    this.goToSlide(0);
                }
            }

            previousSlide() {
                if (this.currentSlide > 0) {
                    this.goToSlide(this.currentSlide - 1);
                } else {
                    this.goToSlide(this.totalSlides - 1);
                }
            }

            updateCarousel() {
                const translateX = -this.currentSlide * 25;
                this.track.style.transform = `translateX(${translateX}%)`;
            }

            updateButtons() {
                // Removed disabled state - carousel now loops infinitely
                this.prevBtn.disabled = false;
                this.nextBtn.disabled = false;
            }

            updateIndicators() {
                this.indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === this.currentSlide);
                });
            }

            startAutoPlay() {
                if (this.isAutoPlaying && !this.autoPlayInterval) {
                    this.autoPlayInterval = setInterval(() => {
                        this.nextSlide();
                    }, this.autoPlayDelay);
                }
            }

            pauseAutoPlay() {
                if (this.autoPlayInterval) {
                    clearInterval(this.autoPlayInterval);
                    this.autoPlayInterval = null;
                }
            }

            resumeAutoPlayAfterDelay() {
                this.pauseAutoPlay();
                if (this.isAutoPlaying) {
                    setTimeout(() => {
                        this.startAutoPlay();
                    }, this.autoPlayDelay / 2);
                }
            }

            toggleAutoPlay() {
                this.isAutoPlaying = !this.isAutoPlaying;
                const icon = this.autoplayIndicator.querySelector('i');
                
                if (this.isAutoPlaying) {
                    icon.className = 'fas fa-play';
                    this.autoplayIndicator.classList.remove('paused');
                    this.startAutoPlay();
                } else {
                    icon.className = 'fas fa-pause';
                    this.autoplayIndicator.classList.add('paused');
                    this.pauseAutoPlay();
                }
            }

            observeSection() {
                const testimoniosSection = document.getElementById('testimonios');
                if (!testimoniosSection) return;

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            if (this.isAutoPlaying && !this.autoPlayInterval) {
                                this.startAutoPlay();
                            }
                        } else {
                            this.pauseAutoPlay();
                        }
                    });
                }, {
                    threshold: 0.1
                });

                observer.observe(testimoniosSection);
            }
        }

        // Initialize carousel when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            new TestimoniosCarousel();
        });