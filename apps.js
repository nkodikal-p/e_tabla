        // dictionary of tabla sounds
var tablaSounds = { 'Dha': 'sounds/Dha.mp3', 'Dhin': 'sounds/Dhin.mp3', 'Ge': 'sounds/Ge.mp3', 'Ke': 'sounds/Ke.mp3', 'Na': 'sounds/Na.mp3', 'Re': 'sounds/Re.mp3', 'Ta': 'sounds/Ta.mp3', 'Te': 'sounds/Te.mp3', 'Tin': 'sounds/Tin.mp3', 'Tun': 'sounds/Tun.mp3' , 'Dhe' : 'sounds/Dhe.mp3'}

// Preload audio files
var preloadedSounds = {};
for (var key in tablaSounds) {
    var audio = new Audio(tablaSounds[key]);
    preloadedSounds[key] = audio;
}

        // dictionary of taals
var Taals = { 'Dadra (6)': ['Dha', 'Dhin', 'Na', 'Dha', 'Tin', 'Na'], 
    'Rupak (7)': ['Tin', 'Tin', 'Na', 'Dhin', 'Na', 'Dhin', 'Na'], 
    'Jhaptaal (10)': ['Dhin', 'Na', 'Dhin', 'Dhin', 'Na', 'Tin', 'Na', 'Dhin', 'Dhin', 'Na'], 
    'Ektaal (12)': ['Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te', 'Tun', 'Na', 'Ke', 'Ta', 'Dha,Ge', 'Te,Re,Ke,Te', 'Dhin', 'Na'], 
    'Teentaal (16)': ['Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Tin', 'Tin', 'Na', 'Na', 'Dhin' ,'Dhin', 'Na'] }

// Function to play a Tabla note
function playTablaNotes(note1) {
    var audio1 = preloadedSounds[note1]; // Use preloaded audio object
    audio1.currentTime = 0; // Rewind audio to the beginning
    audio1.play(); // Play first sound

}


// // loop through the tablaSounds dictionary and create a button for each sound
// for (var key in tablaSounds) {
//     var button = document.createElement('button');
//     button.textContent = key;
//     button.addEventListener('click', function () {
//         playTablaNotes(this.textContent, 1000);
//     });
//     document.body.appendChild(button);
// }


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
    
    // create a button to stop the playback
    var stopButton = document.getElementById('stopTaalButton');
    
    var stopFlag = false;
    var isPlaying = false; // Flag to track if playback is ongoing
    var intervalId;


    playButton.addEventListener('click', function () {
        if (isPlaying) return; // Do nothing if already playing

        stopFlag = false; // Reset stopFlag when play is clicked
        isPlaying = true; // Set isPlaying to true when playing
        
        var taal = Taals[select.value];
        // get bpm value
        var bpm = document.getElementById('bpm').value;
        var beatduration = (60 / bpm) * 1000; // Calculate duration in milliseconds

        var currentBolIndex = 0;
        var startTime = Date.now();

        // Flatten the taal array to get all bols with their respective timings
        var allBols = [];
        taal.forEach((matra, mindex) => {
            let bols = matra.split(',');
            let bolduration = beatduration / bols.length;
            bols.forEach((bol, bindex) => {
                allBols.push({
                    bol: bol,
                    time: mindex * beatduration + bindex * bolduration
                });
            });
        });

        // Function to play bols at the correct time
        function playBols() {
            if (stopFlag) {
                isPlaying = false;
                return; // Check stopFlag before playing each note
            }

            var currentTime = Date.now() - startTime;
            while (currentBolIndex < allBols.length && allBols[currentBolIndex].time <= currentTime) {
                playTablaNotes(allBols[currentBolIndex].bol);
                currentBolIndex++;
            }

            // Check if the last bol has been played and wait for its duration to complete
            if (currentBolIndex >= allBols.length) {
                var lastBolTime = allBols[allBols.length - 1].time;
                var lastBolDuration = beatduration / taal[taal.length - 1].split(',').length;
                if (currentTime >= lastBolTime + lastBolDuration) {
                    currentBolIndex = 0; // Reset index to start from the beginning
                    startTime = Date.now(); // Reset start time
                }
            }
        }

        // Start the interval to check and play bols
        intervalId = setInterval(function () {
            if (!stopFlag) {
                playBols();
            }
        }, 10); // Check every 10ms for precise timing
    });

    // Add event listener for stop button
    stopButton.addEventListener('click', function () {
        stopFlag = true; // Set stopFlag to true to stop playing bols
        clearInterval(intervalId); // Clear the interval
        isPlaying = false; // Set isPlaying to false when stopped
    });
});
