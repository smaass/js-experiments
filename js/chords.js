var chordTypes = {
    min: [0, 3, 7],
    maj: [0, 4, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    seventh: [0, 4, 7, 10],
    m7: [0, 3, 7, 10],
    maj7: [0, 4, 7, 11]
};
var chordsData = ChordsData();

function ChordsData() {
    obj = GameData();
    obj.delay = 1;
    obj.chordKeys = Object.keys(chordTypes);
    obj.randomChord = function() {
        var k = this.chordKeys;
        var b = this.baseNote;
        this.chordForm = k[ Math.floor(k.length * Math.random()) ];
        this.currentChord = chordTypes[this.chordForm].map(function (n) {
            return n + b;
        });
        return this.currentChord;
    }
    return obj;
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

function nextChord() {
    chordsData.baseNote = randInt(40, 80);
    playChord(chordsData.randomChord(), chordsData.delay);
}

function playCurrentChord() {
    playChord(chordsData.currentChord, chordsData.delay);
}