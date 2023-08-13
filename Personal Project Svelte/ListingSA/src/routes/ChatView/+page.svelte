<script lang="ts">
  import { onMount } from 'svelte';
  import signalRService from '$lib/signalrservice/signalrService';
  import BackButton from "$lib/Backbutton.svelte";
  import jwtDecode from 'jwt-decode';
  import { getOpenChats,getAppUsersByIds,getChatHistoryBetweenUsers} from '$lib/api/api';
  import type { ChatMessage,ProcessedChatMessage,OpenChat} from '$lib/types/types';
 

  let chats : ChatMessage[] = [];
  let Chathistory : ProcessedChatMessage[] = [];
  let message = '';
  let messages = []; 
  let receivedMessage ='';
  let receivedMessages = [];
  let OpenChats:OpenChat[] = [];;
  
  let selectedReceiverId = null;


  const setSelectedReceiver = async (receiverId) => {
    selectedReceiverId = receiverId;
    // Load chat history for the selected receiver
    const chatHistory = await getChatHistoryBetweenUsers(userId, receiverId);
    chats = chatHistory;
  };

  function isMessageSentByCurrentUser(messageUserId: string): boolean {
    return messageUserId === userId;
  }

  
  async function requestChatHistory(userId) {
  try {
    // Call the server-side method to request open chats for the given user ID
    const openChats = await getOpenChats(userId);

    // Create an array of unique user IDs from open chats (excluding the current user)
    const otherUserIds = [...new Set(openChats.map(chat => (chat.sender === userId) ? chat.receiver : chat.sender))];

    // Call your getAppUsers function to get user information for the user IDs
    const userInfos = await getAppUsersByIds(otherUserIds);

    // Create a map to store user information by user ID
    const userMap = new Map(userInfos.map(user => [user.id, user]));

    // Iterate over the open chats to add user information
    const openChatsWithUserInfo = openChats.map(chat => ({
      ...chat,
      otherUserInfo: userMap.get((chat.sender === userId) ? chat.receiver : chat.sender)
    }));

    // Fetch and process chat history for each open chat
    for (const openChat of openChatsWithUserInfo) {
      const chatHistory = await getChatHistoryBetweenUsers(userId, openChat.otherUserInfo.id);

      // Process and store chat history
      const processedChatHistory: ProcessedChatMessage[] = chatHistory.map(message => ({
        senderInfo: userMap.get(message.sender),
        receiverInfo: userMap.get(message.receiver),
        sender: message.sender,
        receiver: message.receiver,
        message: message.message,
        timestamp: message.timestamp,
      }));
      Chathistory = processedChatHistory;
      // openChat.Chathistory= processedChatHistory;
    }
     OpenChats=openChatsWithUserInfo;
    // Now you have open chats with user information and processed chat history
    console.log(openChatsWithUserInfo);
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
        {#each OpenChats as openchat}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          {#if selectedReceiverId !== openchat.otherUserInfo.id}
            <li class:selected={selectedReceiverId === openchat.otherUserInfo.id} on:click={() => setSelectedReceiver(openchat.otherUserInfo.id)}>
              {openchat.otherUserInfo.name}
            </li>
          {/if}
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
            {message.message}
          {:else}
            {message.message}
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
    font-size: 16px; /* Increase font size for messages sent by the current user */
    padding: 10px; /* Add some padding to the message for better readability */
  }

  .chat-history li:not(.sender) {
    background-color: #f5f5f5; /* Light gray for messages received from others */
    font-size: 16px; /* Increase font size for messages received from others */
    padding: 10px; /* Add some padding to the message for better readability */
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
