<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
    import { fetchItems,sendContactDetails} from '$lib/api/api';
    import type { Item } from '$lib/types/types';
    import { paginate, LightPaginationNav } from 'svelte-paginate';
    import Modal from "$lib/Modal.svelte";

  let modalOpen = false;
  let name = '';
  let phone = '';
  let email = '';
  let agentname='';
  let agentemail= '';
  
    let currentPage = 1;
    let pageSize = 4;
  
    let searchTerm = '';
    let items: Item[] = [];
    let filteredItems: Item[] = [];
  
    async function getItems() {
      items = await fetchItems();
      filterItems();
    }
  
    function filterItems() {
      if (!searchTerm) {
        filteredItems = items;
      } else {
        const regex = new RegExp(searchTerm, 'i');
        filteredItems = items.filter((item) => regex.test(item.name) || regex.test(item.city) 
          || regex.test(item.price) || regex.test(item.type) || regex.test(item.suburb));
      }
    }
   
    onMount(getItems);
  
    function handleSearchTermChange() {
      filterItems();
    }
  
    afterUpdate(() => {
      handleSearchTermChange();
    });
  
    $: paginatedItems = paginate({ items: filteredItems, pageSize, currentPage });
    
  </script>
  

  <div class="headingcontainer">
      <h1>Welcome to Your Tenant DashBoard</h1>
  </div>
  
  
  <div class="searchcontainer">
      <h1>Search/Filter</h1>
    <input type="text" placeholder="Search..." bind:value={searchTerm} on:input={handleSearchTermChange} />
  </div>
  
  <div class="container">
      {#each paginatedItems as item}
      <div class="cardcontainer">
      <div class="imagecontainer">
        <img src={item.imageBase64} class="imgcontainerproperty" alt ="">
      </div>
      <p>{item.name} {item.city}</p>
      <p>{item.suburb}</p> <p>{item.type}</p>
      <p>R{item.price}</p><br/><br/>

        <p class="agentUser"></p>{item.appUser.name}
        <button class="btncontact" on:click={() => {modalOpen = true,
        agentname =item.appUser.name,
        agentemail=item.appUser.email}}>Contact</button> 
      </div>
      {:else}
          <li>No items found</li>
      {/each}
      
  </div>

  <Modal isOpen={modalOpen} agentName={agentname} to={agentemail} bind:name bind:phone bind:email />
  
  <div class="paginationcontainer">
      <LightPaginationNav
      totalItems="{filteredItems.length}"
      pageSize="{pageSize}"
      currentPage="{currentPage}"
      limit="{1}"
      showStepOptions="{true}"
      on:setPage="{(e) => currentPage = e.detail.page}"
    />  
  </div>  
  
  <style>
  .cardcontainer{
  position: relative;
  width: 250px;
  height: 488px;
  left: 53px;
  margin: 20px;
  margin-left: 5%;
  
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px 15px 0px 0px;
  float: left;
  }
  .container{
      margin-top: 15%;
  }
  .headingcontainer{
  background: white;
  width: 500px;
  height:10px;
  margin-left:32%;
  padding: 20px;
  padding-top: 40px;
  margin-top: 20px;
  border-radius: 4%;
  }
  p{
      margin-top: 15px;
      font-size: medium;
      margin:20px;
  }
  .btncontact{
  font-size: 15px;
  background: rgb(0,150,155);
  position: absolute;
  width: 85px;
  height: 42px;
  left: 60%;
  bottom: 2%;
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  color: white;
  transition: all 0.2s ease;
  }

  .agentUser{
  position: absolute;
  right: 45%;
  bottom: 90%;
  margin-left: 10px;
  
  }
 
  .imagecontainer{
  width: 250px;
  height: 230px;
  
  
  background: url(/photo-1600596542815-ffad4c1539a9.jpeg);
  border-radius: 15px 15px 0px 0px;
  background-repeat:no-repeat;
  }
  
  h1{
      color: black;
  
  }
 
      img{
          margin-left: 0%;
      }
  
      .searchcontainer{
          position: absolute;
          margin-left: 40%;
          top: 40%;
      }

      .imgcontainerproperty{
        margin-left: 0%;
        border-radius: 15px 15px 0px 0px;
        width: 250px;
height: 230px;
    }
     .paginationcontainer{
      position: absolute;
      margin-top:35%;
      margin-right: 6%;
      margin-left: 9%;
     }
  </style>