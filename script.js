document.addEventListener('DOMContentLoaded', () => {
    // --- Reset Scroll to Top ---
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- Background Hearts ---
    const bgAnimation = document.getElementById('bg-animation');
    const createHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = Math.random() * 20 + 20 + 'px';
        heart.style.animationDuration = Math.random() * 5 + 10 + 's';
        bgAnimation.appendChild(heart);
        setTimeout(() => heart.remove(), 15000);
    };
    setInterval(createHeart, 800);

    // --- Gallery Logic ---
    const cardStack = document.getElementById('card-stack');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const currentIndexEl = document.getElementById('current-index');

    let currentIndex = 0;
    const totalPhotos = 12;
    const captions = [
        "The first time I saw you...",
        "Your beautiful smile lights up my world.",
        "One of my favorite days with you.",
        "You make every moment special.",
        "To many more adventures together!",
        "Stunning, as always.",
        "A memory I'll cherish forever.",
        "You are my happy place.",
        "Simply breathtaking.",
        "Laughter is better with you.",
        "Soulmates forever.",
        "My greatest gift is YOU."
    ];

    // List of user's photo filenames
    const photoFiles = [
        "02fc20c6-8a92-44b0-baeb-daa805245fd7.jpg",
        "0f6e2c3c-1afe-4b28-a8e7-21eb7d560910.jpg",
        "3ed4c8ed-4883-44e6-ba1e-ba23956aa3b1.jpg",
        "434df834-a57a-4586-95ec-2ef2d87304a5.jpg",
        "43767077-461c-4d7a-a771-7ceb8f1e1ebe.jpg",
        "49773bfa-c607-498b-84fb-1c068fd11148.jpg",
        "644cf5ad-6e04-47ea-a677-42d82e9f65ae.jpg",
        "7044c304-3c28-43fa-ba11-bb9c1b962b3a.jpg",
        "88aaabb5-0662-4bb3-8a62-e2b56f451f12.jpg",
        "d10a6776-9b74-4ef7-891a-a6b897333f13.jpg",
        "e832eb26-7b73-450d-a21b-0dc6d351f76f.jpg",
        "f9f62f5c-9d78-43fb-af88-18d821d20386.jpg"
    ];

    // Initialize cards
    for (let i = 0; i < totalPhotos; i++) {
        const card = document.createElement('div');
        card.classList.add('gallery-card');
        card.style.zIndex = totalPhotos - i;

        card.innerHTML = `
            <img src="images/${photoFiles[i]}" alt="Memory ${i + 1}" onerror="this.src='https://via.placeholder.com/400x500?text=Photo+${i + 1}'">
            <div class="card-caption">${captions[i]}</div>
        `;
        cardStack.appendChild(card);
    }

    const updateCards = () => {
        const cards = document.querySelectorAll('.gallery-card');
        cards.forEach((card, index) => {
            if (index < currentIndex) {
                // Already passed
                card.style.transform = 'translateX(-150%) rotate(-20deg)';
                card.style.opacity = '0';
            } else {
                // In stack or currently active
                const depth = index - currentIndex;
                const scale = 1 - (depth * 0.05);
                const translateY = depth * 20; // 20px down per card
                const translateZ = depth * -50; // Push back in 3D space
                const opacity = 1 - (depth * 0.3);

                // Use translate3d for GPU acceleration
                card.style.transform = `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`;
                card.style.opacity = opacity > 0 ? opacity : 0;
                card.style.zIndex = totalPhotos - index;
                card.style.pointerEvents = index === currentIndex ? 'auto' : 'none';
            }
        });
        currentIndexEl.textContent = currentIndex + 1;
    };

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalPhotos - 1) {
            currentIndex++;
            updateCards();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCards();
        }
    });

    updateCards();

    // --- Surprise & Confetti ---
    const revealBtn = document.getElementById('reveal-btn');
    const finalModal = document.getElementById('final-modal');

    revealBtn.addEventListener('click', () => {
        // Confetti burst - Single lightweight burst to prevent lag
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        // Single burst
        confetti({ ...defaults, particleCount: 50, origin: { y: 0.6 } });

        // Show Modal
        revealBtn.style.display = 'none'; // Hide the button after click
        finalModal.classList.remove('hidden');
        setTimeout(() => finalModal.classList.add('visible'), 100);
    });

    // Close modal click outside
    finalModal.addEventListener('click', (e) => {
        if (e.target === finalModal) {
            finalModal.classList.remove('visible');
            setTimeout(() => finalModal.classList.add('hidden'), 500);
        }
    });

    // --- Music Control ---
    const music = document.getElementById('bg-music');
    music.volume = 0.4; // Set initial volume to 40%
    const musicToggle = document.getElementById('music-toggle');
    const musicText = musicToggle.querySelector('.music-text');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            musicText.textContent = 'Our Song Paused ❤️';
            musicToggle.classList.remove('playing');
        } else {
            music.play().catch(e => console.log("Playback failed:", e));
            musicText.textContent = 'Our Song is Playing ❤️';
            musicToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
});
