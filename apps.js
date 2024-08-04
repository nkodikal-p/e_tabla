        // dictionary of tabla sounds
var tablaSounds = { 'Dha': 'sounds/Dha.mp3', 'Dhin': 'sounds/Dhin.mp3', 'Ge': 'sounds/Ge.mp3', 'Ke': 'sounds/Ke.mp3', 'Na': 'sounds/Na.mp3', 'Re': 'sounds/Re.mp3', 'Ta': 'sounds/Ta.mp3', 'Te': 'sounds/Te.mp3', 'Tin': 'sounds/Tin.mp3', 'Tun': 'sounds/Tun.mp3' , 'Dhe' : 'sounds/Dhe.mp3'}

// Preload audio files
var preloadedSounds = {};
for (var key in tablaSounds) {
    var audio = new Audio(tablaSounds[key]);
    preloadedSounds[key] = audio;
}

        // dictionary of taals
var Taals = { 'Dadra': ['Dha', 'Dhin', 'Na', 'Dha', 'Tin', 'Na'], 
    'Ektaal': ['Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te', 'Tun', 'Na', 'Ke', 'Ta', 'Dha,Ge', 'Te,Re,Ke,Te', 'Dhin', 'Na'], 
    'jhap': ['Dhin', 'Na', 'Dhin', 'Dhin', 'Na', 'Tin', 'Na', 'Dhin', 'Dhin', 'Na'], 
    'Rupak': ['Tin', 'Tin', 'Na', 'Dhin', 'Na', 'Dhin', 'Na'], 
    'Teentaal': ['Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Tin', 'Tin', 'Na', 'Na', 'Dhin' ,'Dhin', 'Na'] }

// Function to play a Tabla note
function playTablaNotes(note1) {
    var audio1 = preloadedSounds[note1]; // Use preloaded audio object
    audio1.currentTime = 0; // Rewind audio to the beginning
    audio1.play(); // Play first sound

}


// loop through the tablaSounds dictionary and create a button for each sound
for (var key in tablaSounds) {
    var button = document.createElement('button');
    button.textContent = key;
    button.addEventListener('click', function () {
        playTablaNotes(this.textContent, 1000);
    });
    document.body.appendChild(button);
}

var timeoutIds = []; // Array to store timeout IDs

// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Populate the select dropdown with taals
    var select = document.getElementById('taalSelect');
    for (var key in Taals) {
        var option = document.createElement('option');
        option.textContent = key;
        select.appendChild(option);
    }

    // create a button to play the selected taal
    var playButton = document.getElementById('playTaalButton');
    playButton.textContent = 'Play';

    // create a button to stop the playback
    var stopButton = document.getElementById('stopTaalButton');
    stopButton.textContent = 'Stop';

    var stopFlag = false;

    playButton.addEventListener('click', function () {
        stopFlag = false; // Reset stopFlag when play is clicked
        var taal = Taals[select.value];
        // get bpm value
        var bpm = document.getElementById('bpm').value;
        var duration = (60/bpm) * 1000; // Calculate duration in milliseconds
        // Array to store timeout IDs
  

        // Loop through the taal array and schedule each note to play with a delay
        for (var i = 0; i < taal.length; i++) {
            (function (i) {
                var timeoutId = setTimeout(function () {
                    if (stopFlag) return; // Check stopFlag before playing each note
                    // split taal[i] if it has commas
                    var notes = taal[i].split(',');
                    if (notes.length > 1) {
                        for (var j = 0; j < notes.length; j++) {
                            (function (j) {
                                var innerTimeoutId = setTimeout(function () {
                                    if (stopFlag) return; // Check stopFlag before playing each note
                                    playTablaNotes(notes[j]);
                                    console.log(notes[j]);
                                }, j * (duration / notes.length));
                                timeoutIds.push(innerTimeoutId); // Store inner timeout ID
                            })(j);
                        }
                    } else {
                        playTablaNotes(taal[i]);
                        console.log(taal[i]);
                    }
                }, i * duration);
                timeoutIds.push(timeoutId); // Store timeout ID
            })(i);
        }
    });

    function clearTimeouts() {
        // Clear all stored timeouts
        for (var i = 0; i < timeoutIds.length; i++) {
            clearTimeout(timeoutIds[i]);
        }
        timeoutIds = []; // Reset the timeout IDs array
    }


    // Stop button event listener
    stopButton.addEventListener('click', function () {
        stopFlag = true; // Set stopFlag to true when stop is clicked
        clearTimeouts(); // Clear any existing timeouts

    });
});