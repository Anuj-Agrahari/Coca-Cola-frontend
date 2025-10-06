 const scrollingCan = document.getElementById('scrolling-can');
        const heroSection = document.getElementById('hero');
        const statsSection = document.getElementById('stats');

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            // Simple parallax and scaling effect for the can
            const scale = Math.max(0.4, 1 - scrollPosition / windowHeight * 0.7);
            const rotation = scrollPosition / 10;
            const translateX = Math.min(20, scrollPosition / windowHeight * 100); // moves can to the left

            scrollingCan.style.transform = `translate(-${50 + translateX}%, -50%) scale(${scale}) rotate(${rotation}deg)`;

            // Hide can after a certain point
            if (scrollPosition > windowHeight * 2.5) {
                scrollingCan.style.opacity = '0';
            } else {
                scrollingCan.style.opacity = '1';
            }
        });

        // Intersection Observer for fade-in animations
        const faders = document.querySelectorAll('.fade-in');
        const appearOptions = {
            threshold: 0.3,
            rootMargin: "0px 0px -100px 0px"
        };
        const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('visible');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });



         //  Intersection Observer for staggered product card animation
        const productCards = document.querySelectorAll('.product-card');
        const productCardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Set a staggered delay for each card
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        productCards.forEach((card, index) => {
            card.classList.add('fade-in'); // Add fade-in class for the styles
            // Use a timeout to slightly delay the observation start, ensuring correct indexing for delays
            setTimeout(() => {
                productCardObserver.observe(card);
            }, index * 50);
        });


         //  Timeline Observer
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        timelineItems.forEach(item => timelineObserver.observe(item));

          //  Non-alcoholic categories observer
        const categoryFaders = document.querySelectorAll('.category-fade-in');
        const categoryObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                 if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 150}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        categoryFaders.forEach(fader => {
            fader.classList.add('fade-in'); // Reuse fade-in styles
            categoryObserver.observe(fader)
        });



        // Counter animation
        const counters = document.querySelectorAll('[data-target]');
        let isCounterAnimated = false;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isCounterAnimated) {
                    counters.forEach(counter => {
                        const updateCount = () => {
                            const target = +counter.getAttribute('data-target');
                            const count = +counter.innerText.replace(/,/g, '');

                            // Lower increment for faster motion
                            const increment = target / 100;

                            if (count < target) {
                                const newCount = Math.ceil(count + increment);
                                if (newCount > target) {
                                     counter.innerText = target.toLocaleString();
                                } else {
                                     counter.innerText = newCount.toLocaleString();
                                }
                                setTimeout(updateCount, 15);
                            } else {
                                counter.innerText = target.toLocaleString();
                            }
                        };
                        updateCount();
                    });
                    isCounterAnimated = true; // Ensure it animates only once
                    counterObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(statsSection);

         //  Product filtering logic
        const filterButtons = document.querySelectorAll('.product-filter-btn');
        const productGrids = document.querySelectorAll('.product-grid');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.dataset.target;

                // Update button styles
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.remove('bg-red-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                button.classList.add('active');
                button.classList.add('bg-red-600', 'text-white');
                button.classList.remove('bg-gray-200', 'text-gray-700');


                // Show/hide product grids
                productGrids.forEach(grid => {
                    if (grid.id === target) {
                        grid.classList.remove('hidden');
                    } else {
                        grid.classList.add('hidden');
                    }
                });
            });
        });

        // NEW: Contact Modal Logic
            const contactBtn = document.getElementById('contact-btn');
            const contactModal = document.getElementById('contact-modal');
            const modalContent = document.getElementById('contact-modal-content');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const contactForm = document.getElementById('contact-form');
            const formContainer = document.getElementById('form-container');
            const thankYouMessage = document.getElementById('thank-you-message');

            const openModal = () => {
                if(!contactModal || !modalContent) return;
                contactModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            };

            const closeModal = () => {
                if(!contactModal || !modalContent) return;
                modalContent.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    contactModal.classList.add('hidden');
                    document.body.style.overflow = '';
                    // Reset form for next time
                    if (formContainer && thankYouMessage) {
                        formContainer.classList.remove('hidden');
                        thankYouMessage.classList.add('hidden');
                        contactForm.reset();
                    }
                }, 300);
            };

            if (contactBtn) contactBtn.addEventListener('click', openModal);
            if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
            if (contactModal) contactModal.addEventListener('click', (e) => {
                if (e.target === contactModal) closeModal();
            });

            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (formContainer && thankYouMessage) {
                       formContainer.classList.add('hidden');
                       thankYouMessage.classList.remove('hidden');
                    }
                });
            }

       
    