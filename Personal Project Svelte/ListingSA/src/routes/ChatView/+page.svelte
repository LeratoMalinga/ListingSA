<!-- Chat.svelte -->
<script>
  // Define the state for the messages and the message input field
  import BackButton from "$lib/Backbutton.svelte";
  let messages = [
    { text: 'Hi there!', sender: 'John', timestamp: '10:00 AM' },
    { text: 'Hello! How are you?', sender: 'Jane', timestamp: '10:05 AM' },
  ];
  let messageInput = '';

  // Function to send a new message
  function sendMessage() {
    if (messageInput.trim() !== '') {
      const newMessage = {
        text: messageInput,
        sender: 'me', // Assuming the current user is the sender for simplicity
        timestamp: getCurrentTime(), // You can use a function to get the current time
      };
      messages = [...messages, newMessage];
      messageInput = '';
    }
  }

  // Function to get the current time in the format "HH:mm AM/PM"
  function getCurrentTime() {
    const date = new Date();
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
  }

  function openChat(chat) {
    // For simplicity, let's assume each chat has a unique ID
    // In a real-world scenario, you may have an ID associated with each chat in your data
    // You can load the messages for the selected chat here or handle the chat opening logic
    console.log('Opening chat:', chat);
  }

  // Dummy data for the sidebar chats
  const chats = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    // Add more chat objects as needed
  ];
</script>

<div class="gobackbutton">
  <BackButton/>
</div>

<div class="chat-container">
  <div class="sidebar">
    <h3>Chats</h3>
    <div class="chat-list-container">
      <ul>
        {#each chats as chat}
          <li on:click={() => openChat(chat)}>
            {chat.name}
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="chat-area">
    <div class="message-list">
      {#each messages as message}
        <div class="message {message.sender}">
          <div class="message-content">
            <span class="sender">{message.sender}</span>
            <span class="message-text">{message.text}</span>
            <span class="timestamp">{message.timestamp}</span>
          </div>
        </div>
      {/each}
    </div>

    <div class="input-box">
      <input type="text" bind:value={messageInput} placeholder="Type your message..." />
      <button on:click={sendMessage}>Send</button>
    </div>
  </div>
</div>

<style>
  /* Add CSS styles to style the chat interface */
  .chat-container {
    display: flex;
    background-color: #f0f8ea; /* Light green background color */
    padding: 16px;
    border-radius: 8px;
    max-width: 800px;
    margin: 0 auto;
    margin-top: 10px;
  }

  /* Rest of the CSS remains the same */
  /* Rest of the CSS remains the same */
  .sidebar {
    flex: 1;
    background-color: #eaf8f0; /* Lighter green for the sidebar */
    border-radius: 8px;
    padding: 16px;
    max-width: 200px;
  }

  .sidebar h3 {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: bold;
  }

  .chat-list-container {
    max-height: 200px; /* Adjust this to set the maximum height of the chat list container */
    overflow-y: auto;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    padding: 8px;
    cursor: pointer;
  }

  .sidebar li:hover {
    background-color: #d2f1d4; /* Slightly darker green on hover */
    border-radius: 4px;
  }

  .chat-area {
    flex: 2;
    margin-left: 16px;
  }

  
  .message-list {
    display: flex;
    flex-direction: column;
  }

  .message {
    margin: 8px 0;
    display: inline-block;
    max-width: 80%;
    border-radius: 8px;
    padding: 8px 12px;
    color: #333;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }

  .message.me {
    align-self: flex-end;
    background-color: #dcf8c6; /* Light green bubble color for your messages */
  }

  .message.other {
    background-color: #fff; /* White bubble color for other messages */
  }

  .message-content {
    display: flex;
    flex-direction: column;
  }

  .sender {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .message-text {
    word-wrap: break-word;
  }

  .timestamp {
    align-self: flex-end;
    color: #666;
    font-size: 12px;
  }

  .input-box {
    display: flex;
    margin-top: 16px;
  }

  .input-box input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .input-box button {
    padding: 8px 12px;
    border: none;
    background-color: #07a890; /* Darker green color for the send button */
    color: #fff;
    border-radius: 4px;
    margin-left: 8px;
    cursor: pointer;
  }


  .gobackbutton {
    margin-top: 10%;
    margin-left: 10%;
  }
</style>
