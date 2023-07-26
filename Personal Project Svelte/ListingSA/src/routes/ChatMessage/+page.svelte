<!-- ChatComponent.svelte -->

<script>
  import { onMount } from 'svelte';
  import signalRService from '$lib/signalrservice/signalrService';

  let message = '';
  let receivedMessage = '';

  const sendMessage = () => {
    signalRService.sendMessage({ message });
    message = '';
  };

  onMount(async () => {
    // Initialize the SignalR connection
    await signalRService.initialize();

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