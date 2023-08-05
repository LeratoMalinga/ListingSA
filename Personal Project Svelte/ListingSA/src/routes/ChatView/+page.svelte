<script lang="ts">
  import { onMount } from 'svelte';
  import signalRService from '$lib/signalrservice/signalrService';
  import BackButton from "$lib/Backbutton.svelte";
  import jwtDecode from 'jwt-decode';
  import { getChatHistory} from '$lib/api/api';
  import type { ChatMessage } from '$lib/types/types';
 

  let chats : ChatMessage[] = [];
  let receivers: string[] = [];
  
  async function requestChatHistory(userId) {
    try {
      // Call the server-side method to request chat history for the given chat ID
      const chatHistory = await getChatHistory(userId);
      chats = chatHistory;
      receivers = Array.from(new Set(chats.map(chat => chat.user.name)));
      console.log(chats);
    } catch (err) {
      console.error('Error requesting chat history:', err);
    }
  }


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
        {#each receivers as receiver}
          <li>{receiver}</li>
      {/each}
      </ul>
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

 .gobackbutton{
       margin-top: 10%;
       margin-left: 10%;
   }
</style>

