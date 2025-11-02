const spotlight = document.querySelector('.spotlight');
let mouseX = 0;
let mouseY = 0;
let spotlightVisible = true;

const audio = document.getElementById('audioPlayer');
let isPlaying = false;
let isRepeating = false;
let isShuffling = false;
let currentSongIndex = 0;

const playlist = [
    {
        title: "Foreign",
        src: "https://github.com/ryuisawesome/nathan.spook.bio/raw/refs/heads/main/Foreign.mp4",
        albumArt: "https://i.scdn.co/image/ab67616d0000b273a1e867d40e7bb29ced5c0194",
        duration: 142
    },
    {
        title: "PURPLE RAIN",
        src: "https://github.com/ryuisawesome/nathan.spook.bio/raw/refs/heads/main/PURPLE%20RAIN%20-%20NOVAGANG.mp3",
        albumArt: "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2F362a49650e5187261b6ad232c91ff8b6.1000x1000x1.png",
        duration: 114
    }
];

const playButton = document.getElementById('playButton');
const repeatButton = document.getElementById('repeatButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const shuffleButton = document.getElementById('shuffleButton');
const songTitle = document.getElementById('songTitle');
const albumArt = document.getElementById('albumArt');

loadSong(currentSongIndex);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!spotlightVisible) {
        spotlightVisible = true;
        spotlight.classList.remove('hidden');
    }
    updateSpotlight();
});

document.addEventListener('mouseleave', () => {
    spotlightVisible = false;
    spotlight.classList.add('hidden');
});

document.addEventListener('mouseenter', () => {
    spotlightVisible = true;
    spotlight.classList.remove('hidden');
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        spotlightVisible = false;
        spotlight.classList.add('hidden');
    } else {
        spotlightVisible = true;
        spotlight.classList.remove('hidden');
    }
});

document.addEventListener('scroll', () => {
    updateSpotlight();
});

function updateSpotlight() {
    if (!spotlightVisible) return;
    
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    
    spotlight.style.background = `radial-gradient(
        circle 150px at ${mouseX - scrollX}px ${mouseY - scrollY}px,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.08) 20%,
        transparent 50%
    )`;
}

function loadSong(index) {
    const song = playlist[index];
    audio.src = song.src;
    songTitle.textContent = song.title;
    albumArt.src = song.albumArt;
    document.getElementById('totalTime').textContent = formatTime(song.duration);
    
    const progress = document.getElementById('progress');
    const progressHandle = document.getElementById('progressHandle');
    progress.style.width = '0%';
    progressHandle.style.left = '0%';
    document.getElementById('currentTime').textContent = '0:00';
}

audio.addEventListener('loadedmetadata', function() {
    document.getElementById('totalTime').textContent = formatTime(playlist[currentSongIndex].duration);
});

audio.addEventListener('timeupdate', function() {
    updateProgress();
});

audio.addEventListener('ended', function() {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});

audio.addEventListener('error', function(e) {
    console.log('Audio error:', e);
});

playButton.addEventListener('click', playPause);
repeatButton.addEventListener('click', toggleRepeat);
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);
shuffleButton.addEventListener('click', toggleShuffle);

function playPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function play() {
    audio.play().then(() => {
        isPlaying = true;
        const icon = playButton.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }).catch(error => {
        console.log('Play failed:', error);
    });
}

function pause() {
    audio.pause();
    isPlaying = false;
    const icon = playButton.querySelector('i');
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        play();
    }
}

function nextSong() {
    if (isShuffling) {
        // Random song excluding current one
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentSongIndex && playlist.length > 1);
        currentSongIndex = newIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        play();
    }
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('active', isRepeating);
}

function toggleShuffle() {
    isShuffling = !isShuffling;
    shuffleButton.classList.toggle('active', isShuffling);
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const progressHandle = document.getElementById('progressHandle');
    const currentTimeDisplay = document.getElementById('currentTime');
    
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = progressPercent + '%';
        progressHandle.style.left = progressPercent + '%';
    }
    
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

const progressBar = document.getElementById('progressBar');
let isDragging = false;

progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateProgressFromEvent(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateProgressFromEvent(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function updateProgressFromEvent(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    
    audio.currentTime = percent * audio.duration;
    updateProgress();
}

const links = document.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'scale(1.1)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'scale(1)';
    });
});

updateSpotlight();
