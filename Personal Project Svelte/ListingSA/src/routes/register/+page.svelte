<script lang="ts">
    
    async function subscribe (event: Event) {
        const form = event.target as HTMLFormElement
        const data= new FormData(form)

        const email= data.get('email')
        const password = data.get('password')
        const confirmPassword = data.get('confirmPassword')
        const userName = data.get('email')
        const name = data.get('name')
        const userRole = data.get('userRole')

        const model={
            email,
            password,
            confirmPassword,
            userName,
            name,
            userRole
        }

        console.log(model)

        await fetch ('https://localhost:7011/api/Authentification/register',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(model)
         })

         return {
            redirect:'/login'
         }
    }



</script>


<div class="registerformcontainer">
    <form  on:submit|preventDefault={subscribe} id="main" >
        <h2>Register</h2>
    
        <div class="form-control">
            <div class="input-parent">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name"> 
              </div>
        </div>
        
      <div class="form-control">
        <div class="input-parent">
            <label for="username">Email:</label>
            <input type="email" id="username" name="email">
          </div>
      </div>
       
        <div class="form-control">
            <div class="input-parent">
                <label for="userrole">Select UserRole:</label>
                <select name="userRole" id="userroles">
                    <option >Agent</option>
                    <option >Tenant</option>
              </div>
        </div>
         
        <div class="form-control">
            <div class="input-parent">
                <label for="password">Password:</label>
                <input type="password" id="password" name=password>
              </div>
        </div>
        
        <div class="form-control">
            <div class="input-parent">
                <label for="confirmpassword"> Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword">
              </div>
        
        </div>
        
        <button type="submit">Register</button>
        
      </form>

</div>

<style>

/*.loginformcontainer{
    background: grey;
    width: 374px;
    height:500px;
    margin-top: 10%;
    margin-left: 36%;

}*/


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
    height:620px;
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



   



</style>