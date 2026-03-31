async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // 1. Show your message in the chat
    chatbox.innerHTML += `<div class="user-msg">${text}</div>`;
    input.value = "";

    // Scroll to bottom
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
        // 2. Talk to your Render Server
        // Make sure this URL matches your Render dashboard!
        const response = await fetch('https://gpt-pnm-temp.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }) 
        });

        const data = await response.json();

        // 3. Show the Mentor's answer (Fixes the "undefined" error)
        if (data.text) {
            chatbox.innerHTML += `<div class="bot-msg">${data.text}</div>`;
        } else {
            chatbox.innerHTML += `<div class="bot-msg">I heard you, but the response was empty.</div>`;
        }

    } catch (error) {
        console.error("Error:", error);
        chatbox.innerHTML += `<div class="bot-msg">The mentor is napping. Try again in 30 seconds!</div>`;
    }

    // Scroll to bottom again
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Allow pressing "Enter" to send
document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});