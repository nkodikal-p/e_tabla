var tablaSounds = {};
var preloadedSounds = {};

function updateTablaSoundsForKey(key) {
    const bols = ['Dha', 'Dhin', 'Ge', 'Ke', 'Na', 'Re', 'Ta', 'Te', 'Tin', 'Tun', 'Dhe', '-'];
    tablaSounds = {};
    preloadedSounds = {};
    bols.forEach(bol => {
        if (bol === '-') {
            tablaSounds[bol] = 'sounds/Silence.mp3';
        } else {
            const keyMap = { 'C': 'C', 'G#': 'Gs' };
            tablaSounds[bol] = `sounds/${bol}_${keyMap[key]}.mp3`;
        }
        preloadedSounds[bol] = new Audio(tablaSounds[bol]);
    });
}


// dictionary of taals
var Taals = {
    'Dadra (6)': ['Dha', 'Dhin', 'Na', 'Dha', 'Tin', 'Na'],
    'Rupak (7)': ['Tin', 'Tin', 'Na', 'Dhin', 'Na', 'Dhin', 'Na'],
    'Keherwa (8)': ['Dha', 'Ge', 'Na', 'Te', 'Na', 'Ke', 'Dhin', 'Na'],
    'Bhajani (8)': ['Dhin', 'Na,Dhin', '-,Dhin', 'Na', 'Tin', 'Na,Dhin', '-,Dhin', 'Na'],
    'Jhaptaal (10)': ['Dhin', 'Na', 'Dhin', 'Dhin', 'Na', 'Tin', 'Na', 'Dhin', 'Dhin', 'Na'],
    'Ektaal (12)': ['Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te', 'Tun', 'Na', 'Ke', 'Ta', 'Dha,Ge', 'Te,Re,Ke,Te', 'Dhin', 'Na'],
    'Teentaal (16)': ['Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Tin', 'Tin', 'Na', 'Na', 'Dhin', 'Dhin', 'Na'], 
    'Choutaal (12)': ['Dha', 'Dha', 'Dhin', 'Na', 'Ke,Te', 'Dha', 'Dhin', 'Na', 'Te,Te', 'Ke,Ta', 'Ge,Tin', 'Ge,Te'],
    'Dhamaar (14)': ['Ke', 'Dhe', 'Te', 'Dhe', 'Te', 'Dha', '-', 'Ge', 'Te', 'Re', 'Te', 'Re', 'Ta', '-'],
    'Deepchandi (14)': ['Dha', 'Dhin', '-', 'Dha', 'Dha', 'Tin', '-', 'Ta', 'Tin', '-', 'Dha', 'Dha', 'Dhin', '-'],
    'Jhoomra (14)': ['Dhin', '-,Dha', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te', 'Tin', '-,Ta', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te'],
    'Tilwada (16)': ['Dha', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Ta', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin']
}

// Function to play a Tabla note
function playTablaNotes(note1) {
    var audio1 = preloadedSounds[note1]; // Use preloaded audio object
    audio1.currentTime = 0; // Rewind audio to the beginning
    audio1.volume = 1.0; // Set volume to 25%
    audio1.play(); // Play first sound

}


// Function to play a Piano note
function playPianoNotes(note1) {
    var audio1 = preloadedPiano[note1]; // Use preloaded audio object
    audio1.currentTime = 0; // Rewind audio to the beginning
    audio1.volume = 1.0; // Set volume to 25%
    audio1.play(); // Play piano sound
}



// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
 
        // Populate the select dropdown with taals
    var select = document.getElementById('taalSelect');
    var defaultTaal = 'Teentaal (16)'; // Set your default taal here

    var keySelect = document.getElementById('keySelect');
    keySelect.addEventListener('change', function () {
        updateTablaSoundsForKey(this.value);
    });

