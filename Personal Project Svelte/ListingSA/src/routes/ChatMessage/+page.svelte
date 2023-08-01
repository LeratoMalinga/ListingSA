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
    message = '';
  };

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
    });
  });
</script>


<main>
  <div class="chatMessage">
    <input type="text" bind:value={message} />
    <button on:click={sendMessage}>Send Message</button>
  </div>
  <div>
    <p>Received Message: {receivedMessage}</p>
  </div>
</main>

<style>
.chatMessage{
  margin-top: 10%;
}
</style>