var intervalsData = IntervalsData();

function IntervalsData() {
    obj = GameData();
    obj.interval = 0;
    return obj;
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

function nextInterval() {
    intervalsData.baseNote = randInt(40, 80);
    intervalsData.interval = randInt(-14, 14); // 14 semitones. Up or down.
    playInterval();
}

function playInterval() {
    var id = intervalsData;
    playNote(id.baseNote, 0, -1);
    playNote(id.baseNote + id.interval, id.delay, -1);
}