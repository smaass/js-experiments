var modes = {
    ionian: [0, 2, 4, 5, 7, 9, 11],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    aeolian: [0, 2, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10]
};

var scalesData = ScalesData();

function ScalesData() {
    obj = GameData();
    obj.delay = 0.4;
    obj.scaleNames = Object.keys(modes);
    obj.randomScale = function() {
        var k = this.scaleNames;
        var b = this.baseNote;
        this.scaleType = k[ Math.floor(k.length * Math.random()) ];
        this.currentScale = modes[this.scaleType].map(function (n) {
            return n + b;
        });
    }
    return obj;
}

function startScalesGame() {
    activateScalesButtons();
    if (scalesData.firstTime) {
        nextScale();
        scalesData.firstTime = false;
    }
    else {
        playCurrentScale();
    }
    $("#feedback").html("Select the scale");
    updateMarker(scalesData);
}

function activateScalesButtons() {
	$("#repeat").click(function() {
        playCurrentScale();
    });

    $(".button_selection").click(function() {
        if (scalesData.scaleType == $(this).data("value")) {
            $("#feedback").html("Good!");
            scalesData.good += 1;
            nextScale();
        }
        else {
            $("#feedback").html("Wrong :(... try again");
            scalesData.bad += 1;
            playCurrentScale();
        }
        updateMarker(scalesData);
    });
}

function nextScale() {
	scalesData.baseNote = randInt(30, 80);
	scalesData.randomScale();
	playScale(scalesData.currentScale, scalesData.delay);
}

function playCurrentScale() {
	playScale(scalesData.currentScale, scalesData.delay);
}

function playScale(scale, noteDelay) {
	var playScaleRec = function(notes) {
		playNote(notes.shift(), 0, -1);
		if (notes.length > 0) {
			setTimeout(function() { playScaleRec(notes) }, noteDelay*1000);
		}
	};
	playScaleRec(scale.slice());
}