<script lang="ts">
  import { onMount } from 'svelte';
  import signalRService from '$lib/signalrservice/signalrService';
  import BackButton from "$lib/Backbutton.svelte";
  import jwtDecode from 'jwt-decode';
  import { getChatHistory,getAppUsersByIds} from '$lib/api/api';
  import type { ChatMessage } from '$lib/types/types';
 

  let chats : ChatMessage[] = [];
  let receivers = [];
  let appusers = [];
  let message = '';
  let messages = []; 
  let receivedMessage ='';
  let receivedMessages = [];
  
  let selectedReceiverId = null;


  
  const setSelectedReceiver = (receiverId) => {
    selectedReceiverId = receiverId;
    // Load chat history for the selected receiver
    requestChatHistory(receiverId);
  };

  function isMessageSentByCurrentUser(messageUserId: string): boolean {
    return messageUserId === userId;
  }


  async function requestChatHistory(userId) {
  try {
    // Call the server-side method to request chat history for the given chat ID
    const chatHistory = await getChatHistory(userId);

    // Collect unique sender and receiver IDs from the chat history
    const allUserIds = new Set([...chatHistory.map(chat => chat.sender), ...chatHistory.map(chat => chat.receiver)]);

    // Convert Set to an array of user IDs
    const userIdArray = Array.from(allUserIds);

    // Remove the current user's ID from the array
    const filteredUserIdArray = userIdArray.filter(id => id !== userId);

    // Call your getAppUsers function to get user information for the user IDs
    const userInfos = await getAppUsersByIds(filteredUserIdArray);

    // Create a map to store user information by user ID
    const userMap = new Map(userInfos.map(user => [user.id, user]));

    // Process the chat history to include sender and receiver information
    const processedChatHistory = chatHistory.map(chat => ({
      ...chat,
      senderInfo: userMap.get(chat.sender),
      receiverInfo: userMap.get(chat.receiver)
    }));

    // Update the chat history with processed data
    chats = processedChatHistory;

    // Create an array of user IDs from chat history (both sender and receiver)
    const chatUserIds = new Set([...chatHistory.map(chat => chat.sender), ...chatHistory.map(chat => chat.receiver)]);

    // Filter out the current user's ID from the chatUserIds
    chatUserIds.delete(userId);

    // Convert the Set of user IDs to an array
    const chatUserIdsArray = Array.from(chatUserIds);

    // Call your getAppUsers function to get user information for the user IDs
    const chatUsers = await getAppUsersByIds(chatUserIdsArray);

    // Create an array of receivers with user information
    receivers = chatUsers.map(user => ({
      userId: user.id,
      fullName: user.name
    }));
  } catch (err) {
    console.error('Error requesting chat history:', err);
  }
}


  const sendMessage = async () => {
    if (!selectedReceiverId) {
      console.error('No receiver selected.'); // Add proper error handling
      return;
    }

    const chatMessage = {
      User: userId, // User GUID or User ID as string
      UserName: userName, // Optional, if applicable
      Sender: userId, // Optional, if applicable
      Receiver: selectedReceiverId, // Optional, if applicable
      Message: message, // The actual message from the input field
      // Current timestamp and Communication ID, if applicable
    };

    await signalRService.sendMessage(chatMessage);
    messages = [...messages, { content: message, sender: true }];
    message = '';
  };
  


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


  // Subscribe to the onReceiveMessage event in the signalR service
  onMount(() => {
    const userId =getSenderUserId();
    requestChatHistory(userId);
    initializeSignalR();

    // Subscribe to the onReceiveMessage event in the signalR service
  signalRService.onReceiveMessage((message) => {
    // This callback will be called when a new message is received
    receivedMessage = message;
    receivedMessages = [...receivedMessages, message];
  });

});



</script>

<div class="gobackbutton">
  <BackButton />
</div>

<!-- ... Your existing code ... -->

<div class="chat-container">
  <div class="sidebar">
    <h3>Chats</h3>
    <div class="chat-list-container">
      <ul>
    {#each receivers as receiver}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li class:selected={selectedReceiverId === receiver.userId} on:click={() => setSelectedReceiver(receiver.userId)}>
    {receiver.fullName}
  </li>
{/each}

        
         
      </ul>
    </div>
  </div>

  <div class="chat-history">
    <ul>
      {#each chats as chat}
        <li class:sender={isMessageSentByCurrentUser(chat.user.id)}>
          {#if isMessageSentByCurrentUser(chat.user.id)}
            You: {chat.message}
          {:else}
            {chat.user.name}: {chat.message}
          {/if}
        </li>
      {/each}
      {#each receivedMessages as message}
        <li class:sender={!isMessageSentByCurrentUser(message.user.id)}>
          {#if isMessageSentByCurrentUser(message.user.id)}
            {message.user.name}: {message.message}
          {:else}
            {message.user.name}: {message.message}
          {/if}
        </li>
      {/each}
    </ul>

    
  <div class="message-input">
    <input type="text" bind:value={message} />
    <button on:click={sendMessage}>Send</button>
  </div>
</div>
  </div>

<style>
  .chat-container {
    display: flex;
    background-color: #f0f8ea; /* Light green background color */
    padding: 16px;
    border-radius: 8px;
    max-width: 800px;
    margin: 0 auto;
    margin-top: 10px;
  }

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
    max-height: 300px; /* Adjust this to set the maximum height of the chat list container */
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

  .gobackbutton {
    margin-top: 10%;
    margin-left: 10%;
  }

  .chat-history {
    flex: 2;
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
    overflow-y: auto;
    max-height: 500px;
  }

  .chat-history ul {
    list-style: none;
    padding: 0;
  }

  .chat-history li {
    margin-bottom: 8px;
    padding: 8px;
    border-radius: 4px;
  }

  .chat-history li.sender {
    background-color: #aaf0d1; /* Light blue for messages sent by the current user */
    align-self: flex-end;
  }

  .chat-history li:not(.sender) {
    background-color: #f5f5f5; /* Light gray for messages received from others */
  }

  .message-input {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }

  .message-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .message-input button {
    margin-left: 8px;
    padding: 8px 16px;
    background-color: #4caf50; /* Green button color */
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .message-input button:hover {
    background-color: #45a049; /* Slightly darker green on hover */
  }
</style>
