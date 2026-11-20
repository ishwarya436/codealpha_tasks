
// Get HTML Elements

const audioPlayer = document.getElementById("audioPlayer");

const songTitle = document.getElementById("songTitle");

const artistName = document.getElementById("artistName");

const albumImage = document.getElementById("albumImage");

const playPauseBtn = document.getElementById("playPauseBtn");

const previousBtn = document.getElementById("previousBtn");

const nextBtn = document.getElementById("nextBtn");

const progressBar = document.getElementById("progressBar");

const currentTime = document.getElementById("currentTime");

const duration = document.getElementById("duration");

const volumeControl = document.getElementById("volumeControl");

const playlist = document.getElementById("playlist");

const autoplayToggle = document.getElementById("autoplayToggle");


// Music Playlist

const songs = [

    {
        title: "Song One",
        artist: "Unknown Artist",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500"
    },

    {
        title: "Song Two",
        artist: "Unknown Artist",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500"
    },

    {
        title: "Song Three",
        artist: "Unknown Artist",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
    }

];


// Current Song Index

let currentSongIndex = 0;


// Display Playlist

function displayPlaylist() {

    playlist.innerHTML = "";

    songs.forEach((song, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${index + 1}. ${song.title}</span>
            <small>${song.artist}</small>
        `;

        if (index === currentSongIndex) {
            li.classList.add("active");
        }

        li.addEventListener("click", () => {

            currentSongIndex = index;

            loadSong(currentSongIndex);

            playSong();

        });

        playlist.appendChild(li);

    });

}


// Load Song

function loadSong(index) {

    const song = songs[index];

    songTitle.textContent = song.title;

    artistName.textContent = song.artist;

    albumImage.src = song.image;

    audioPlayer.src = song.src;

    audioPlayer.load();

    progressBar.value = 0;

    currentTime.textContent = "0:00";

    duration.textContent = "0:00";

    displayPlaylist();

}


// Play Song

function playSong() {

    audioPlayer.play()
        .then(() => {

            playPauseBtn.textContent = "⏸";

        })
        .catch((error) => {

            console.error("Unable to play audio:", error);

            playPauseBtn.textContent = "▶";

        });

}


// Pause Song

function pauseSong() {

    audioPlayer.pause();

    playPauseBtn.textContent = "▶";

}


// Play and Pause Button

playPauseBtn.addEventListener("click", () => {

    if (audioPlayer.paused) {

        playSong();

    } else {

        pauseSong();

    }

});


// Next Song

function nextSong() {

    currentSongIndex++;

    if (currentSongIndex >= songs.length) {

        currentSongIndex = 0;

    }

    loadSong(currentSongIndex);

    playSong();

}


// Previous Song

function previousSong() {

    currentSongIndex--;

    if (currentSongIndex < 0) {

        currentSongIndex = songs.length - 1;

    }

    loadSong(currentSongIndex);

    playSong();

}


// Next Button

nextBtn.addEventListener("click", nextSong);


// Previous Button

previousBtn.addEventListener("click", previousSong);


// Format Time

function formatTime(time) {

    if (!Number.isFinite(time)) {
        return "0:00";
    }

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;

}


// Update Duration

audioPlayer.addEventListener("loadedmetadata", () => {

    duration.textContent = formatTime(audioPlayer.duration);

});


// Update Progress Bar

audioPlayer.addEventListener("timeupdate", () => {

    if (audioPlayer.duration) {

        const progress =
            (audioPlayer.currentTime / audioPlayer.duration) * 100;

        progressBar.value = progress;

        currentTime.textContent =
            formatTime(audioPlayer.currentTime);

    }

});


// Seek Music

progressBar.addEventListener("input", () => {

    if (Number.isFinite(audioPlayer.duration)) {

        audioPlayer.currentTime =
            (progressBar.value / 100) * audioPlayer.duration;

    }

});


// Volume Control

volumeControl.addEventListener("input", () => {

    audioPlayer.volume = volumeControl.value;

});


// Autoplay Next Song

audioPlayer.addEventListener("ended", () => {

    if (autoplayToggle.checked) {

        nextSong();

    } else {

        playPauseBtn.textContent = "▶";

        progressBar.value = 0;

        currentTime.textContent = "0:00";

    }

});


// Initialize Music Player

audioPlayer.volume = volumeControl.value;

loadSong(currentSongIndex);
