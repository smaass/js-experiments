function include(file) {
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;
  document.body.appendChild(script);
}

function includeJSFiles() {
    include('js/intervals.js');
    include('js/chords.js');
    include('js/scales.js');
}

function GameData() {
    return {
        good: 0,
        bad: 0,
        velocity: 127,
        delay: 0.8,
        baseNote: 0,
        firstTime: true
    }
}

var midiLoaded = false;

$(document).ready(function() {
    includeJSFiles();
    loadPlayMode(true);

    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instruments: [ "acoustic_grand_piano", "synth_drum" ],
        callback: function () {
            MIDI.programChange(0, 0); // Grand piano
            MIDI.programChange(1, 118); // Synth drum
            midiLoaded = true;
            startGame(getPlayMode(false));
        }
    });
});

$(".button_menu").click(function() {
    if (!$(this).hasClass("active")) {
        $("#menu").find(".active").removeClass("active");
        $(this).addClass("active");
        loadPlayMode(false);
    }
});

function getPlayMode(fromHash) {
    if (fromHash) {
        var tag = window.location.hash.substring(1);
        if (tag == "intervals" || tag == "chords" || tag == "scales") {
            $("#menu").find(".active").removeClass("active");
            $("a[data-mode='" + tag + "']").addClass("active");
            return tag;
        }
    }
    return $("#menu").find(".active").data("mode");
}

function loadPlayMode(fromHash) {
    var name = getPlayMode(fromHash);
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
    if (name == 'intervals') {
        startIntervalsGame();
    }
    else if (name == 'chords') {
        startChordsGame();
    }
    else if (name == 'scales') {
        startScalesGame();
    }
}

function updateMarker(gameData) {
    $("#marker .good").html(gameData.good);
    $("#marker .bad").html(gameData.bad);
}

function randInt(min, max) {
    return min + Math.floor(Math.random()*(max - min + 1));
}

function playChord(notes, duration) {
    MIDI.chordOn(0, notes, chordsData.velocity, 0);
    MIDI.chordOff(0, notes, duration);
}

function playNote(note, delay, duration) {
    // duration < 0: let ring
    MIDI.noteOn(0, note, intervalsData.velocity, delay);
    if (duration > 0) {
        MIDI.noteOff(0, note, delay + duration);
    }
}