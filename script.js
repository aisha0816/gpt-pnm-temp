async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // 1. Show user message
    chatbox.innerHTML += <div class="user">${text}</div>;
    input.value = "";

    try {
        // 2. Talk to backend (Render)
        const response = await fetch('https://gpt-pnm-temp.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }) 
        });

        const data = await response.json();

        // 3. Show bot response
        if (data && data.text) {
            chatbox.innerHTML += <div class="bot">${data.text}</div>;
        } else {
            chatbox.innerHTML += <div class="bot">Hmm... I didn’t get that. Try again?</div>;
        }

    } catch (error) {
        console.error("Frontend error:", error);

        // Server down / sleeping
        chatbox.innerHTML += <div class="bot">Server error. Please try again in a few seconds.</div>;
    }

    // Auto scroll
    chatbox.scrollTop = chatbox.scrollHeight;
}