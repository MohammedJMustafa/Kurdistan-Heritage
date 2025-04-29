

document.addEventListener('DOMContentLoaded', function() {
    // Function to create animated dots
    function createAnimatedDots(container, count, options = {}) {
        // Default options
        const defaults = {
            minSize: 3,
            maxSize: 8,
            color: 'rgba(0, 0, 0, 0.1)',
            minSpeed: 0.1,  // Much slower speed (pixels per frame)
            maxSpeed: 0.3,  // Much slower speed (pixels per frame)
            minAmplitude: 40,
            maxAmplitude: 120
        };
        
        // Merge default options with provided options
        const settings = {...defaults, ...options};
        
        // Get the container element
        const containerEl = document.querySelector(container);
        if (!containerEl) return;
        
        // Container dimensions
        const containerRect = containerEl.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Add position relative if not already set
        if (window.getComputedStyle(containerEl).position === 'static') {
            containerEl.style.position = 'relative';
        }
        
        // Array to store all dots for animation
        const dots = [];
        
        // Create and add dots
        for (let i = 0; i < count; i++) {
            // Create dot element
            const dot = document.createElement('div');
            
            // Random size
            const size = Math.floor(Math.random() * (settings.maxSize - settings.minSize + 1)) + settings.minSize;
            
            // Random position
            const posX = Math.floor(Math.random() * (containerWidth - size));
            const posY = Math.floor(Math.random() * (containerHeight - size));
            
            // Random speed (now truly random direction)
            const speedX = (Math.random() * (settings.maxSpeed - settings.minSpeed) + settings.minSpeed) * (Math.random() > 0.5 ? 1 : -1);
            const speedY = (Math.random() * (settings.maxSpeed - settings.minSpeed) + settings.minSpeed) * (Math.random() > 0.5 ? 1 : -1);
            
            // Set dot styles
            dot.style.position = 'absolute';
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = settings.color;
            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;
            dot.style.zIndex = '1';
            dot.style.pointerEvents = 'none'; // Make sure dots don't interfere with clicks
            
            // Add theme-aware class - make ALL dots theme-aware
            dot.classList.add('theme-aware-dot');
            dot.setAttribute('data-container', container);
            
            // Add dot to container
            containerEl.appendChild(dot);
            
            // Store dot info for animation
            dots.push({
                element: dot,
                x: posX,
                y: posY,
                size: size,
                speedX: speedX,
                speedY: speedY,
                container: containerEl
            });
        }
        
        // Return dots array for animation
        return dots;
    }
    
    // Function to update ALL dot colors based on current theme
    function updateAllDotsThemeColor() {
        const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        
        // Define specific colors for different containers
        const colors = {
            '.navbar': isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            'footer': isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            '.page-header': isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.08)'
        };
        
        // Update all dots
        document.querySelectorAll('.theme-aware-dot').forEach(dot => {
            const container = dot.getAttribute('data-container');
            if (container && colors[container]) {
                dot.style.backgroundColor = colors[container];
            } else {
                // Default fallback
                dot.style.backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    // Consistent animation settings for all dots
    const dotsSettings = {
        minSize: 3,
        maxSize: 8,
        minSpeed: 0.1,  // Very slow movement (pixels per frame)
        maxSpeed: 0.3,  // Very slow movement (pixels per frame)
        minAmplitude: 40,
        maxAmplitude: 120
    };
    
    // Initial color based on current theme
    const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const navbarColor = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const footerColor = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    const headerColor = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.08)';
    
    // Create all dots and store them for animation
    const allDots = [];
    
    // Create dots in footer with consistent settings
    const footerDots = createAnimatedDots('footer', 25, {
        ...dotsSettings,
        color: footerColor,
        minSpeed: 0.05,
        maxSpeed: 0.15
    });
    if (footerDots) allDots.push(...footerDots);
    
    // Create dots in the yellow background sections (page-header) with consistent settings
    const headerDots = createAnimatedDots('.page-header', 25, {
        ...dotsSettings,
        color: headerColor,
        minSize: 4,
        maxSize: 10,
        minSpeed: 0.05,
        maxSpeed: 0.15
    });
    if (headerDots) allDots.push(...headerDots);
    
    // Create dots in navbar with consistent settings
    const navbarDots = createAnimatedDots('.navbar', 25, {
        ...dotsSettings,
        color: navbarColor,
        minSize: 2,
        maxSize: 6,
        minSpeed: 0.05,
        maxSpeed: 0.15
    });
    if (navbarDots) allDots.push(...navbarDots);
    
    // Animation function for continuous random movement
    function animateDots() {
        allDots.forEach(dot => {
            // Get container dimensions (may change on resize)
            const containerRect = dot.container.getBoundingClientRect();
            
            // Update dot position
            dot.x += dot.speedX;
            dot.y += dot.speedY;
            
            // Check boundaries and reverse direction if needed
            if (dot.x <= 0 || dot.x >= containerRect.width - dot.size) {
                // Bounce off the sides with a slightly different angle
                dot.speedX = -dot.speedX * (0.8 + Math.random() * 0.4);
                // Adjust position to prevent sticking to edges
                dot.x = Math.max(0, Math.min(dot.x, containerRect.width - dot.size));
                
                // Add a bit of randomness to the y speed when bouncing
                dot.speedY += (Math.random() - 0.5) * 0.1;
            }
            
            if (dot.y <= 0 || dot.y >= containerRect.height - dot.size) {
                // Bounce off the top/bottom with a slightly different angle
                dot.speedY = -dot.speedY * (0.8 + Math.random() * 0.4);
                // Adjust position to prevent sticking to edges
                dot.y = Math.max(0, Math.min(dot.y, containerRect.height - dot.size));
                
                // Add a bit of randomness to the x speed when bouncing
                dot.speedX += (Math.random() - 0.5) * 0.1;
            }
            
            // Occasionally change direction slightly to create more natural movement
            if (Math.random() < 0.01) {
                dot.speedX += (Math.random() - 0.5) * 0.05;
                dot.speedY += (Math.random() - 0.5) * 0.05;
                
                // Limit maximum speed to prevent dots from moving too fast
                const maxSpeed = 0.3;
                const speed = Math.sqrt(dot.speedX * dot.speedX + dot.speedY * dot.speedY);
                if (speed > maxSpeed) {
                    dot.speedX = (dot.speedX / speed) * maxSpeed;
                    dot.speedY = (dot.speedY / speed) * maxSpeed;
                }
            }
            
            // Apply position
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
        });
        
        // Continue animation
        requestAnimationFrame(animateDots);
    }
    
    // Start animation
    animateDots();
    
    // Update all dots when theme changes
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            // Update immediately as the attribute changes
            updateAllDotsThemeColor();
        });
    }
    
    // Also listen for theme changes that might happen programmatically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-bs-theme') {
                updateAllDotsThemeColor();
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Force an initial update to ensure correct colors
    updateAllDotsThemeColor();
    
    // Handle window resize - update container dimensions
    window.addEventListener('resize', function() {
        // Give dots new positions if their container dimensions change
        allDots.forEach(dot => {
            const containerRect = dot.container.getBoundingClientRect();
            
            // Keep dots within bounds after resize
            dot.x = Math.min(dot.x, containerRect.width - dot.size);
            dot.y = Math.min(dot.y, containerRect.height - dot.size);
        });
    });
}); 
