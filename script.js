let currentSong = new Audio();
let songs = [];
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSecond = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSecond}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
          songs.push(element.href.split(`/${folder}/`)[1]);
      }
  }
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track
  if (!pause) {
      currentSong.play()
      play.src = "svg/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
  let cards = document.getElementsByClassName("card");
  Array.from(cards).forEach(card => {
      let folder = card.dataset.folder;
      card.addEventListener("click", async () => {
          await getSongs(`songs/${folder}`);
          if (songs.length > 0) {
              playMusic(songs[0]);
          } else {
              console.log("No songs found in the folder.");
          }
      });
  });
}


async function main() {
  // get the list of all the songs 
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  // Display all the albums on the page
  displayAlbums();

  // Show all the songs in the playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
      songUL.innerHTML += `<li><img class="invert" src="svg/music.svg" alt="">
                          <div class="info">
                              <div>${song.replaceAll("%20", " ")}</div>
                              <div>Chetna</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img class ="invert" src="svg/play.svg" alt="">
                          </div>   </li>`;
  }
  //Attach  eventLisner 

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
        let songName = e.querySelector(".info").firstElementChild.innerHTML;
        playMusic(songName);
    });
});

  //attach evenlistner to play,next and previous.

  play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play().catch(error => {
            console.error('Failed to play the song:', error);
        });
        play.src = "svg/pause.svg";
    } else {
        currentSong.pause();
        play.src = "svg/play.svg";
    }
});

document.addEventListener("click", () => {
  if (!currentSong.paused) {
      currentSong.play();
  }
});

// listen for time update event

currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

// add an evenlistner for seek bar

document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = ((currentSong.duration) * percent) / 100;
});

// add evenlistner  for hamburger

document.querySelector(".hamburger").addEventListener('click', () => {
  document.querySelector(".left").style.left = 0;
});

document.querySelector(".close").addEventListener('click', () => {
  document.querySelector(".left").style.left = "-150%";
});

// add evenlistner to previous and next

previous.addEventListener('click', () => {
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
  }
});

// add event listner to next

next.addEventListener('click', () => {
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
  }
});

// add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  currentSong.volume = parseInt(e.target.value) / 100;
});

//load the playlist whenever card is click

Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click",async item=>{
    await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    updatePlaylistAndListeners();
  })
})

async function updatePlaylistAndListeners() {
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `<li><img class="invert" src="svg/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Chetna</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class ="invert" src="svg/play.svg" alt="">
                            </div>   </li>`;
  }


}

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e => {
  if (e.target.src.includes("svg/volume.svg")) {
      e.target.src = e.target.src.replace("svg/volume.svg", "svg/mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  } else {
      e.target.src = e.target.src.replace("svg/mute.svg", "svg/volume.svg");
      currentSong.volume = .20;
      document.querySelector(".range").getElementsByTagName("input")[0].value = .10;
  }
});

// Load the playlist whenever a card is clicked
Array.from(document.getElementsByClassName("card")).forEach(card => {
  card.addEventListener("click", async () => {
      let folder = `songs/${card.dataset.folder}`;
      await getSongs(folder);
      updatePlaylistAndListeners();
  });
});

// Update playlist and listeners initially
async function updatePlaylistAndListeners() {
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
      songUL.innerHTML += `<li><img class="invert" src="svg/music.svg" alt="">
                              <div class="info">
                                  <div>${song.replaceAll("%20", " ")}</div>
                                  <div>Chetna</div>
                              </div>
                              <div class="playnow">
                                  <span>Play Now</span>
                                  <img class="invert" src="svg/play.svg" alt="">
                              </div>
                          </li>`;
  }

  // Reattach event listeners to song list items
  Array.from(songUL.getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", () => {
          let songName = e.querySelector(".info").firstElementChild.innerHTML;
          playMusic(songName);
      });
  });
}
}




main();