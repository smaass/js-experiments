var velocity = 127;
var delay = 0.8;
var baseNote = 0;
var interval = 0;
var good = 0;
var bad = 0;
var midiLoaded = false;

$(document).ready(function() {
    loadPlayMode();

    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instruments: [ "acoustic_grand_piano", "synth_drum" ],
        callback: function () {
            MIDI.programChange(0, 0); // Grand piano
            MIDI.programChange(1, 118); // Synth drum
            midiLoaded = true;
            startGame(getPlayMode());
        }
    });
});

$(".button_menu").click(function() {
    if (!$(this).hasClass("active")) {
        $("#menu").find(".active").removeClass("active");
        $(this).addClass("active");
        loadPlayMode();
    }
});

function getPlayMode() {
    return $("#menu").find(".active").data("mode");
}

function loadPlayMode() {
    var name = getPlayMode();
    $.get(name + ".html", function(data) {
        $("#main").html(data);
        if (!midiLoaded) {
            $("#feedback").html("Loading...");
        }
        else {
            startGame(name);
        }
    });
}

function startGame(name) {
    if (name == 'practice') {
        startPracticeGame();
    }
    else {
        startLearningGame();
    }
}

function startPracticeGame() {
    activatePracticeListeners();
    nextInterval();
    $("#feedback").html("Select the interval");
    updateMarker();
}

function activatePracticeListeners() {
    $("#repeat").click(function() {
        playInterval();
    });

    $(".button_interval").click(function() {
        if (Math.abs(interval) == $(this).data("value")) {
            $("#feedback").html("Good!");
            good += 1;
            nextInterval();
        }
        else {
            $("#feedback").html("Wrong :(... try again");
            bad += 1;
            playInterval();
        }
        updateMarker();
    });
}

function startLearningGame() {

}

function updateMarker() {
    $("#marker .good").html(good);
	$("#marker .bad").html(bad);
}

function randInt(min, max) {
    return min + Math.floor(Math.random()*(max - min + 1));
}

function nextInterval() {
    baseNote = randInt(40, 80);
    interval = randInt(-14, 14); // 14 semitones. Up or down.
    playInterval();
}

function playNote(note, delay, duration) {
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + duration);
}

function playInterval() {
    playNote(baseNote, 0, delay);
    playNote(baseNote + interval, delay, delay);
}