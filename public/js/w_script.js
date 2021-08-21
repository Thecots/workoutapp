var socket = io();
loadScreen(true);
// Functions

function getTagId() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var video_id = url.searchParams.get("v");
    return video_id;
}


// Youtube API

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady(e) {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: getTagId(),
        playerVars: { 'autoplay': 1 },
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
    loadScreen(false);

};

function onPlayerReady(event) {
        event.target.playVideo();
};

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
        console.log('1');
    }

};

function stopVideo() {
    player.stopVideo();
}



// Key controlls
const log = document.getElementById('log');
document.addEventListener('keypress', logKey);

function logKey(e) {
  if(e.code = 'NumpadAdd'){
    startTime();
  }
  /* console.log(e.code); */
}