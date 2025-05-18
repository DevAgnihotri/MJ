document.addEventListener('DOMContentLoaded', function() {
  const progress = document.getElementById('progress');
  const song = document.getElementById('song');
  const controlIcon = document.getElementById('controlIcon');
  const playPauseButton = document.querySelector('.play-pause-btn');
  const nextButton = document.querySelector('.controls button.forward');
  const prevButton = document.querySelector('.controls button.backward');
  const songName = document.querySelector('.music-player h1');
  const artistName = document.querySelector('.music-player p');

  const songs = [
    {
      title: 'Beat It',
      name: 'Michael Jackson',
      source: '../audio/Beat_It.mp3',
      image: '../img/beat_it.jpg'
    },
    {
      title: 'Dangerous',
      name: 'Michael Jackson',
      source: '../audio/Dangerous.mp3',
      image: '../img/smooth_criminal.jpg'
    },
    {
      title: 'This Is It',
      name: 'Michael Jackson',
      source: '../audio/This_is_It.mp3',
      image: '../img/this_is_it.jpg'
    },
    {
      title: 'Smooth Criminal',
      name: 'Michael Jackson',
      source: '../audio/Smooth_criminal.mp3',
      image: '../img/smooth_criminal.jpg'
    },
    {
      title: 'They Don\'t Really Care About Us',
      name: 'Michael Jackson',
      source: '../audio/TDRCAU.mp3',
      image: '../img/TDRCAU.jpg'
    }
  ];

  let currentSongIndex = 0;
  let swiper;

  function updateSongInfo() {
    songName.textContent = songs[currentSongIndex].title;
    artistName.textContent = songs[currentSongIndex].name;
    song.src = songs[currentSongIndex].source;
  }

  function pauseSong() {
    song.pause();
    controlIcon.classList.remove('fa-pause');
    controlIcon.classList.add('fa-play');
  }

  function playSong() {
    song.play().catch(err => {
      console.log('Error playing audio:', err.message);
    });
    controlIcon.classList.add('fa-pause');
    controlIcon.classList.remove('fa-play');
  }

  function playPause() {
    if (song.paused) {
      playSong();
    } else {
      pauseSong();
    }
  }

  song.addEventListener('timeupdate', () => {
    if (!song.paused) {
      progress.value = song.currentTime;
    }
  });

  song.addEventListener('loadedmetadata', () => {
    progress.max = song.duration;
    progress.value = song.currentTime;
  });

  song.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongInfo();
    playSong();
    if (swiper) {
      swiper.slideTo(currentSongIndex);
    }
  });

  playPauseButton.addEventListener('click', playPause);

  progress.addEventListener('input', () => {
    song.currentTime = progress.value;
  });

  progress.addEventListener('change', () => {
    playSong();
  });

  nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongInfo();
    playPause();
    if (swiper) {
      swiper.slideTo(currentSongIndex);
    }
  });

  prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSongInfo();
    playPause();
    if (swiper) {
      swiper.slideTo(currentSongIndex);
    }
  });

  // Initialize the first song
  updateSongInfo();

  // Initialize Swiper
  swiper = new Swiper('.swiper', {
    effect: 'coverflow',
    centeredSlides: true,
    initialSlide: 0,
    slidesPerView: 'auto',
    grabCursor: true,
    spaceBetween: 40,
    coverflowEffect: {
      rotate: 25,
      stretch: 0,
      depth: 50,
      modifier: 1,
      slideShadows: false,
    }
  });

  swiper.on('slideChange', () => {
    currentSongIndex = swiper.activeIndex;
    updateSongInfo();
    playPause();
  });
});
