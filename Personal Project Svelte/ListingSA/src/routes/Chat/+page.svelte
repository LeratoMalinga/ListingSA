<script>
import {onMount} from 'svelte';
import Pusher from 'pusher-js';

let username ='username';
let message ='';

let messages = [];

onMount(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher('d4640bf31ce86bdd4b12', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
          messages =[... messages,data];
    });
})

const submit = async () =>{
    await fetch('https://localhost:7011/api/Chat/Message',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            username,
            message
        })
    });

    message= '';
}
</script>

<input type="text" placeholder="UserName" bind:value={username}>

<div class="chatcontainer">
  {#each messages as msg}
<div class="container">
      <img src="/w3images/bandmember.jpg" alt="Avatar" style="width:100%;">
      <p>{msg.username}</p>
      <p>{msg.message}</p>
      <span class="time-right">11:00</span>
    </div>
  {/each}
</div>


<form on:submit|preventDefault={submit}>
   <input class="form-control" placeholder="write a message" bind:value={message}/>
</form>
<style>
    /* body {
      margin: 0 auto;
      max-width: 800px;
      padding: 0 20px;
    } */
    
    .container {
      border: 2px solid #dedede;
      background-color: #f1f1f1;
      border-radius: 5px;
      padding: 10px;
      margin: 10px 0;
      margin-left: 40%;
    }
    
    /* .darker {
      border-color: #ccc;
      background-color: #ddd;
    } */
    
    .container::after {
      content: "";
      clear: both;
      display: table;
    }
    
    .container img {
      float: left;
      max-width: 60px;
      width: 100%;
      margin-right: 20px;
      border-radius: 50%;
    }
    
    /* .container img.right {
      float: right;
      margin-left: 20px;
      margin-right:0;
    } */
    
    .time-right {
      float: right;
      color: #aaa;
    }
    .chatcontainer{
      height: 400px;
    }
    /* .time-left {
      float: left;
      color: #999;
    } */
    </style>