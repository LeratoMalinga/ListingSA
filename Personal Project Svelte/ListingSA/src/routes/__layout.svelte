<header>
    <nav>
        <div class="logoImage">
            <img src="/Logohome2.png" alt ="logo" width="90px" height="90px">
        </div>
        <div class="links">
            <a href="/">Home</a>
            <a href="/hello">About</a>
            <a href="/login">Login</a>
        </div>
    </nav>   
</header>

<main>
    <slot></slot>
</main>


<style>
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

   
   /*.container{
    background:rgb(44,60,91);
    width:700px;
    height: 150px;
    border-radius: 15px;
    margin-top:25%;
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
   
   /*.tellphoneinformatincontainer{
    position: relative;
    left: 90px;
    top:0px;
   }*/
   

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
    </style>