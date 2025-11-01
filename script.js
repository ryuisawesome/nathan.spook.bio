const cursor = document.querySelector('.custom-cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
const speed = 0.1;
let cursorVisible = true;

const audio = document.getElementById('audioPlayer');
let isPlaying = false;
let isRepeating = false;

const playButton = document.getElementById('playButton');
const repeatButton = document.getElementById('repeatButton');
const rewindButton = document.getElementById('rewindButton');
const forwardButton = document.getElementById('forwardButton');

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!cursorVisible) {
        cursorVisible = true;
        cursor.classList.remove('hidden');
    }
});

document.addEventListener('mouseleave', () => {
    cursorVisible = false;
    cursor.classList.add('hidden');
});

document.addEventListener('mouseenter', () => {
    cursorVisible = true;
    cursor.classList.remove('hidden');
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cursorVisible = false;
        cursor.classList.add('hidden');
    } else {
        cursorVisible = true;
        cursor.classList.remove('hidden');
    }
});

function animateCursor() {
    if (cursorVisible) {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * speed;
        cursorY += dy * speed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

audio.addEventListener('loadedmetadata', function() {
    document.getElementById('totalTime').textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', function() {
    updateProgress();
});

audio.addEventListener('ended', function() {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
    } else {
        pause();
    }
});

audio.addEventListener('error', function(e) {
    console.log('Audio error:', e);
});

playButton.addEventListener('click', playPause);
repeatButton.addEventListener('click', toggleRepeat);
rewindButton.addEventListener('click', rewind);
forwardButton.addEventListener('click', forward);

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

function rewind() {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
}

function forward() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('active', isRepeating);
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
        cursor.style.transform = 'scale(1.5)';
    });
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});
