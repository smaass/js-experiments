
var midiLoaded = false;
var chordTypes = {
    min: [0, 3, 7],
    maj: [0, 4, 7],
    sus4: [0, 5, 7]
};
var intervalsData = IntervalsData();
var chordsData = ChordsData();

function IntervalsData() {
    obj = GameData();
    obj.interval = 0;
    return obj;
}

function ChordsData() {
    obj = GameData();
    obj.delay = 1;
    obj.chordKeys = Object.keys(chordTypes);
    obj.randomChord = function() {
        var k = obj.chordKeys;
        obj.chordForm = k[ Math.floor(k.length * Math.random()) ];
        obj.currentChord = chordTypes[obj.chordForm].map(function (n) {
            return n + obj.baseNote;
        });
    }
    return obj;
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
    if (name == 'intervals') {
        startIntervalsGame();
    }
    else if (name == 'chords') {
        startChordsGame();
    }
}

function startIntervalsGame() {
    activateIntervalButtons();
    if (intervalsData.firstTime) {
        nextInterval();
        intervalsData.firstTime = false;
    }
    else {
        playInterval();
    }
    $("#feedback").html("Select the interval");
    updateMarker(intervalsData);
}

function activateIntervalButtons() {
    $("#repeat").click(function() {
        playInterval();
    });

    $(".button_selection").click(function() {
        if (Math.abs(intervalsData.interval) == $(this).data("value")) {
            $("#feedback").html("Good!");
            intervalsData.good += 1;
            nextInterval();
        }
        else {
            $("#feedback").html("Wrong :(... try again");
            intervalsData.bad += 1;
            playInterval();
        }
        updateMarker(intervalsData);
    });
}

function startChordsGame() {
    activateChordButtons();
    if (chordsData.firstTime) {
        nextChord();
        chordsData.firstTime = false;
    }
    else {
        playCurrentChord();
    }
    $("#feedback").html("Select the chord");
    updateMarker(chordsData);
}

function activateChordButtons() {
    $("#repeat").click(function() {
        playCurrentChord();
    });

    $(".button_selection").click(function() {
        if (chordsData.chordForm == $(this).data("value")) {
            $("#feedback").html("Good!");
            chordsData.good += 1;
            nextChord();
        }
        else {
            $("#feedback").html("Wrong :(... try again");
            chordsData.bad += 1;
            playCurrentChord();
        }
        updateMarker(chordsData);
    });
}

function updateMarker(gameData) {
    $("#marker .good").html(gameData.good);
	$("#marker .bad").html(gameData.bad);
}

function randInt(min, max) {
    return min + Math.floor(Math.random()*(max - min + 1));
}

function nextInterval() {
    intervalsData.baseNote = randInt(40, 80);
    intervalsData.interval = randInt(-14, 14); // 14 semitones. Up or down.
    playInterval();
}

function nextChord() {
    chordsData.baseNote = randInt(30, 80);
    chordsData.randomChord();
    playChord(chordsData.currentChord, chordsData.delay);
}

function playCurrentChord() {
    playChord(chordsData.currentChord, chordsData.delay);
}

function playChord(notes, duration) {
    MIDI.chordOn(0, notes, chordsData.velocity, 0);
    MIDI.chordOff(0, notes, duration);
}

function playNote(note, delay, duration) {
    MIDI.noteOn(0, note, intervalsData.velocity, delay);
    MIDI.noteOff(0, note, delay + duration);
}

function playInterval() {
    var id = intervalsData;
    playNote(id.baseNote, 0, id.delay);
    playNote(id.baseNote + id.interval, id.delay, id.delay);
}