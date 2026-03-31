async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // 1. Show user message (using your original 'user' class)
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

        // 3. Show the Mentor's answer (using your original 'bot' class)
        if (data && data.text) {
            chatbox.innerHTML += `<div class="bot">${data.text}</div>`;
        } else {
            chatbox.innerHTML += `<div class="bot">I'm thinking... try sending that again!</div>`;
        }

    } catch (error) {
        chatbox.innerHTML += `<div class="bot">The mentor is napping. Wake me up in 30 seconds!</div>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}