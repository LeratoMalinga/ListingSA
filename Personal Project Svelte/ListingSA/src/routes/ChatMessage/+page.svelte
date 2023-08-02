<!-- ChatComponent.svelte -->
<!-- Your Svelte component template -->
<script lang="ts">
  import { onMount } from 'svelte';
  import signalRService from '$lib/signalrservice/signalrService';
  import jwtDecode from 'jwt-decode';


  let message = '';
  let receivedMessage = '';
  let UserId = '';
  let email = '';
  let recieverUserId = '';

  let messages = []; 
  // Function to get user email from JWT token
  function getSenderUserEmail(): string {
    let userName = '';
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      }
    }
    return userName;
  }

  // Function to get user ID from JWT token
  function getSenderUserId(): string {
    let id = '';
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        id = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      }
    }
    return id;
  }

  function getName(): string {
  let userName = '';
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    }
  }
  return userName;
}
  const userId =getSenderUserId();
  const fullName =  getName();
  const userName =getSenderUserEmail();
  
  async function initializeSignalR() {
    await signalRService.initialize(userId, fullName, userName);
  }
  // Function to send a message
  const sendMessage = async () => {
    const chatMessage = {
      User: UserId, // User GUID or User ID as string
      UserName: email, // Optional, if applicable
      Sender: UserId, // Optional, if applicable
      Receiver: recieverUserId, // Optional, if applicable
      Message: message, // The actual message from the input field // Current timestamp// Communication ID, if applicable
    };

    await signalRService.sendMessage(chatMessage);
    messages = [...messages, { content: message, sender: true }];
    message = '';
  };
  function scrollToBottom() {
    const chatWindow = document.querySelector('.chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // onMount function to run code after the component is mounted in the browser environment
  onMount(async () => {
    UserId = getSenderUserId();
    email = getSenderUserEmail();
    recieverUserId = localStorage.getItem('recieverUserId');

    // Initialize the SignalR connection
    initializeSignalR();

    // Listen for incoming messages
    signalRService.onReceiveMessage((message) => {
      // Handle the received message here
      receivedMessage = message;
      messages = [...messages, { content: message, sender: false }]; // Add the received message to the messages array
      scrollToBottom();
    });

    scrollToBottom();
  });

  $: if (receivedMessage) {
    // Add the received message to the messages array
    messages = [...messages, { content: receivedMessage, sender: false }];
    scrollToBottom();
  }
</script>


<main>
  <!-- Chat Messages -->
  <div class="chat-window">
    {#each messages as message}
      <div class="message {message.sender ? 'sent' : 'received'}">
        <p>{message.content}</p>
      </div>
    {/each}
  </div>

  <!-- Message Input -->
  <div class="message-input">
    <input type="text" bind:value={message} />
    <button on:click={sendMessage}>Send Message</button>
  </div>
</main>

<style>
  /* Your CSS styles here */
  main {
    display: flex;
    flex-direction: column;
    height: 80vh; /* Adjust the height as needed */
    width: 300px; /* Adjust the width as needed */
    margin: 0 auto; /* Center the chat window horizontally */
    padding: 1rem;
  }

  .chat-window {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    margin-top: 100px; /* Adjust the top margin as needed */
    background-color: antiquewhite;
    height: 70vh; /* Adjust the height as needed */
  }

  .message {
    max-width: 80%;
    padding: 0.3rem;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    word-break: break-word;
    font-size: 0.8rem; /* Adjust the font size as needed */
  }

  .sent {
    background-color: #007bff;
    color: #fff;
    align-self: flex-end;
  }

  .received {
    background-color: #f0f0f0;
    align-self: flex-start;
  }

  .message-input {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
  }

  input[type="text"] {
    flex: 1;
    padding: 0.3rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.8rem; /* Adjust the font size as needed */
  }

  button {
    margin-left: 0.5rem;
    padding: 0.3rem 0.7rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem; /* Adjust the font size as needed */
  }
</style>
