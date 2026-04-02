async function sendMessage() {
    console.log("Send clicked"); // DEBUG

    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");

    if (!input || !chatbox) {
        console.error("Missing elements");
        return;
    }

    const text = input.value.trim();
    if (!text) return;

    // Show user message safely
    const userMsg = document.createElement("div");
    userMsg.className = "user";
    userMsg.innerText = text;
    chatbox.appendChild(userMsg);

    input.value = "";

    try {
        const response = await fetch('https://gpt-pnm-temp.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        const botMsg = document.createElement("div");
        botMsg.className = "bot";

        if (data && data.text) {
            botMsg.innerText = data.text;
        } else {
            botMsg.innerText = "No response. Try again.";
        }

        chatbox.appendChild(botMsg);

    } catch (error) {
        console.error("Fetch error:", error);

        const botMsg = document.createElement("div");
        botMsg.className = "bot";
        botMsg.innerText = "Server error. Try again in a few seconds.";
        chatbox.appendChild(botMsg);
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}