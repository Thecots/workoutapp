var socket = io();
loadScreen(true);
// Functions

function getTagId() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var video_id = url.searchParams.get("v");
    return video_id;
}

function getTagIdRutine() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var video_id = url.searchParams.get("id");
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
    }

};

function stopVideo() {
    player.stopVideo();
    $(".media-youtube-player").contents().find(".ytp-pause-overlay").remove();

}

function finishWorkout(){
    let d = new Date();
    let data = {
        year:  d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
        id: getTagIdRutine()
    }
    socket.emit('client:save_rutina_to_calendar', data);
}


$('#btnfinish').html(`
<button class="r__btn btn-no" onclick="finishWorkout()" style="background-color: rgba(67, 112, 247, 0.904);">Finalizar</button>
`);


socket.on('server:workout_saved', () =>{
    window.location.href = '/calendario';
})
