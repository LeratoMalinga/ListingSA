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
    width:700px;
    height: 150px;
    border-radius: 15px;
    margin-top:15%;
    margin-left:25%;
    padding:20px

   }
   .container p{
    color:white;
    
   }

   .container .icons img{
    margin-left: 20px;
   }

   .container .icons{
    margin-left: 36%;
   }
   .infocontainer{
    position: relative;
   }
   .paracontainer{
    position: relative;
    left:25%;
   }
   /*.tellphoneinformatincontainer{
    position: relative;
    left: 90px;
    top:0px;
   }*/
   

   

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
    .newslettercontainer{
    background:rgb(44,60,91);
    width:500px;
    height: 150px;
    border-radius: 15px;
    margin-top:5%;
    margin-left:31%;
    margin-bottom: 40px;
    padding:20px
    }
     
    button{
        background-color:white ;
        color:black;
        width: 120px;
        margin-left: 10px;
        height: 40px;
    }
    p{
        color:white;
    }
  

    

</style>