async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // 1. Show user message
    chatbox.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    try {
        // 2. Talk to Render
        const response = await fetch('https://gpt-pnm-temp.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }) 
        });

        const data = await response.json();

        // 3. Show the Mentor's answer or the specific error
        if (data.text) {
            chatbox.innerHTML += `<div class="bot">${data.text}</div>`;
        } else if (data.error) {
            chatbox.innerHTML += `<div class="bot">Error: ${data.details || data.error}</div>`;
        }

    } catch (error) {
        chatbox.innerHTML += `<div class="bot">Cannot reach the server. Is Render 'Live'?</div>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}