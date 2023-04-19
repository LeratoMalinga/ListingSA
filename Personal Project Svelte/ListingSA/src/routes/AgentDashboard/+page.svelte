<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { fetchItems,deleteItem} from '$lib/api/api';
    import type { Item } from '$lib/types/types';
    import { paginate, LightPaginationNav } from 'svelte-paginate';
    import jwtDecode from 'jwt-decode';
    import { string } from 'zod';

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
          || regex.test(item.price) || regex.test(item.type) || regex.test(item.suburb));
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


<header>
    <nav>
        <div class="logoImage">
            <img src="/Logohome2.png" alt ="logo" width="90px" height="90px">
        </div>
        <div class="links">
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/login">Login</a>
        </div>
    </nav>   
</header>

<div class="headingcontainer">
    <h1>Welcome to Your Agent DashBoard</h1>
</div>

<a class="addproperty" href="/AddProperty"><button class="btnaddproperty">Add Property</button></a>

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
.btndeleteproperty{
font-size: 15px;
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
.btnaddproperty{
font-size: 15px;
background: rgb(0,150,155);
position: absolute;
width: 120x;
height: 42px;
left: 45%;
top:35%;
margin-bottom: 40px;
padding: 10px ;
border: none;
border-radius: 4px;
color: white;
transition: all 0.2s ease;
}

.btnupdateproperty{
font-size: 15px;
background: rgb(0,150,155);
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
header {
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
        display:flex;
        align-items:center;
        max-width: 90%;
        margin :0 auto;
        margin-left:0;
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
        position: absolute;
        margin-left: 40%;
        top: 40%;
    }
   .paginationcontainer{
    position: absolute;
    margin-top:35%;
    margin-right: 6%;
    margin-left: 9%;
   }
</style>