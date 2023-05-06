<script lang="ts">
    import { isLoggedIn, logout } from '$lib/auth/auth';
    import { onMount } from 'svelte';
  
    let loaded: boolean = false;
    let loggedIn: boolean = false;
  
    async function checkLoggedIn() {
      const isLoggedInResult = await isLoggedIn();
      loggedIn = isLoggedInResult;
      loaded = true;
    };
  
    console.log(checkLoggedIn)
    onMount(checkLoggedIn);
  
    function logoutUser() {
      logout();
      loggedIn = false;
      window.location.href = '/';
    }
  </script>

  
<header>
    <nav>
      <div class="logoImage">
        <img src="/Logohome2.png" alt="logo" width="90px" height="90px">
      </div>
      <div class="links">
        {#if !loggedIn}
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/login">Login</a>
        {:else}
        <button on:click={logoutUser}>Logout</button>
        {/if}
      </div>
    </nav>
  </header>
<slot />

<style>
  header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 90px;
  text-align: center;
  background:rgb(96.1%, 96.1%, 96.1%);
  padding-left: 0%;
}
    .links{
        margin-left:auto;
        margin-top: 0px;
        margin-right: 0%;
        
    }
    a {
        margin-left: 40px;
        margin-bottom: 20px;
        color: black;
    
        
    }

    .logoImage{
        margin-left: 2%;
    }

  nav {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  max-width: 90%;
  margin: 0 auto;
  margin-left: 0;
}
    img{
        margin-left: 0%;
    }
    button {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 40px;
    margin-bottom: 20px;
    color: black;;
    text-decoration: underline;
    font-size: 16px;
  }
  button:hover {
    color: rgb(30, 38, 161);
  }
</style>