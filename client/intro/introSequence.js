// Elements
const introVideo = document.getElementById('intro-video');
const introOverlay = document.getElementById('intro-overlay');
const appContainer = document.getElementById('app-container');

// Create a "Click to Enter" splash if needed
const showStartScreen = () => {
    const splash = document.createElement('div');
    splash.id = 'splash-screen';
    splash.innerHTML = `
        <div class="splash-content">
            <h1 class="logo">Aira</h1>
            <p>Click to Initialize</p>
        </div>
    `;
    introOverlay.appendChild(splash);
    
    splash.addEventListener('click', (e) => {
        e.stopPropagation();
        gsap.to(splash, { opacity: 0, duration: 0.5, onComplete: () => {
            splash.remove();
            startIntro();
        }});
    }, { once: true });
};

const startIntro = () => {
    introVideo.muted = false;
    introVideo.volume = 1.0;
    introVideo.currentTime = 0; // Ensure it starts from beginning
    introVideo.play().then(() => {
        console.log("Intro started with sound.");
        // Only allow skipping AFTER the video has successfully started
        introOverlay.addEventListener('click', () => {
            if (!introVideo.paused) finishIntro();
        }, { once: true });
    }).catch(err => {
        console.warn("Play failed:", err);
        introVideo.muted = true;
        introVideo.play();
    });
};

// Check if ready
if (introVideo.readyState >= 2) {
    showStartScreen();
} else {
    introVideo.addEventListener('loadeddata', showStartScreen);
}

// Transition on natural end
introVideo.addEventListener('ended', finishIntro);

function finishIntro() {
    introVideo.pause();
    
    // Add fade-out and slide-up effect to the overlay
    introOverlay.classList.add('intro-fade-out');
    
    // Trigger the app reveal with the scroll-up animation
    setTimeout(() => {
        introOverlay.style.display = 'none';
        revealApp();
    }, 800);
}

function revealApp() {
    appContainer.classList.remove('hidden');
    appContainer.classList.add('scroll-up');
    
    const tl = gsap.timeline();
    
    // Stagger the appearance of inner elements to match the scroll
    tl.from('#history-panel', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power4.out"
    })
    .from('#chat-panel', {
        y: 150,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out"
    }, "-=1")
    .from('#input-container', {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=1.2");
}
