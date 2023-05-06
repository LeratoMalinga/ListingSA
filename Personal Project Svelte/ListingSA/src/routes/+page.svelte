<script lang="ts">
    import '../styles/global.css'
    import { toast, Toaster } from 'svelte-french-toast';

    async function subscribe(event: Event) {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        const email = data.get('email');
        const name = data.get('name');
        
            console.log({ email, name })
            const response = await fetch('https://localhost:7011/api/Newsletter/Subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });

            if (response.ok) {
                toast.success('Thank you for your subscription');
            } else {
                toast.error('Invalid Email');
            }
        }
</script>
<Toaster/>


<body>

    <div class="container">
        <div class="infocontainer">
        <p style="font-weight:bold; font-size:20px;">Contact</p>
        <p>Listing SA</p>
        <p> 1264 Melrouse CA</p>
        </div>  
       

        <div class="icons">
            <img src="/Twitter - Negative.png" alt="" width="20px"> 
            <img src="/Instagram - Negative.png" alt="" width="20px"> 
            <img src="/Facebook - Negative.png" alt="" width="20px"> 
            <img src="/Google - Negative.png" alt="" width="20px"> 
        </div>
           
</div>
''
<div class="newslettercontainer">
    <form on:submit|preventDefault={subscribe} >
        <div class="paracontainer">
            <p style="font-weight:bold; font-size:20px;">Subscribe to our Newsletter</p>
            <p>Get full updates on new properties</p>
            </div>  
          
            <input type="text" placeholder="Your Name" name="name">
            <input type="text" placeholder="Your email" name="email">
            <button>Subscribe</button>
    </form>
</div>

</body>
   





<style>
   .container{
  background:rgb(44,60,91);
  max-width: 700px;
  width: 90%;
  height: 150px;
  border-radius: 15px;
  margin: 15% auto 0;
  padding: 20px;
}

.container p{
  color:white;
}

.container .icons img{
  margin-left: 20px;
}

.container .icons{
  margin: 0 auto;
  max-width: 400px;
}

.infocontainer{
  position: relative;
}

.paracontainer{
  position: relative;
  left: 25%;
}

img{
  margin-left: 0%;
  max-width: 100%;
}

body{
  background-image: url(/background.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}

.newslettercontainer{
  background:rgb(44,60,91);
  max-width: 500px;
  width: 90%;
  height: 150px;
  border-radius: 15px;
  margin: 5% auto 40px;
  padding: 20px;
}

button{
  background-color:white;
  color:black;
  width: 120px;
  margin-left: 10px;
  height: 40px;
}

p{
  color:white;
}

@media screen and (max-width: 768px) {
  /* Adjust styling for smaller screens */
  .container {
    height: auto;
    margin: 10% auto 0;
    padding: 10px;
  }
  
  .container .icons {
    max-width: 100%;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .paracontainer {
    left: 0;
  }
  
  .newslettercontainer {
    height: auto;
    margin: 5% auto 40px;
    padding: 10px;
  }
  
  button {
    width: 100%;
    margin: 10px 0;
  }
}


</style>