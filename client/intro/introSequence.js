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
    introVideo.pause(); // Ensure sound stops immediately
    gsap.to(introOverlay, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
            introOverlay.style.display = 'none';
            revealApp();
        }
    });
}

function revealApp() {
    appContainer.classList.remove('hidden');
    
    // Animate panels with a cinematic staggered reveal
    const tl = gsap.timeline();
    
    tl.from(appContainer, {
        backgroundColor: "rgba(0,0,0,1)",
        duration: 2
    })
    .from('.logo', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
    }, "-=1")
    .from('#history-panel', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.5")
    .from('#status-panel', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.8")
    .from('#chat-panel', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5")
    .from('#input-container', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.4");
}
