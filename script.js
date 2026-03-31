async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // 1. Show user message
    chatbox.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    try {
        // 2. Talk to Render (The Brain)
        const response = await fetch('https://gpt-pnm-temp.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }) 
        });

        const data = await response.json();

        // 3. Show the Mentor's answer (The "data.text" fix!)
        if (data && data.text) {
            chatbox.innerHTML += `<div class="bot">${data.text}</div>`;
        } else {
            // This happens if the server sends back an empty box
            chatbox.innerHTML += `<div class="bot">I'm thinking... try sending that again!</div>`;
        }

    } catch (error) {
        // This happens if the server is totally offline or sleeping
        chatbox.innerHTML += `<div class="bot">The mentor is napping. Wake me up in 30 seconds!</div>`;
    }

    // Keep the chat scrolled to the bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}