<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
    import { fetchItems} from '$lib/api/api';
    import type { Item } from '$lib/types/types';
    import { paginate, LightPaginationNav } from 'svelte-paginate';
    import Modal from "$lib/Modal.svelte";
    import {Toaster} from 'svelte-french-toast';
    import jwtDecode from 'jwt-decode';

  

  function getEmail(): string {
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

  let modalOpen = false;
  let name = getName();
  let phone = ''; 
  let email = getEmail();
  let agentname='';
  let agentemail= '';
  let propertyname ='';
  
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
          || regex.test(item.price) || regex.test(item.type) || regex.test(item.suburb) || regex.test(item.province));
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
  <Toaster/>

  <div class="headingcontainer">
      <h1>Welcome to Your Tenant DashBoard</h1>
  </div>
  
  
  
  <div class="searchcontainer">
    <h2>Search/Filter</h2>
	<input type="text" placeholder="Search... price,name,city" bind:value={searchTerm} on:input={handleSearchTermChange} />

  <select  bind:value={searchTerm} on:input={handleSearchTermChange}>
    <option value="">Filter by Type</option>
    <option >TownHouse</option>
    <option >Flat</option>
    <option >Commune</option>
  </select>

  <select  bind:value={searchTerm} on:input={handleSearchTermChange}>
    <option value="">Filter by City</option>
    <option >Pretoria</option>
    <option >Durban</option>
    <option >Cape Town</option>
  </select>

  <select bind:value={searchTerm} on:input={handleSearchTermChange}>
    <option value="">Filter by Province</option>
    <option >Gauteng</option>
    <option >Limpopo</option>
    <option >Free State</option>
    <option >Western Cape</option>
    <option >Northeren Cape</option>
    <option >North West</option>
    <option >Mpumalanga</option>
    <option >Kwa-Zulu-Natal</option>
    <option >Estern Cape</option> 
  </select>
</div>
  
  <div class="container">
      {#each paginatedItems as item}
      <div class="cardcontainer">
      <div class="imagecontainer">
        <img src={item.imageBase64} class="imgcontainerproperty" alt ="">
      </div>
      <p>{item.name}, {item.city}</p>
      <p>{item.suburb}</p> <p>{item.type}</p>
      <p>R{item.price}</p><br/>

      <div class="agentcontainer">
        <p class="agentUser">Agent {item.appUser.name}</p>
        <button class="btncontact" on:click={() => {modalOpen = true,
        agentname =item.appUser.name,
        agentemail=item.appUser.email,propertyname=item.name}}>Contact</button> 
      </div>     
      </div>
      {:else}
          <li>No items found</li>
      {/each}
      
  </div>

  <Modal isOpen={modalOpen} agentName={agentname} to={agentemail} propertyName={propertyname} bind:name bind:phone bind:email />
  
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

.cardcontainer {
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
  transition: box-shadow 0.3s ease; /* Add transition only for the box-shadow property */
}

.cardcontainer:hover {
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.5); /* Change the box shadow on hover */
  cursor: pointer; /* Change the cursor on hover */
}

.container {
  margin-top: 2%;
}

  .headingcontainer{
  background: white;
  width: 500px;
  height:10px;
  margin-left:32%;
  padding: 20px;
  padding-top: 40px;
  margin-top: 5%;
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

  .btncontact:hover{
    cursor: pointer;
  background: rgb(0, 120, 125);
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
  


      .imgcontainerproperty{
        margin-left: 0%;
        border-radius: 15px 15px 0px 0px;
        width: 250px;
height: 230px;
    }

     input {
  margin-left: 0%;
  width: 250px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.searchcontainer select {
    width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    margin-top: 10px;
  }

  /* Styling the dropdown arrow */
  .searchcontainer select::after {
    content: '\25BC'; /* Unicode character for down arrow */
    position: absolute;
    top: 12px;
    right: 10px;
    pointer-events: none; /* Prevents the arrow from being clickable */
  }

  /* Styling the dropdown on hover */
  .searchcontainer select:hover {
    border-color: #007bff;
  }

  /* Styling the dropdown when focused */
  .searchcontainer select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .searchcontainer > h2 {
  margin-left: 30%;
}
.paginationcontainer {
  position: relative;
  margin-top: 36%;
  margin-right: 6%;
  margin-left: 35%;
  margin-bottom: 1%;
  text-align: center;
  width: 50%;
  bottom: 0;
}
.searchcontainer{
        margin-left: 20%;
        margin-top: 6%;
    }
  

   .agentcontainer > p{
    position: absolute;
    margin-bottom: 10px;
   }
  
  </style>