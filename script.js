document.addEventListener('DOMContentLoaded', function() {
    const spotifyContent = document.getElementById('spotify-content');
    
    fetch('https://api.lanyard.rest/v1/users/1352995832164520029')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.data.spotify) {
                const spotify = data.data.spotify;
                
                const startTime = spotify.timestamps.start;
                const endTime = spotify.timestamps.end;
                const currentTime = Date.now();
                const progress = Math.min(100, ((currentTime - startTime) / (endTime - startTime)) * 100);
                
                const formatTime = (timestamp) => {
                    const date = new Date(timestamp);
                    return date.getMinutes() + ":" + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
                };
                
                const startTimeFormatted = formatTime(startTime);
                const endTimeFormatted = formatTime(endTime);
                
                spotifyContent.innerHTML = `
                    <div class="spotify-info">
                        <div class="album-art">
                            <img src="${spotify.album_art_url}" alt="${spotify.album}">
                        </div>
                        <div class="track-info">
                            <div class="track-name">${spotify.song}</div>
                            <div class="artist-name">${spotify.artist}</div>
                            <div class="album-name">${spotify.album}</div>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                            <div class="time-info">
                                <span>${startTimeFormatted}</span>
                                <span>${endTimeFormatted}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                const progressBar = document.querySelector('.progress-bar');
                const updateProgress = () => {
                    const currentTime = Date.now();
                    const newProgress = Math.min(100, ((currentTime - startTime) / (endTime - startTime)) * 100);
                    progressBar.style.width = `${newProgress}%`;
                    
                    const timeInfo = document.querySelector('.time-info');
                    const currentFormatted = formatTime(currentTime);
                    timeInfo.innerHTML = `
                        <span>${currentFormatted}</span>
                        <span>${endTimeFormatted}</span>
                    `;
                    
                    if (newProgress < 100) {
                        setTimeout(updateProgress, 1000);
                    }
                };
                
                setTimeout(updateProgress, 1000);
            } else {
                spotifyContent.innerHTML = '<div class="not-listening">Not currently listening to Spotify</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            spotifyContent.innerHTML = '<div class="error">Failed to load Spotify data</div>';
        });
});
