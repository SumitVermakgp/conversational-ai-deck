let currentSlide = 1;
let currentStep = 1;
const totalSlides = document.querySelectorAll('.slide').length;

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    
    if (n > totalSlides) {
        currentSlide = totalSlides;
    }
    if (n < 1) {
        currentSlide = 1;
    }

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    slides[currentSlide - 1].classList.add('active');
    
    currentStep = 1;
    showStep(currentStep);

    updateNavigation();

    const progress = (currentSlide / totalSlides) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    const activeSlide = slides[currentSlide - 1];
    const slideNumber = activeSlide.querySelector('.slide-number');
    if (slideNumber) {
        slideNumber.textContent = `${currentSlide} / ${totalSlides}`;
    }
}

function showStep(step) {
    const activeSlide = document.querySelector('.slide.active');
    const stepContents = activeSlide.querySelectorAll('.step-content');
    const stepIndicator = document.getElementById('stepIndicator');
    
    if (stepContents.length === 0) {
        stepIndicator.classList.remove('visible');
        return;
    }

    stepIndicator.classList.add('visible');
    stepIndicator.textContent = `Step ${step} of ${stepContents.length}`;

    stepContents.forEach((content, index) => {
        if (index < step) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function updateNavigation() {
    const activeSlide = document.querySelector('.slide.active');
    const stepContents = activeSlide.querySelectorAll('.step-content');
    const totalSteps = stepContents.length;
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = (currentSlide === 1 && (totalSteps === 0 || currentStep === 1));
    nextBtn.disabled = (currentSlide === totalSlides && (totalSteps === 0 || currentStep === totalSteps));
}

function changeSlide(n) {
    const activeSlide = document.querySelector('.slide.active');
    const stepContents = activeSlide.querySelectorAll('.step-content');
    const totalSteps = stepContents.length;

    if (n > 0) {
        if (totalSteps > 0 && currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateNavigation();
        } else {
            currentSlide++;
            showSlide(currentSlide);
        }
    } else {
        if (totalSteps > 0 && currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            updateNavigation();
        } else {
            currentSlide--;
            if (currentSlide >= 1) {
                showSlide(currentSlide);
                const prevSlide = document.querySelector('.slide.active');
                const prevSteps = prevSlide.querySelectorAll('.step-content');
                if (prevSteps.length > 0) {
                    currentStep = prevSteps.length;
                    showStep(currentStep);
                }
            } else {
                currentSlide = 1;
                showSlide(currentSlide);
            }
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        changeSlide(1);
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        changeSlide(-1);
    } else if (event.key === 'Home') {
        event.preventDefault();
        currentSlide = 1;
        currentStep = 1;
        showSlide(currentSlide);
    } else if (event.key === 'End') {
        event.preventDefault();
        currentSlide = totalSlides;
        showSlide(currentSlide);
        const lastSlide = document.querySelector('.slide.active');
        const lastSteps = lastSlide.querySelectorAll('.step-content');
        if (lastSteps.length > 0) {
            currentStep = lastSteps.length;
            showStep(currentStep);
        }
    }
});

// Add slide numbers to all slides
document.querySelectorAll('.slide').forEach((slide, index) => {
    const slideNum = document.createElement('div');
    slideNum.className = 'slide-number';
    slideNum.textContent = `${index + 1} / ${totalSlides}`;
    slide.appendChild(slideNum);
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeSlide(1);
    }
    if (touchEndX > touchStartX + 50) {
        changeSlide(-1);
    }
}

// Initialize
showSlide(currentSlide);

// Prevent right-click context menu on slides
document.addEventListener('contextmenu', e => {
    if (e.target.closest('.slide')) {
        e.preventDefault();
    }
});