// Kurdistan Heritage Website - Combined Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Check for saved theme preference or respect OS preference
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        // Apply saved theme or OS preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            themeToggle.checked = true;
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
            themeToggle.checked = false;
        }
        
        // Toggle theme on switch change
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-bs-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Bootstrap Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Bootstrap Popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
        trigger: 'focus'
    }));
    
    // ScrollSpy
    const scrollSpyContainer = document.querySelector('[data-bs-spy="scroll"]');
    if (scrollSpyContainer) {
        const scrollSpy = new bootstrap.ScrollSpy(scrollSpyContainer, {
            target: '#history-nav',
            offset: 200
        });
    }
            
    // Animate progress bars on scroll
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length > 0) {
        // Store original widths on page load
        progressBars.forEach(bar => {
            // Get width from inline style or use aria-valuenow as fallback
            const widthValue = bar.style.width || `${bar.getAttribute('aria-valuenow')}%`;
            // Store original width as a data attribute
            bar.dataset.width = widthValue;
            // Initially set width to 0
            bar.style.width = '0%';
        });
        
        const animateProgressBars = () => {
            progressBars.forEach(bar => {
                const rect = bar.getBoundingClientRect();
                // Check if progress bar is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (!bar.classList.contains('animated')) {
                        // Animate to original width
                        setTimeout(() => {
                            bar.style.width = bar.dataset.width;
                            bar.classList.add('animated');
                        }, 100);
                    }
                } else if (!bar.classList.contains('animated')) {
                    // Reset width when not in viewport and not yet animated
                    bar.style.width = '0%';
                }
            });
        };
        
        // Animate on scroll
        window.addEventListener('scroll', animateProgressBars);
        
        // Initial check after a short delay to ensure DOM is ready
        setTimeout(animateProgressBars, 300);
        
        // Animate progress bars when accordion items are shown
        const accordionItems = document.querySelectorAll('.accordion-collapse');
        if (accordionItems.length > 0) {
            accordionItems.forEach(item => {
                item.addEventListener('shown.bs.collapse', function() {
                    // Find progress bars in this accordion item
                    const accordionProgressBars = this.querySelectorAll('.progress-bar');
                    if (accordionProgressBars.length > 0) {
                        accordionProgressBars.forEach(bar => {
                            if (!bar.classList.contains('animated')) {
                                // Reset width first to trigger animation
                                bar.style.width = '0%';
                                // Animate to original width
                                setTimeout(() => {
                                    bar.style.width = bar.dataset.width;
                                    bar.classList.add('animated');
                                }, 50);
                            }
                        });
                    }
                });
                
                // Reset animation when accordion is hidden
                item.addEventListener('hidden.bs.collapse', function() {
                    const accordionProgressBars = this.querySelectorAll('.progress-bar');
                    if (accordionProgressBars.length > 0) {
                        accordionProgressBars.forEach(bar => {
                            bar.classList.remove('animated');
                            bar.style.width = '0%';
                        });
                    }
                });
            });
        }
    }

    // Loading overlay functionality
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        // Show loading overlay
        function showLoading() {
            loadingOverlay.classList.remove('d-none');
        }
        
        // Hide loading overlay
        function hideLoading() {
            loadingOverlay.classList.add('d-none');
        }
    }

    // Pagination functionality
    const initPagination = () => {
        // Get the pagination container
        const paginationContainer = document.querySelector('#significance .pagination');
        if (!paginationContainer) return;

        // Get all list items
        const listItems = document.querySelectorAll('#significance .list-group-item');
        if (listItems.length === 0) return;

        // Items per page
        const itemsPerPage = 2;

        // Calculate total pages
        const totalPages = Math.ceil(listItems.length / itemsPerPage);

        // Set current page
        let currentPage = 1;

        // Function to show the current page
        const showPage = (page) => {
            // Hide all items
            listItems.forEach(item => {
                item.style.display = 'none';
            });

            // Calculate start and end indices
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, listItems.length);

            // Show items for current page
            for (let i = startIndex; i < endIndex; i++) {
                if (listItems[i]) {
                    listItems[i].style.display = '';
                }
            }

            // Update active state in pagination
            updateActivePage(page);
        };

        // Update the active page in pagination
        const updateActivePage = (page) => {
            // Get all page items (excluding prev/next buttons)
            const pageItems = paginationContainer.querySelectorAll('.page-item');
            
            // Remove active class from all
            pageItems.forEach(item => {
                item.classList.remove('active');
            });

            // Enable all items by default
            pageItems.forEach(item => {
                item.classList.remove('disabled');
            });

            // Add active class to current page (page + 1 to account for Previous button)
            if (pageItems[page]) {
                pageItems[page].classList.add('active');
            }

            // Handle previous button
            if (page === 1) {
                pageItems[0].classList.add('disabled');
            }

            // Handle next button
            if (page === totalPages) {
                pageItems[pageItems.length - 1].classList.add('disabled');
            }
        };

        // Add click handlers to pagination
        const pageLinks = paginationContainer.querySelectorAll('.page-link');
        pageLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Get the parent page-item
                const pageItem = this.parentElement;
                
                // Don't do anything if the item is disabled
                if (pageItem.classList.contains('disabled')) {
                    return;
                }

                if (index === 0) {
                    // Previous button
                    if (currentPage > 1) {
                        currentPage--;
                        showPage(currentPage);
                    }
                } else if (index === pageLinks.length - 1) {
                    // Next button
                    if (currentPage < totalPages) {
                        currentPage++;
                        showPage(currentPage);
                    }
                } else {
                    // Page number - the index is offset by 1 because of the Previous button
                    const pageNumber = parseInt(link.textContent);
                    currentPage = pageNumber;
                    showPage(currentPage);
                }
            });
        });

        // Show first page initially
        showPage(1);
    };

    // Initialize pagination if we're on the history page
    if (document.querySelector('#significance')) {
        initPagination();
    }

    // Initialization complete
    console.log('Kurdistan Heritage Website scripts initialized');

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            const imgCaption = this.querySelector('.gallery-caption').innerText;
            
            const modalImg = document.querySelector('#galleryModal .modal-img');
            const modalCaption = document.querySelector('#galleryModal .modal-caption');
            
            if (modalImg && modalCaption) {
                modalImg.src = imgSrc;
                modalImg.alt = imgAlt;
                modalCaption.textContent = imgCaption;
                
                const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
                galleryModal.show();
            }
        });
    });
}); 
