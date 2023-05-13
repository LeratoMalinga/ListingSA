<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { fetchItems,deleteItem} from '$lib/api/api';
    import type { Item } from '$lib/types/types';
    import { paginate, LightPaginationNav } from 'svelte-paginate';
    import jwtDecode from 'jwt-decode';
   

    let currentPage = 1;
    let pageSize = 4;
   
    
    let searchTerm = '';
    let items: Item[] = [];
    let fectcheditems: Item[] = [];
    let filteredItems: Item[] = [];
    

    async function getItems() {
      const token = localStorage.getItem('token');
    
      if (!token) {
        // handle missing token
        return;
      }
    
      const decodedToken = jwtDecode(token);
      const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    
      fectcheditems = await fetchItems();
      items = fectcheditems.filter((item) => item.appUser.id === userId);
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

function handleDelete(id:string) {
  const confirmDelete = confirm('Are you sure you want to delete this item?');
  
  if (confirmDelete) {
    deleteItem(id)
      .then(() => {
        getItems();
      })
      .catch((error) => {
        // handle error deleting item
        console.error('Error deleting item:', error);
      });
  }
}

function handleUpdate(propertyId: string) {
    // Redirect to update page with item ID as query parameter
    localStorage.setItem('propertyId',propertyId);
    window.location.href = '/UpdateProperty';
    
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
    <h1>Welcome to Your Agent DashBoard</h1>
</div>

<a class="addproperty" href="/AddProperty"><button class="btnaddproperty">Add Property</button></a>

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
    <option>Pretoria</option>
    <option>Durban</option>
    <option>Cape Town</option>
    <option>Bloemfontein</option>
    <option>Johannesburg</option>
    <option>Port Elizabeth</option>
    <option>East London</option>
    <option>Kimberley</option>
    <option>Polokwane</option>
    <option>Nelspruit</option>
    <option>George</option>    
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
    <p>R{item.price}</p>
    <div class="btncontainer">
        <button class="btndeleteproperty" on:click={() => handleDelete(item.id)}>Delete</button>  
        <button class="btnupdateproperty" on:click={() => handleUpdate(item.id)}>Update</button> 
    </div>
   
    </div>
    {:else}
        <li>No items found</li>
    {/each}
    
</div>

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
.btndeleteproperty {
  font-size: 15px;
  cursor: pointer;
  background: rgb(155, 0, 0);
  position: absolute;
  width: 80px;
  height: 42px;
  left: 59%;
  bottom: 2%;
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  color: white;
  transition: all 0.2s ease;
}

.btndeleteproperty:hover {
  background: rgb(120, 0, 0); /* Change the background color on hover */
}

.btnaddproperty{
font-size: 15px;
background: rgb(0,150,155);
width: 120x;
height: 42px;
margin-left: 42%;
margin-top:6%;
margin-bottom: 40px;
padding: 10px ;
border: none;
border-radius: 4px;
color: white;
transition: all 0.2s ease;
}
.btnaddproperty:hover {
  cursor: pointer;
  background: rgb(0, 120, 125);
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
.btnupdateproperty {
  cursor: pointer;
  font-size: 15px;
  background: rgb(0, 150, 155);
  position: absolute;
  width: 80px;
  height: 42px;
  left: 8%;
  bottom: 2%;
  padding: 10px 18px;
  border: none;
  border-radius: 4px;
  color: white;
  transition: all 0.2s ease;
}

.btnupdateproperty:hover {
  background: rgb(0, 120, 125); /* Change the background color on hover */
}


.imagecontainer{
width: 250px;
height: 230px;


/* background: url(/photo-1600596542815-ffad4c1539a9.jpeg); */
border-radius: 15px 15px 0px 0px;
background-repeat:no-repeat;
}

h1{
    color: black;

}

    a {
        margin-left: 40px;
        margin-bottom: 20px;
        color: black;
    
        
    }

    .imgcontainerproperty{
        margin-left: 0%;
        border-radius: 15px 15px 0px 0px;
        width: 250px;
height: 230px;
    }
img{
    margin-left: 0%;
}
    .searchcontainer{
        margin-left: 20%;
        top: 40%;
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

</style>