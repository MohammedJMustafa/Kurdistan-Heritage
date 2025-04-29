"use strict";

// Shared JavaScript Functionality
document.addEventListener('DOMContentLoaded', function () {
  // 1. Theme Toggle Functionality
  var themeToggle = document.getElementById('themeToggle');
  var themeToggleWrapper = document.getElementById('themeToggleWrapper');
  var htmlElement = document.documentElement; // Check for saved theme preference or default to 'light'

  var savedTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-bs-theme', savedTheme); // Update toggle button state if it exists

  if (themeToggle) {
    themeToggle.checked = savedTheme === 'dark'; // Ensure the toggle is visible by adding this class

    if (themeToggleWrapper) {
      themeToggleWrapper.style.display = 'flex';
      themeToggleWrapper.style.visibility = 'visible';
    }
  } // Theme toggle event listener if the wrapper exists


  if (themeToggleWrapper) {
    themeToggle.addEventListener('change', function () {
      var currentTheme = htmlElement.getAttribute('data-bs-theme');
      var newTheme = currentTheme === 'light' ? 'dark' : 'light'; // Set the new theme

      htmlElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  } // 2. Initialize Tooltips


  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  }); // 3. Back to Top Button Functionality

  var backToTopButton = document.getElementById('btn-back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300) {
        // Show after scrolling 300px
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });
    backToTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  } // 4. AOS Initialization (if the library is loaded)


  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true
    });
  } // 5. Helper function for Hex to RGB (if needed by other scripts)


  window.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }; // 6. Recipe Filtering Functionality
  // Category filtering


  var filterButtons = document.querySelectorAll('.category-btn');

  if (filterButtons.length > 0) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filterValue = this.getAttribute('data-filter'); // Update active button styling

        filterButtons.forEach(function (btn) {
          return btn.classList.remove('active');
        });
        this.classList.add('active'); // Filter the recipe cards

        filterRecipes();
      });
    });
  } // Time filtering


  var timeFilterButtons = document.querySelectorAll('.time-btn');

  if (timeFilterButtons.length > 0) {
    timeFilterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var timeValue = this.getAttribute('data-time'); // Update active button styling

        timeFilterButtons.forEach(function (btn) {
          return btn.classList.remove('active');
        });
        this.classList.add('active'); // Filter the recipe cards

        filterRecipes();
      });
    });
  } // Combined filtering function


  function filterRecipes() {
    var recipeCards = document.querySelectorAll('.recipe-card');
    var activeCategory = document.querySelector('.category-btn.active');
    var activeTime = document.querySelector('.time-btn.active');
    var categoryFilter = activeCategory ? activeCategory.getAttribute('data-filter') : 'all';
    var timeFilter = activeTime ? activeTime.getAttribute('data-time') : 'all';
    recipeCards.forEach(function (card) {
      var cardCategory = card.getAttribute('data-category').toLowerCase();
      var cardTime = parseInt(card.getAttribute('data-time')); // Default show status

      var showCard = true; // Category filtering logic

      if (categoryFilter !== 'all' && cardCategory !== categoryFilter.toLowerCase()) {
        showCard = false;
      } // Time filtering logic


      if (timeFilter !== 'all') {
        var timeValue = parseInt(timeFilter);

        if (timeFilter === '30' && cardTime > 30) {
          showCard = false;
        } else if (timeFilter === '60' && (cardTime > 60 || cardTime <= 30)) {
          showCard = false;
        } else if (timeFilter === '61' && cardTime <= 60) {
          showCard = false;
        }
      } // Show or hide the card


      card.style.display = showCard ? 'block' : 'none';
    });
  } // Initialize with "All" selected


  var allCategoryBtn = document.querySelector('.category-btn[data-filter="all"]');
  var allTimeBtn = document.querySelector('.time-btn[data-time="all"]');
  if (allCategoryBtn) allCategoryBtn.classList.add('active');
  if (allTimeBtn) allTimeBtn.classList.add('active'); // Recipe Pagination Functionality

  var initRecipePagination = function initRecipePagination() {
    // Get the pagination container and recipe cards
    var paginationContainer = document.querySelector('nav[aria-label="Recipe pagination"] .pagination');
    var recipeCards = document.querySelectorAll('.recipe-card');
    if (!paginationContainer || recipeCards.length === 0) return; // Items per page (2 cards per page)

    var itemsPerPage = 2; // Calculate total pages

    var totalPages = Math.ceil(recipeCards.length / itemsPerPage); // Set current page

    var currentPage = 1; // Function to show the current page

    var showPage = function showPage(page) {
      // First apply any active filters
      var filteredCards = Array.from(recipeCards).filter(function (card) {
        return card.style.display !== 'none';
      }); // Hide all items

      recipeCards.forEach(function (card) {
        if (card.style.display !== 'none') {
          // Only affect cards that aren't filtered out
          card.classList.add('d-none');
        }
      }); // Calculate start and end indices for visible cards

      var startIndex = (page - 1) * itemsPerPage;
      var endIndex = Math.min(startIndex + itemsPerPage, filteredCards.length); // Show items for current page

      for (var i = startIndex; i < endIndex; i++) {
        if (filteredCards[i]) {
          filteredCards[i].classList.remove('d-none');
        }
      } // Update active state in pagination


      updateActivePage(page);
    }; // Update the active page in pagination


    var updateActivePage = function updateActivePage(page) {
      // Get all page items (excluding prev/next buttons)
      var pageItems = paginationContainer.querySelectorAll('.page-item'); // Remove active class from all

      pageItems.forEach(function (item) {
        item.classList.remove('active');
      }); // Enable all items by default

      pageItems.forEach(function (item) {
        item.classList.remove('disabled');
      }); // Add active class to current page (index + 1 to account for Previous button)

      if (pageItems[page]) {
        pageItems[page].classList.add('active');
      } // Handle previous button


      if (page === 1) {
        pageItems[0].classList.add('disabled');
      } // Handle next button


      if (page === totalPages) {
        pageItems[pageItems.length - 1].classList.add('disabled');
      }
    }; // Add click handlers to pagination


    var pageLinks = paginationContainer.querySelectorAll('.page-link');
    pageLinks.forEach(function (link, index) {
      link.addEventListener('click', function (e) {
        e.preventDefault(); // Get the parent page-item

        var pageItem = this.parentElement; // Don't do anything if the item is disabled

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
          var pageNumber = parseInt(link.textContent);
          currentPage = pageNumber;
          showPage(currentPage);
        }
      });
    }); // Modify the filter function to work with pagination

    var originalFilterRecipes = filterRecipes;

    filterRecipes = function filterRecipes() {
      originalFilterRecipes(); // After filtering, reset to page 1 and update pagination

      currentPage = 1;
      showPage(1);
    }; // Show first page initially


    showPage(1);
  }; // Initialize recipe pagination if we're on the recipes page


  if (document.querySelector('nav[aria-label="Recipe pagination"]')) {
    initRecipePagination();
  } // 7. Cooking Timer Functionality


  var cookingTimer = {
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    interval: null,
    isRunning: false,
    start: function start() {
      var _this = this;

      if (!this.isRunning) {
        this.isRunning = true;
        this.interval = setInterval(function () {
          if (_this.totalSeconds > 0) {
            _this.totalSeconds--;
            _this.minutes = Math.floor(_this.totalSeconds / 60);
            _this.seconds = _this.totalSeconds % 60;
            updateTimerDisplay();
            var progressBar = document.getElementById('timerProgress');

            if (progressBar) {
              var originalTotal = parseInt(document.getElementById('minutes').value) * 60;
              var percentage = _this.totalSeconds / originalTotal * 100;
              progressBar.style.width = percentage + '%';

              if (percentage < 50 && percentage >= 20) {
                progressBar.className = 'progress-bar bg-warning';
              } else if (percentage < 20) {
                progressBar.className = 'progress-bar bg-danger';
              }
            }
          } else {
            _this.stop();

            _this.playAlarm();
          }
        }, 1000);
        document.getElementById('controlTimer').textContent = 'Pause';
        document.getElementById('controlTimer').classList.remove('btn-success');
        document.getElementById('controlTimer').classList.add('btn-warning');
      } else {
        this.pause();
      }
    },
    pause: function pause() {
      if (this.isRunning) {
        this.isRunning = false;
        clearInterval(this.interval);
        document.getElementById('controlTimer').textContent = 'Resume';
        document.getElementById('controlTimer').classList.remove('btn-warning');
        document.getElementById('controlTimer').classList.add('btn-success');
      }
    },
    stop: function stop() {
      this.isRunning = false;
      clearInterval(this.interval);
      document.getElementById('controlTimer').textContent = 'Start';
      document.getElementById('controlTimer').classList.remove('btn-warning');
      document.getElementById('controlTimer').classList.add('btn-success');
    },
    reset: function reset() {
      this.stop();
      this.minutes = parseInt(document.getElementById('minutes').value) || 0;
      this.seconds = 0;
      this.totalSeconds = this.minutes * 60;
      updateTimerDisplay();
      var progressBar = document.getElementById('timerProgress');

      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.className = 'progress-bar bg-success';
      }
    },
    playAlarm: function playAlarm() {
      var toast = new bootstrap.Toast(document.querySelector('.toast-timer-complete'));
      toast.show();
      var alarm = new Audio('./assets/audio/alarm-sound.mp3');
      alarm.play();
    }
  };

  function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
  }

  function updateTimerDisplay() {
    var display = document.querySelector('.timer-display');

    if (display) {
      display.textContent = formatTime(cookingTimer.totalSeconds);
    }
  }

  var controlTimer = document.getElementById('controlTimer');

  if (controlTimer) {
    controlTimer.addEventListener('click', function () {
      cookingTimer.start();
    });
    document.getElementById('resetTimer').addEventListener('click', function () {
      cookingTimer.reset();
    });
    document.getElementById('minutes').addEventListener('change', function () {
      cookingTimer.reset();
    });
    cookingTimer.reset();
  }
});