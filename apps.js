        // dictionary of tabla sounds
var tablaSounds = { 'Dha': 'sounds/Dha.mp3', 'Dhin': 'sounds/Dhin.mp3', 'Ge': 'sounds/Ge.mp3', 'Ke': 'sounds/Ke.mp3', 'Na': 'sounds/Na.mp3', 'Ti': 'sounds/Re.mp3', 'Re': 'sounds/Re.mp3', 'Ta': 'sounds/Ta.mp3', 'Te': 'sounds/Te.mp3', 'Tin': 'sounds/Tin.mp3', 'Tun': 'sounds/Tun.mp3' , 'Dhe' : 'sounds/Dhe.mp3', '-' :'sounds/Silence.mp3'}

// Preload audio files
var preloadedSounds = {};
for (var key in tablaSounds) {
    var audio = new Audio(tablaSounds[key]);
    preloadedSounds[key] = audio;
}

        // dictionary of taals
var Taals = { 'Dadra (6)': ['Dha', 'Dhin', 'Na', 'Dha', 'Tin', 'Na'], 
    'Rupak (7)': ['Tin', 'Tin', 'Na', 'Dhin', 'Na', 'Dhin', 'Na'], 
    'Keherwa (8)' : ['Dha','Ge','Na','Ti','Na','Ke','Dhin','Na'],
    'Bhajani (8)': ['Dhin', 'Na,Dhin', '-,Dhin', 'Na', 'Tin', 'Na,Dhin', '-,Dhin', 'Na'],
    'Jhaptaal (10)': ['Dhin', 'Na', 'Dhin', 'Dhin', 'Na', 'Tin', 'Na', 'Dhin', 'Dhin', 'Na'], 
    'Ektaal (12)': ['Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te', 'Tun', 'Na', 'Ke', 'Ta', 'Dha,Ge', 'Te,Re,Ke,Te', 'Dhin', 'Na'], 
    'Teentaal (16)': ['Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Dhin', 'Dhin', 'Na', 'Dha', 'Tin', 'Tin', 'Na', 'Na', 'Dhin', 'Dhin', 'Na'], 'Choutaal (12)': ['Dha', 'Dha', 'Dhin', 'Na', 'Ke,Te', 'Dha', 'Dhin', 'Na', 'Te,Te', 'Ke,Ta', 'Ge,Tin', 'Ge,Te'],
    'Dhamaar (14)' : ['Ke', 'Dhe', 'Te', 'Dhe', 'Te', 'Dha', '-', 'Ge', 'Te', 'Re', 'Te', 'Re', 'Ta', '-'],
    'Deepchandi (14)': ['Dha', 'Dhin', '-', 'Dha', 'Dha', 'Tin', '-', 'Ta', 'Tin', '-', 'Dha', 'Dha', 'Dhin', '-'],
    'Jhoomra (14)': ['Dhin', '-,Dha', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te', 'Tin', '-,Ta', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha,Ge', 'Te,Re,Ke,Te'],
    'Tilwada (16)': ['Dha', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Ta', 'Te,Re,Ke,Te', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin'] }

// Function to play a Tabla note
function playTablaNotes(note1) {
    var audio1 = preloadedSounds[note1]; // Use preloaded audio object
    audio1.currentTime = 0; // Rewind audio to the beginning
    audio1.play(); // Play first sound

}



// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Populate the select dropdown with taals
    var select = document.getElementById('taalSelect');
    var defaultTaal = 'Teentaal (16)'; // Set your default taal here

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


    playButton.addEventListener('click', function () {
        if (isPlaying) return; // Do nothing if already playing

        stopFlag = false; // Reset stopFlag when play is clicked
        isPlaying = true; // Set isPlaying to true when playing
        
        var taal = Taals[select.value]; // get the selected taal
       
        var bpm = document.getElementById('bpm').value;  // get bpm value from input
        var beatduration = (60 / bpm) * 1000; // Calculate duration in milliseconds

        var currentBolIndex = 0;    // Index to keep track of current bol
        var startTime = Date.now(); // Start time of the taal

        // Flatten the taal array to get all bols with their respective timings
        var allBols = [];
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
                document.getElementById('mindexDisplay').textContent = (allBols[currentBolIndex].mindex+1); // Update mindex display

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
    });
});
