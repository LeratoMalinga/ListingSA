<script>

</script>


<div class="loginformcontainer">
    <form action="#!" id="main">
        <h2>Register</h2>
    
        <div class="input-parent">
          <label for="username">Name:</label>
          <input type="text" id="username">
        </div>
    
        <div class="input-parent">
            <label for="username">Email:</label>
            <input type="email" id="username">
          </div>

          <div class="input-parent">
            <label for="username">Select UserRole:</label>
            <select name="userroles" id="cars">
                <option value="volvo">Agent</option>
                <option value="saab">Tenant</option>
          </div>
         
        <div class="input-parent">
          <label for="password">Password:</label>
          <input type="password" id="password">
        </div>

        <div class="input-parent">
            <label for="confirmpassword"> Confirm Password:</label>
            <input type="password" id="password">
          </div>
    
        <button type="submit">Register</button>
        <!--<div class="linkcontainer">
            <p>Don't have an account?</p><a href="/register"><p>Register Here</p></a>
        </div>-->
        
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