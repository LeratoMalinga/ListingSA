<script lang="ts">


    export let form;

    import {z} from 'zod'
    import toast, { Toaster } from 'svelte-french-toast';


   let error=""
  
    //form Validation
 const registerSchema = z.object ({
    name: z.string({required_error:'Name is required'}),
    price: z.string({required_error:'price is required'}),
    city: z.string({required_error:'City is required'}),
    suburb: z.string({required_error:'Suburb is required'}),
    province: z.string({required_error:'Province is required'}),
    type: z.string({required_error:'Type is required'}),
    address: z.string({required_error:'Address is required'}), 
 })

    async function subscribe (event: Event) {
        const form = event.target as HTMLFormElement
        const data= new FormData(form)
         
        const name= data.get('name')
        const price = data.get('price')
        const city = data.get('city')
        const suburb= data.get('suburb')
        const province = data.get('province')
        const type = data.get('type')
        const  address = data.get('address')

        const model={
            name,
            province,
            city,
            suburb,
            price,
            address,
            type
        }

        try {
            const result = registerSchema.parse(model)
            console.log('SUCCESS')
            console.log(result)
        } catch (err) {  
            console.log(err)
            const {fieldErrors: errors} = err.flatten()
            const {name,province,city,suburb,price,address,type,...rest} = model;
            return {
                data:rest,
                errors
            };
        }


        console.log(model)
        error =""
       const response = await fetch ('https://localhost:7011/api/Property/AddProperty',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(model)
         })

         if (response.ok)
         {
            // toast.success("Registration was a success")
            return window.location.href = "/AgentDashboard"
         } 
         else {
            const result = await response.json()
            error = result.error
            toast.error('Server Error')
         }
                
    }


</script>
<Toaster/>

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

<body>
    <div class="registerformcontainer">
        <form  on:submit|preventDefault={subscribe} id="main" >
            <h2>Add Property</h2>
        
            <div class="form-control">
                <div class="input-parent">
                    <label for="propertyname"> Property Name:</label>
                    <input type="text" id="name" name="name"> 
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
                <input type="text" id="number" name="price">
                <!-- <label for="password">
                    {#if form?.errors?.email}
                    <span class="label-text-alt text-error">{form?.errors?.email[0]}</span>
                    {/if}
                  </label> -->
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
                    <select name="city" id="city">
                        <option >Pretoria</option>
                        <option >Durban</option>
                        <option >Cape Town</option>
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
                    <label for="surburb">Select a Surburb:</label>
                    <select name="suburb" id="suburb">
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
                    <select name="type" id="type">
                        <option >TownHouse</option>
                        <option >Flat</option>
                        <option >Commune</option>
                  </div>
            </div>
             
            <div class="form-control">
                <div class="input-parent">
                    <label for="propertyname">Address</label>
                    <input type="text" id="address" name="address">
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
                    <input type="file" id="propertypicture" name="propertypicture">
                    <label for="password">
                        {#if form?.errors?.email}
                        <span class="label-text-alt text-error">{form?.errors?.email[0]}</span>
                        {/if}
                      </label>
                  </div>
              </div>
           
           
            <button type="submit">Add Property</button>
         
            
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
    top:30%;
    width: 350px;
    height:fit-content;
    margin: 40px auto;
    font-family: "Segoe UI", sans-serif;
    padding: 25px 28px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #302d2d;
    /*animation: popup 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);*/
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
    img{
        margin-left: 0%;
    }

    body{
        background-image:  url(/background.jpg);
        background-repeat: no-repeat;
        background-attachment: fixed; 
        background-size:100% 100%;
       
    }
    
   



</style>