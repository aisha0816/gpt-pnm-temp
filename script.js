async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    // 1. Show user message
    document.getElementById("chatbox").innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    // 2. Fetch from YOUR server (use your Render URL once live!)
    const response = await fetch('https://gpt-pnm-temp.onrender.com/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    document.getElementById("chatbox").innerHTML += `<div class="bot">${data.text}</div>`;
}