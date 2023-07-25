<script>
  import { onMount } from 'svelte';
  import { startConnection, receiveMessage, sendMessage } from '$lib/signalrservice/signalrService'; // Replace with the correct path to your signalrService.js file

  let sender = 'lmalinga@gmail.com'; // Replace with the actual user's name or identifier
  let receiver = 'lmalinga@retrorabbit.co.za'; // Replace with the receiver's name or identifier
  let message = '';
  let chatMessages = [];

  // Start the SignalR connection when the component is mounted
  onMount(async () => {
    await startConnection();

    // Receive incoming chat messages
    receiveMessage((sender, message) => {
      // Add the received message to the chatMessages array
      chatMessages = [...chatMessages, { sender, message }];
    });
  });

  async function sendChatMessage() {
    if (message.trim() !== '') {
      const chatMessage = {
        Id: 1, // Replace with an appropriate ID or set dynamically
        CommunicationId: 1, // Replace with an appropriate ID or set dynamically
        Message: message,
        Receiver: receiver,
        Sender: sender,
        UserName: sender, // Set the username to the sender for simplicity
        Timestamp: new Date().toISOString() // Use the current timestamp
      };

      sendMessage(chatMessage);

      message = ''; // Clear the input after sending the message
    }
  }
</script>

<main>
  <h1>Chat</h1>

  <div class="chat-container">  
    
  <ul>
    {#each chatMessages as { sender, message }}
      <li>{sender}: {message}</li>
    {/each}
  </ul>

  <div>
    <input type="text" bind:value={message} placeholder="Type your message..." />
    <button on:click={sendChatMessage}>Send</button>
  </div>
  </div>
</main>

<style>
  
  .chat-container{
    margin-top: 20%;
  }
  /* Your CSS styles */
</style>
