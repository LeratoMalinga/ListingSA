<script lang="ts">
import type { Item } from '$lib/types/types';
import { getItembyid} from '$lib/api/api';
import { onMount } from 'svelte';
import jwtDecode from 'jwt-decode';
import toast ,{Toaster} from 'svelte-french-toast';
import BackButton from "$lib/Backbutton.svelte";

export let form;

let item: Item[] = [];

async function getItem() {
      const itemId = localStorage.getItem('propertyId');
      const token = localStorage.getItem('token');
      console.log(itemId);
      if (!token) {
        // handle missing token
        return;
      }
      item = await getItembyid(itemId);
    }

  
async function subscribe(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const data = new FormData(form);
  const itemId = localStorage.getItem('propertyId');
  const item = await getItem();
  const name = data.get('name') as string;
  const price = data.get('price') as string;
  const city = data.get('city') as string;
  const suburb = data.get('suburb') as string;
  const province = data.get('province') as string;
  const type = data.get('type') as string;
  const address = data.get('address') as string;
  const image = data.get('image') as File;

  let imageBase64 = '';

  if (image) {
    // read the image file as a base64 string
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      imageBase64 = reader.result as string;
      console.log(imageBase64);
      // call the function to add the property after the image has been read
      updateProperty(name, price, city, suburb, province, type, address, imageBase64);
    };
    reader.onerror = () => {
      console.log('Error while reading the file');
    };
  } else {
    // call the function to add the property if no image has been selected
    updateProperty(name, price, city, suburb, province, type, address, imageBase64);
  }

  async function updateProperty(
    name: string,
    price: string,
    city: string,
    suburb: string,
    province: string,
    type: string,
    address: string,
    imageBase64: string,
  ) {

  const token = localStorage.getItem('token');

if (!token) {
  // handle missing token
  return;
}

const decodedToken = jwtDecode(token);

    const model = {
      name,
      province,
      city,
      suburb,
      price,
      address,
      imageBase64,
      type
    };

    try {
      console.log('SUCCESS');
    } catch (err) {
      console.log(err);
      const { fieldErrors: errors } = err.flatten();
      const { name, price, ...rest } = model;
      return {
        data: rest,
        errors,
      };
    }
    const itemId = localStorage.getItem('propertyId');
    
    const response = await fetch(`https://localhost:7011/api/Property/UpdateProperty/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(model),
  });

    console.log(response);
    if (response.ok) {
      toast.success('Update Successful');
      return (window.location.href = '/AgentDashboard');
    } else {
      const result = await response.json();
      console.log(result);
      const error = result.title || result;
      console.log(error);
      toast.error("server error")
    }
  }
}

onMount(getItem);

</script>

<Toaster/>


<body>
  <div class=gobackbutton>
    <BackButton/>
</div>
    <div class="registerformcontainer">
        <form  on:submit|preventDefault={subscribe} id="main" >
            <h2>Update Property</h2>
        
            <div class="form-control">
                <div class="input-parent">
                    <label for="propertyname"> Property Name:</label>
                    <input type="text" id="name" name="name" value={item.name} > 
                    <label for="name">
                        {#if form?.errors?.name}
                        <span class="label-text-alt text-error">{form?.errors?.name[0]}</span>
                        {/if}
                      </label>
                  </div>
            </div>
            
          <div class="form-control">
            <div class="input-parent">
                <label for="propertyname">Price:</label>
                <input type="text" id="number" name="price" value={item.price}>
              </div>
          </div>

          <div class="form-control">
            <div class="input-parent">
                <label for="province">Select Province:</label>
                <select name="province" id="province">
                    <option >Gauteng</option>
                    <option >Limpopo</option>
                    <option >Free State</option>
                    <option >Western Cape</option>
                    <option >Northeren Cape</option>
                    <option >North West</option>
                    <option >Mpumalanga</option>
                    <option >Kwa-Zulu-Natal</option>
                    <option >Estern Cape</option>
              </div>
        </div>

       
        <div class="form-control">
          <div class="input-parent">
              <label for="city">Select a City:</label>
              <select name="city" id="city"  value={item.city}>
                  <option value="Pretoria">Pretoria</option>
                  <option value="Durban">Durban</option>
                  <option value="Cape Town">Cape Town</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Bloemfontein">Bloemfontein</option>
                  <option value="Port Elizabeth">Port Elizabeth</option>
                  <option value="Kimberley">Kimberley</option>
                  <option value="Nelspruit">Nelspruit</option>
                  <option value="Pietermaritzburg">Pietermaritzburg</option>
              </select>
          </div>
      </div>
      
         
        <div class="form-control">
            <div class="input-parent">
                <label for="suburb">Select a Surburb:</label>
                <select name="suburb" id="suburb" value={item.suburb}>
                    <option >Hatfield</option>
                    <option >Midrand</option>
                    <option >Rosebank</option>
                    <option >Wapadrand</option>
                    <option >Braamfontein</option>
                    <option >Colaid</option>
                    <option >Dubani</option>
                    <option >Zimbali</option>
                    <option >Capina</option>
              </div>
        </div>

        <div class="form-control">
            <div class="input-parent">
                <label for="type">Property Type:</label>
                <select name="type" id="type" value={item.type}>
                    <option >TownHouse</option>
                    <option >Flat</option>
                    <option >Commune</option>
              </div>
        </div>
         
        <div class="form-control">
            <div class="input-parent">
                <label for="propertyname">Address</label>
                <input type="text" id="address" name="address" value={item.address}>
                <label for="password">
                    {#if form?.errors?.email}
                    <span class="label-text-alt text-error">{form?.errors?.email[0]}</span>
                    {/if}
                  </label>
              </div>
          </div>
        
              <div class="form-control">
                <div class="input-parent">
                    <label for="propertyname">Property Picture:</label>
                    <input type="file" id="propertypicture" name="image">
                  </div>
              </div>
           
            <button type="submit" >Update Property</button>
          </form>
    
    </div>
    
</body>



<style>


    *,
    *:before,
    *:after {
        margin: 0;
        padding: 0;
        font-family: inherit;
        box-sizing: border-box;
    }
    #main {
  top: 20%;
  width: 350px;
  height: fit-content;
  margin: 40px auto;
  font-family: "Segoe UI", sans-serif;
  padding: 25px 28px;
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

    @keyframes popup {
        0% {
            transform: scale(0.2);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    h2 {
        text-align: center;
        font-size: 28px;
        margin-bottom: 20px;
        font-weight: 400;
        color: black;
    }
    .input-parent {
        display: block;
        margin-bottom: 20px;
    }
    label {
        display: block;
        font-size: 16px;
        margin-bottom: 8px;
        color: black;
    }
    .input-parent input {
        padding: 10px 8px;
        width: 100%;
        font-size: 16px;
        background: white;
        border: none;
        color: black;
        border-radius: 4px;
        outline: none;
        transition: all 0.2s ease;
        
        border: 1px solid #302d2d;
    }
    /*.input-parent input:hover {
        background: none;
    }*/
    .input-parent input:focus {
        box-shadow: 0px 0px 0px 1px #0087ff;
    }
    
    select {
        padding: 10px 8px;
        width: 100%;
        font-size: 16px;
        background: white;
        border: none;
        color: black;
        border-radius: 4px;
        outline: none;
        transition: all 0.2s ease;
        
        border: 1px solid #302d2d;
    }
    button {
        padding: 10px 18px;
        font-size: 15px;
        background: rgb(0,150,155);
        width: 100%;
        border: none;
        border-radius: 4px;
        color: white;
        transition: all 0.2s ease;
    }
    button:hover {
        opacity: 0.9;
    }
    button:focus {
        box-shadow: 0px 0px 0px 3px black;
    }
    
    .gobackbutton{
        margin-top: 10%;
        margin-left: 25%;
    }
    </style>

