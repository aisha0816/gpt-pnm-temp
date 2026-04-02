async function sendMessage() {
    console.log("🚀 Sending message...");

    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");

    const text = input.value.trim();
    if (!text) return;

    // Show user message
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.innerText = text;
    chatbox.appendChild(userDiv);

    input.value = "";

    try {
        const response = await fetch("https://gpt-pnm-temp.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        console.log("✅ Response:", data);

        const botDiv = document.createElement("div");
        botDiv.className = "bot";
        botDiv.innerText = data.text || "No response";
        chatbox.appendChild(botDiv);

    } catch (err) {
        console.error("❌ Fetch error:", err);

        const botDiv = document.createElement("div");
        botDiv.className = "bot";
        botDiv.innerText = "Server error. Try again.";
        chatbox.appendChild(botDiv);
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}