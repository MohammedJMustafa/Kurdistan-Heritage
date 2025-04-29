

document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('btn-back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }

    const contentElements = document.querySelectorAll('.card, .poem-container, .section-heading, .page-header h1, .page-header p');
    contentElements.forEach(element => {
        element.classList.add('fade-in');
    });

    const parallaxContainers = document.querySelectorAll('.page-header, .stats-section');
    window.addEventListener('scroll', function() {
        parallaxContainers.forEach(container => {
            const scrollPosition = window.pageYOffset;
            container.style.backgroundPosition = `center ${scrollPosition * 0.1}px`;
        });
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        item.appendChild(overlay);
        
        item.addEventListener('mouseover', function() {
            overlay.style.opacity = '1';
        });
        
        item.addEventListener('mouseout', function() {
            overlay.style.opacity = '0';
        });
    });

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.padding = '0.5rem 0';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.padding = '0.75rem 0';
                navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    const statsValues = document.querySelectorAll('.stats-value');
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const count = parseInt(element.innerText);
        const increment = target / 100;
        
        if (count < target) {
            element.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(element), 20);
        } else {
            element.innerText = target;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats-value')) {
                    animateCounter(entry.target);
                }
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stats-value, .fade-in, .transition-card').forEach(el => {
        observer.observe(el);
    });

    const imgElements = document.querySelectorAll('img[data-src]');
    imgElements.forEach(img => {
        img.style.filter = 'blur(5px)';
        img.style.transition = 'filter 0.5s ease';
        
        const loadImage = () => {
            img.src = img.getAttribute('data-src');
            img.onload = () => {
                img.style.filter = 'blur(0)';
                img.removeAttribute('data-src');
            };
        };
        
        const imgObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage();
                    imgObserver.unobserve(entry.target);
                }
            });
        });
        
        imgObserver.observe(img);
    });

    if (!backToTopButton) {
        const btnBackToTop = document.createElement('button');
        btnBackToTop.id = 'btn-back-to-top';
        btnBackToTop.className = 'btn-back-to-top';
        btnBackToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
        btnBackToTop.title = 'Back to top';
        document.body.appendChild(btnBackToTop);
        
        btnBackToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                btnBackToTop.classList.add('show');
            } else {
                btnBackToTop.classList.remove('show');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 
