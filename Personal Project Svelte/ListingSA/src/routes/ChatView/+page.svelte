<script lang="ts">
  import { onMount } from 'svelte';
  import signalRService from '$lib/signalrservice/signalrService';
  import BackButton from "$lib/Backbutton.svelte";
  import jwtDecode from 'jwt-decode';
  import { getOpenChats,getAppUsersByIds,getChatHistoryBetweenUsers} from '$lib/api/api';
  import type { ChatMessage,ProcessedChatMessage,OpenChat,UniqueUserInfo} from '$lib/types/types';
 

  let chats : ChatMessage[] = [];
  let message = '';

  let receivedMessages:ChatMessage[] = [];
  let OpenChats:OpenChat[] = [];;
  let selectedReceiverId = null;
  let UserId = '';
  let email = '';
  let name = '';
  // Create an array to store unique user names and IDs
  let OpenChatUsers : UniqueUserInfo[]= [];

console.log(chats);
  
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

   const uniqueUsers=[];
  for (const openchat of openChatsWithUserInfo) {
  const userId = openchat.otherUserInfo.id;
  const userName = openchat.otherUserInfo.name;
  
  // Check if the user ID is not already in the array
  const userExists = uniqueUsers.some(user => user.id === userId);
  
  if (!userExists) {
    uniqueUsers.push({ id: userId, name: userName });
  }

}
 
  OpenChats=openChatsWithUserInfo;
  OpenChatUsers =uniqueUsers;
  console.log(OpenChatUsers);
  } catch (err) {
    console.error('Error requesting chat history:', err);
  }
}

async function sendMessage() {
  if (!selectedReceiverId) {
    console.error('No receiver selected.'); // Add proper error handling
    return;
  }

  const chatMessage = {
    id: userId,
    userName: userName,
    sender: userId,
    receiver: selectedReceiverId,
    message: message,
    timestamp: new Date().toISOString()
    // Add other properties as needed to match the ChatMessage type
  };

  try {
    // Send the message to the server via SignalR
    await signalRService.sendMessage(chatMessage);

    // Create a new ChatMessage object
    const newChatMessage: ChatMessage = {
        id: userId,
        userName: userName,
        sender: userId,
        receiver: selectedReceiverId,
        message: message,
        timestamp: new Date().toISOString(),
        communicationId: '',
        user: {
            name: name,
            version: 0,
            createdOn: '',
            claims: [],
            roles: [],
            logins: [],
            tokens: [],
            id:UserId,
            userName: email,
            normalizedUserName: '',
            email: email,
            normalizedEmail: '',
            emailConfirmed: false,
            passwordHash: '',
            securityStamp: '',
            concurrencyStamp: '',
            phoneNumber: '',
            phoneNumberConfirmed: false,
            twoFactorEnabled: false,
            lockoutEnd: '',
            lockoutEnabled: false,
            accessFailedCount: 0
        }
    };

    chats = [...chats, newChatMessage];
    console.log(chats);
    message = ''; // Clear the input field
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

  // Function to load chat history for a selected receiver
  const setSelectedReceiver = async (receiverId) => {
    selectedReceiverId = receiverId;

    // If the user is logged in, load their chat history with the selected receiver
    if (userId) {
      loadChatHistory();
    }
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

  async function loadChatHistory() {
    try {
      const chatHistory = await getChatHistoryBetweenUsers(userId, selectedReceiverId);
      chats = chatHistory;
      console.log(chats);
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  }


  // Subscribe to the onReceiveMessage event in the signalR service
  onMount(() => {
    const userId =getSenderUserId();
    UserId = getSenderUserId();
    email = getSenderUserEmail();
    name=getName();
    requestChatHistory(userId);
    initializeSignalR();

    // Subscribe to the onReceiveMessage event in the signalR service
    signalRService.onReceiveMessage((message) => {
  // This callback will be called when a new message is received

  if (isMessageSentByCurrentUser(message.sender)) {
    // If the message was sent by the current user, update the chats variable
    chats = [...chats, message];

  } else {
    // If the message was received from the other user, update receivedMessages
    receivedMessages = [...receivedMessages, message];
  }

  });
  
  if (selectedReceiverId) {
      loadChatHistory();
    }
});


</script>

<div class="gobackbutton">
  <BackButton />
</div>

<div class="chat-container">
  <div class="sidebar">
    <h3>Chats</h3>
    <div class="chat-list-container">
      <ul>
        {#each OpenChatUsers as openchat}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          {#if selectedReceiverId !== openchat.id}
            <li class:selected={selectedReceiverId === openchat.id} on:click={() => setSelectedReceiver(openchat.id)}>
              {openchat.name}
            </li>
          {/if}
        {/each}
      </ul>
    </div>    
  </div>
  
  <div class="chat-history">
    <ul>
      {#each chats as chat}
        <li class:sender={isMessageSentByCurrentUser(chat.sender)}>
          {#if isMessageSentByCurrentUser(chat.sender)}
            {chat.message}
          {:else}
            {chat.message} 
          {/if}  
        </li>
      {/each}
      {#each receivedMessages as message}
        <li class:sender={isMessageSentByCurrentUser(message.sender)}>
          {#if isMessageSentByCurrentUser(message.sender)}
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
    background-color: #e8f7f4; /* Light green background color */
    padding: 16px;
    border-radius: 8px;
    max-width: 600px;
    max-height: 400px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .sidebar {
    flex: 1;
    background-color: #07a890; /* Lighter green for the sidebar */
    border-radius: 8px;
    padding: 16px;
    max-width: 200px;
    color: #fff;
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
    background-color: #caf9f3; /* Slightly darker green on hover */
    border-radius: 4px;
    color: black;
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
    background-color: #07a890;
    color:  #fff; /* Light blue for messages sent by the current user */
    align-self: flex-end;
    font-size: 16px; /* Increase font size for messages sent by the current user */
    padding: 10px; /* Add some padding to the message for better readability */
  }

  .chat-history li:not(.sender) {
    background-color:  #f0f0f0; /* Light gray for messages received from others */
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
    margin-left: 10px;
    padding: 8px 16px;
    background-color: #07a890;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .message-input button:hover {
    background-color: #10c3a8; /* Slightly darker green on hover */
  }
</style>