// Initialize tabla sounds for the default key at startup
updateTablaSoundsForKey(keySelect.value);
    
    for (var key in Taals) { // get all the keys in the Taals dictionary
        var option = document.createElement('option');
        option.textContent = key;
        if (key === defaultTaal) {
            option.selected = true; // Set the default taal as selected
        }
        select.appendChild(option);
    }

    // create a button to play the selected taal
    var playButton = document.getElementById('playTaalButton');

    // create a button to stop the playback
    var stopButton = document.getElementById('stopTaalButton');

    var stopFlag = false; // Flag to track if stop button is clicked
    var isPlaying = false; // Flag to track if playback is ongoing
    var intervalId;


    // Get references to the bpm buttons and input
    var decreaseBpmButton = document.getElementById('decreaseBpmButton');
    var increaseBpmButton = document.getElementById('increaseBpmButton');
    var bpmInput = document.getElementById('bpm');
    var bpmValue = document.getElementById('bpmValue');
    // Add event listener for decreaseBpmButton
    decreaseBpmButton.addEventListener('click', () => {
        let currentBpm = parseInt(bpmInput.value, 10);
        if (!isNaN(currentBpm) && currentBpm > 5) {
            bpmInput.value = currentBpm - 5;
            bpmInput.dispatchEvent(new Event('input')); 
       }
    });

    // Add event listener for increaseBpmButton
    increaseBpmButton.addEventListener('click', () => {
        let currentBpm = parseInt(bpmInput.value, 10);
        if (!isNaN(currentBpm) && currentBpm < 300) {
            bpmInput.value = currentBpm + 5;
            bpmInput.dispatchEvent(new Event('input')); 
        }
    });

    bpmInput.addEventListener('input', function () {
        bpmValue.textContent = bpmInput.value;

        if (isPlaying) {
            // Calculate elapsed time in old BPM
            let elapsed = Date.now() - startTime;
            beatduration = (60 / parseInt(bpmInput.value, 10)) * 1000;
            allBols = [];
            taal.forEach((matra, mindex) => {
                let bols = matra.split(',');
                let bolduration = beatduration / bols.length;
                bols.forEach((bol, bindex) => {
                    allBols.push({
                        bol: bol,
                        time: mindex * beatduration + bindex * bolduration,
                        mindex: mindex
                    });
                });
            });
            // Find the new currentBolIndex based on elapsed time
            currentBolIndex = allBols.findIndex(bol => bol.time > elapsed);
            if (currentBolIndex === -1) currentBolIndex = allBols.length - 1;
            // Adjust startTime so playback continues smoothly
            startTime = Date.now() - (allBols[currentBolIndex]?.time || 0);
        }
    });

    let allBols = [];
    let currentBolIndex = 0;
    let beatduration = 0;
    let startTime = 0;
    let taal = null;

    playButton.addEventListener('click', function () {
        if (isPlaying) return; // Do nothing if already playing

        stopFlag = false; // Reset stopFlag when play is clicked
        isPlaying = true; // Set isPlaying to true when playing

        taal = Taals[taalSelect.value]; // Get taal from the select dropdown
        beatduration = (60 / parseInt(bpmInput.value, 10)) * 1000; // No 'var' or 'let'
        allBols = [];
        currentBolIndex = 0;
        startTime = Date.now(); // Start time of the taal

        // Flatten the taal array to get all bols with their respective timings
        taal.forEach((matra, mindex) => { // Loop through each matra
            let bols = matra.split(','); // Split the matra to get individual bols if there are multiple
            let bolduration = beatduration / bols.length;
            bols.forEach((bol, bindex) => { // Loop through each bol
                allBols.push({  // Push the bol with its time to the allBols array
                    bol: bol,
                    time: mindex * beatduration + bindex * bolduration,
                    mindex: mindex // Store the mindex with each bol
                });
            });
        });

        // Function to play bols at the correct time
        function playBols() {
            if (stopFlag) {
                isPlaying = false;
                return; // Check stopFlag before playing each note
            }

            var currentTime = Date.now() - startTime; // Calculate current time
            while (currentBolIndex < allBols.length && allBols[currentBolIndex].time <= currentTime) {  // Check if the current time is greater than the time of the next bol
                playTablaNotes(allBols[currentBolIndex].bol); // Play the bol
                document.getElementById('mindexDisplay').textContent = (allBols[currentBolIndex].mindex+1); // Update matra index display

                currentBolIndex++; // Increment the index to move to the next bol
            }

            // Check if the last bol has been played and wait for its duration to complete
            if (currentBolIndex >= allBols.length) { // Check if all bols have been played
                var lastBolTime = allBols[allBols.length - 1].time; // Get the time of the last bol
                var lastBolDuration = beatduration / taal[taal.length - 1].split(',').length; // Calculate duration of the last bol
                if (currentTime >= lastBolTime + lastBolDuration) {
                    currentBolIndex = 0; // Reset index to start from the beginning
                    startTime = Date.now(); // Reset start time
                }
            }
        }

        // Start the interval to check and play bols
        intervalId = setInterval(function () {
            if (!stopFlag) { // Check stopFlag before playing bols
                playBols();
            }
        }, 10); // Check every 10ms for precise timing
        
    });

    // Add event listener for stop button
    stopButton.addEventListener('click', function () {
        stopFlag = true; // Set stopFlag to true to stop playing bols
        clearInterval(intervalId); // Clear the interval
        isPlaying = false; // Set isPlaying to false when stopped
        document.getElementById('mindexDisplay').textContent = "  " // Clear matra index display
    });
});
