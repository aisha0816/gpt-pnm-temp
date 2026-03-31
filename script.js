async function getBotResponse(userInput) {
    // 1. Retrieve API Key from Session Storage
    let apiKey = sessionStorage.getItem("gemini_key");
    
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key to authenticate this session:");
        if (apiKey) {
            sessionStorage.setItem("gemini_key", apiKey);
        } else {
            return "Authentication required. Please refresh the page.";
        }
    }

    // 2. Gemini 2.5 Flash Stable Endpoint (March 2026)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are Aisha's sophisticated AI learning mentor. Your tone is professional, articulate, and intellectually stimulating. Avoid slang. Provide clear, logical explanations and break complex academic tasks into structured, manageable objectives. User says: " + userInput
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return "Technical Error: " + data.error.message;
        }

        // Extracting text from the 2026 API structure
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "The AI service is currently unresponsive. Please try again.";
        }

    } catch (error) {
        return "Connection Error: Please check your network or API quota.";
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // Display User Message
    chatbox.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    // Display Loading State
    const loadingId = "loading-" + Date.now();
    chatbox.innerHTML += `<div class="bot" id="${loadingId}">...</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Fetch and Clean Response
    const response = await getBotResponse(text);
    
    // Removes ## and ** markers for a clean professional look
    const cleanResponse = response.replace(/[#*]/g, "").trim(); 

    document.getElementById(loadingId).innerText = cleanResponse;
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Extra feature: Clear the chat history
function clearChat() {
    document.getElementById("chatbox").innerHTML = '<div class="bot">Chat cleared. Ready for a new topic.</div>';
}