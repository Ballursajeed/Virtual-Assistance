const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
let isSpeaking = false;

function speak(sentence) {
    const text_speak = new SpeechSynthesisUtterance(sentence);

    text_speak.rate = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
    isSpeaking = true; // Update flag when speech synthesis starts
}

function wishMe() {
    var day = new Date();
    var hr = day.getHours();

    if(hr >= 0 && hr < 12) {
        speak("Good Morning Boss");
    }

    else if(hr == 12) {
        speak("Good noon Boss");
    }

    else if(hr > 12 && hr <= 17) {
        speak("Good Afternoon Boss");
    }

    else {
        speak("Good Evening Boss");
    }
}

window.addEventListener('load', ()=>{
    speak("Activating Inertia");
    speak("Going online");
    wishMe();
})

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    speakThis(transcript.toLowerCase());
}

btn.addEventListener('click', ()=>{
    recognition.start();
})

 async function getGoogleAIResponse(userInput) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB6m5YN2v0BVUqFHiKsmGWJbOOVkPl3PfM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userInput
                    }]
                }]
            })
        });

        const data = await response.json();

        // Check if the response contains any candidates
        if (data && data.candidates && data.candidates.length > 0) {
            // Get the text content from the first candidate
            const textContent = data.candidates[0].content.parts[0].text;
            return textContent;
        } else {
            throw new Error('No candidates found in response from Google AI API');
        }
    } catch (error) {
        console.error('Error fetching Google AI response:', error);
        throw error; // Rethrow the error to handle it outside this function
    }
}


 async function speakGoogleAIResponse(userInput) {
    try {
        const response = await getGoogleAIResponse(userInput);
        return response;
    } catch (error) {
        console.error('Error fetching Google AI response:', error);
    }
}

 // Function to stop speech synthesis
function stopSpeaking() {
    window.speechSynthesis.cancel();
    isSpeaking = false; // Update flag when speech synthesis stops
}

async function speakThis(message) {
    const speech = new SpeechSynthesisUtterance();

    speech.text = "I did not understand what you said please try again";

    if (message.includes('stop') || message.includes('stops') || message.includes('ok stop') || message.includes('stop speaking')) {
         stopSpeaking();
    }

    if(message.includes('hey') || message.includes('hello')) {
        const finalText = "Hello Boss";
        speech.text = finalText;
    }

    else if(message.includes('how are you')) {
        const finalText = "I am fine boss tell me how can i help you";
        speech.text = finalText;
    }

    else if(message.includes('name')) {
        const finalText = "My name is Inertia i am a large language model trained to tell everything about world";
        speech.text = finalText;
    }

    else if(message.includes('open google')) {
        window.open("https://google.com", "_blank");
        const finalText = "Opening Google";
        speech.text = finalText;
    }

    else if(message.includes('open instagram')) {
        window.open("https://instagram.com", "_blank");
        const finalText = "Opening instagram";
        speech.text = finalText;
    }

    else if(message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        const finalText = "This is what i found on wikipedia regarding " + message;
        speech.text = finalText;
    }

    else if(message.includes('time')) {
        const time = new Date().toLocaleString(undefined, {hour: "numeric", minute: "numeric"})
        const finalText = time;
        speech.text = finalText;
    }

    else if(message.includes('date')) {
        const date = new Date().toLocaleString(undefined, {month: "short", day: "numeric"})
        const finalText = date;
        speech.text = finalText;
    }

    else if(message.includes('calculator')) {
        window.open('Calculator:///')
        const finalText = "Opening Calculator";
        speech.text = finalText;
    }

    else {
        /*window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on google";
        speech.text = finalText; */
     try {
      const response = await getGoogleAIResponse(message);
      speech.text = response;
     } catch (error) {
        console.error('Error fetching Google AI response:', error);
      }
    }

   speech.volume = 1;
 speech.pitch = 0.8; // Adjust pitch for a more robotic voice
    speech.rate = 0.9; // Adjust rate for a slower, more deliberate speech

      const voices = window.speechSynthesis.getVoices();
    // Find a male voice by name
    const maleVoice = voices.find(voice => voice.name === 'Google UK English Male');
    if (maleVoice) {
        speech.voice = maleVoice;
    }

    console.log(speech);
    window.speechSynthesis.speak(speech);

}