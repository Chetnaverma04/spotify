console.log("hello it's time to write Jsf ");
let currentSong = new Audio();
let songs;
// let currFolder;

function secondToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSecond = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSecond}`
}

async function getSongs() {
  // currFolder = folder;
  let a = await fetch('http://127.0.0.1:5500/songs/');
  let response = await a.text();
  // console.log(response);
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = response;
  let as = tempDiv.getElementsByTagName("a");
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(/songs/)[1]);
    }

  }
  return songs
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  // play or pause the audio
  currentSong.src =/songs/ + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};


async function main() {


  // get the list of all the songs 
  songs = await getSongs("songs/ncs");
  playMusic(songs[0], true)

  // show all the songs in the playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Chetna</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class ="invert" src="play.svg" alt="">
                            </div>   </li>`;
  }
  //Attach  eventLisner 

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML)
      // playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  });

  //attach evenlistner to play,next and previous.
}


play.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "pause.svg";
  }
  else {
    currentSong.pause();
    play.src = "play.svg"
  }
})

// listen for time update event

currentSong.addEventListener("timeupdate", () => {
  console.log(currentSong.currentTime, currentSong.duration);
  document.querySelector(".songtime").innerHTML = `${secondToMinutesSeconds(currentSong.currentTime)}/${secondToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

})




// add an evenlistner for seek bar

document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX/e.target.getBoundingClientRect().width)* 100;
  document.querySelector(".circle").style.left = percent+ "%";
  currentSong.currentTime = ((currentSong.duration)*percent)/ 100

  // getBoundingClientRect() = Know the value of X , Y , Height , Width.
})

// add evenlistner  for hamburger

document.querySelector(".hamburger").addEventListener('click',()=>{
  document.querySelector(".left").style.left = 0
});

// add evenlistner  for close btn

document.querySelector(".close").addEventListener('click',()=>{
  document.querySelector(".left").style.left = "-150%"
});

// add evenlistner to previous and next

previous.addEventListener('click',()=>{
  console.log("previews click")
  let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]) 
  console.log(index) 
  if((index-1) >= 0){
    playMusic(songs[index-1])
  }     

})

// add event listner to next

next.addEventListener('click',()=>{
  console.log("next click")

  let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]) 
  // console.log(index) 
  if((index+1) < songs.length){
    playMusic(songs[index+1])
  }
})

// add an event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log("Setting volume to ", e.target.value ,"/100")
  currentSong.volume = parseInt(e.target.value)/100
})

// Assuming you have an audio or video element with id "myAudio" or "myVideo"
// const mediaElement = document.querySelector(".range").getElementsByTagName("input")

// if (mediaElement) {
//   mediaElement.volume = 0; // Mute the volume
// }


main();