// Shared JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // 1. Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleWrapper = document.getElementById('themeToggleWrapper');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    
    // Update toggle button state if it exists
    if (themeToggle) {
        themeToggle.checked = (savedTheme === 'dark');
        
        // Ensure the toggle is visible by adding this class
        if (themeToggleWrapper) {
            themeToggleWrapper.style.display = 'flex';
            themeToggleWrapper.style.visibility = 'visible';
        }
    }
    
    // Theme toggle event listener if the wrapper exists
    if (themeToggleWrapper) {
        themeToggle.addEventListener('change', function() {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Set the new theme
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. Initialize Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 3. Back to Top Button Functionality
    const backToTopButton = document.getElementById('btn-back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) { // Show after scrolling 300px
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. AOS Initialization (if the library is loaded)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }

    // 5. Helper function for Hex to RGB (if needed by other scripts)
    window.hexToRgb = function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // 6. Recipe Filtering Functionality
    // Category filtering
    const filterButtons = document.querySelectorAll('.category-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active button styling
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter the recipe cards
                filterRecipes();
            });
        });
    }
    
    // Time filtering
    const timeFilterButtons = document.querySelectorAll('.time-btn');
    if (timeFilterButtons.length > 0) {
        timeFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const timeValue = this.getAttribute('data-time');
                
                // Update active button styling
                timeFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter the recipe cards
                filterRecipes();
            });
        });
    }
    
    // Combined filtering function
    function filterRecipes() {
        const recipeCards = document.querySelectorAll('.recipe-card');
        const activeCategory = document.querySelector('.category-btn.active');
        const activeTime = document.querySelector('.time-btn.active');
        
        const categoryFilter = activeCategory ? activeCategory.getAttribute('data-filter') : 'all';
        const timeFilter = activeTime ? activeTime.getAttribute('data-time') : 'all';
        
        recipeCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category').toLowerCase();
            const cardTime = parseInt(card.getAttribute('data-time'));
            
            // Default show status
            let showCard = true;
            
            // Category filtering logic
            if (categoryFilter !== 'all' && cardCategory !== categoryFilter.toLowerCase()) {
                showCard = false;
            }
            
            // Time filtering logic
            if (timeFilter !== 'all') {
                const timeValue = parseInt(timeFilter);
                if (timeFilter === '30' && cardTime > 30) {
                    showCard = false;
                } else if (timeFilter === '60' && (cardTime > 60 || cardTime <= 30)) {
                    showCard = false;
                } else if (timeFilter === '61' && cardTime <= 60) {
                    showCard = false;
                }
            }
            
            // Show or hide the card
            card.style.display = showCard ? 'block' : 'none';
        });
    }
    
    // Initialize with "All" selected
    const allCategoryBtn = document.querySelector('.category-btn[data-filter="all"]');
    const allTimeBtn = document.querySelector('.time-btn[data-time="all"]');
    
    if (allCategoryBtn) allCategoryBtn.classList.add('active');
    if (allTimeBtn) allTimeBtn.classList.add('active');
    
    // Recipe Pagination Functionality
    const initRecipePagination = () => {
        // Get the pagination container and recipe cards
        const paginationContainer = document.querySelector('nav[aria-label="Recipe pagination"] .pagination');
        const recipeCards = document.querySelectorAll('.recipe-card');
        
        if (!paginationContainer || recipeCards.length === 0) return;
        
        // Items per page (2 cards per page)
        const itemsPerPage = 2;
        
        // Calculate total pages
        const totalPages = Math.ceil(recipeCards.length / itemsPerPage);
        
        // Set current page
        let currentPage = 1;
        
        // Function to show the current page
        const showPage = (page) => {
            // First apply any active filters
            const filteredCards = Array.from(recipeCards).filter(card => 
                card.style.display !== 'none'
            );
            
            // Hide all items
            recipeCards.forEach(card => {
                if (card.style.display !== 'none') { // Only affect cards that aren't filtered out
                    card.classList.add('d-none');
                }
            });
            
            // Calculate start and end indices for visible cards
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, filteredCards.length);
            
            // Show items for current page
            for (let i = startIndex; i < endIndex; i++) {
                if (filteredCards[i]) {
                    filteredCards[i].classList.remove('d-none');
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
            
            // Add active class to current page (index + 1 to account for Previous button)
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
        
        // Modify the filter function to work with pagination
        const originalFilterRecipes = filterRecipes;
        filterRecipes = function() {
            originalFilterRecipes();
            // After filtering, reset to page 1 and update pagination
            currentPage = 1;
            showPage(1);
        };
        
        // Show first page initially
        showPage(1);
    };
    
    // Initialize recipe pagination if we're on the recipes page
    if (document.querySelector('nav[aria-label="Recipe pagination"]')) {
        initRecipePagination();
    }
    
    // 7. Cooking Timer Functionality
    const cookingTimer = {
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        interval: null,
        isRunning: false,
        
        start: function() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.interval = setInterval(() => {
                    if (this.totalSeconds > 0) {
                        this.totalSeconds--;
                        this.minutes = Math.floor(this.totalSeconds / 60);
                        this.seconds = this.totalSeconds % 60;
                        updateTimerDisplay();
                        
                        const progressBar = document.getElementById('timerProgress');
                        if (progressBar) {
                            const originalTotal = parseInt(document.getElementById('minutes').value) * 60;
                            const percentage = (this.totalSeconds / originalTotal) * 100;
                            progressBar.style.width = percentage + '%';
                            
                            if (percentage < 50 && percentage >= 20) {
                                progressBar.className = 'progress-bar bg-warning';
                            } else if (percentage < 20) {
                                progressBar.className = 'progress-bar bg-danger';
                            }
                        }
                    } else {
                        this.stop();
                        this.playAlarm();
                    }
                }, 1000);
                
                document.getElementById('controlTimer').textContent = 'Pause';
                document.getElementById('controlTimer').classList.remove('btn-success');
                document.getElementById('controlTimer').classList.add('btn-warning');
            } else {
                this.pause();
            }
        },
        
        pause: function() {
            if (this.isRunning) {
                this.isRunning = false;
                clearInterval(this.interval);
                document.getElementById('controlTimer').textContent = 'Resume';
                document.getElementById('controlTimer').classList.remove('btn-warning');
                document.getElementById('controlTimer').classList.add('btn-success');
            }
        },
        
        stop: function() {
            this.isRunning = false;
            clearInterval(this.interval);
            document.getElementById('controlTimer').textContent = 'Start';
            document.getElementById('controlTimer').classList.remove('btn-warning');
            document.getElementById('controlTimer').classList.add('btn-success');
        },
        
        reset: function() {
            this.stop();
            this.minutes = parseInt(document.getElementById('minutes').value) || 0;
            this.seconds = 0;
            this.totalSeconds = this.minutes * 60;
            updateTimerDisplay();
            
            const progressBar = document.getElementById('timerProgress');
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.className = 'progress-bar bg-success';
            }
        },
        
        playAlarm: function() {
            const toast = new bootstrap.Toast(document.querySelector('.toast-timer-complete'));
            toast.show();
            
            const alarm = new Audio('./assets/audio/alarm-sound.mp3');
            alarm.play();
        }
    };

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
    }

    function updateTimerDisplay() {
        const display = document.querySelector('.timer-display');
        if (display) {
            display.textContent = formatTime(cookingTimer.totalSeconds);
        }
    }

    const controlTimer = document.getElementById('controlTimer');
    if (controlTimer) {
        controlTimer.addEventListener('click', function() {
            cookingTimer.start();
        });
        
        document.getElementById('resetTimer').addEventListener('click', function() {
            cookingTimer.reset();
        });
        
        document.getElementById('minutes').addEventListener('change', function() {
            cookingTimer.reset();
        });
        
        cookingTimer.reset();
    }
}); 
