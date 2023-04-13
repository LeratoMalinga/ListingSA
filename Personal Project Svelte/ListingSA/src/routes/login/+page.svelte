<script lang="ts">
    import { toast, Toaster } from 'svelte-french-toast';
    import * as yup from 'yup';
    import jwtDecode from 'jwt-decode';


    export let form;

    const loginSchema = yup.object().shape({
        email: yup.string().required('Email is required').email('This is not a valid email'),
        password: yup.string().required('Password is required').min(8, 'Must be at least 8 characters').max(20, 'Must be at most 20 characters')
    });

    async function subscribe(event: Event) {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        const email = data.get('email');
        const password = data.get('password');

        try {
            await loginSchema.validate({ email, password }, { abortEarly: false });
            console.log('SUCCESS')
            console.log({ email, password })

            const response = await fetch('https://localhost:7011/api/Authentification/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const token = await response.text(); // parse the response as text
                localStorage.setItem('token', token);
                toast.success('Login successful');
                // return (window.location.href = '/AgentDashboard');
            } else {
                toast.error('Invalid Email Or Password');
            }

            const token = localStorage.getItem('token');
            

if (token) {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (userRole === 'Agent') {
  window.location.href = '/AgentDashboard';
} else if (userRole === 'Tenant') {
  window.location.href = '/TenantDashboard';
} else {
  console.log('Unknown user role:', userRole);
}
} else {
    console.log('No token found');
}
        } catch (error) {
            console.log(error);
            const { inner } = error;
            const errors = {};
            inner.forEach(({ path, message }) => {
                errors[path] = message;
                toast.error(message); // show error message to the user
            });
            if (form) {
                form.errors = errors;
            }
            console.log(errors);
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
    <div class="loginformcontainer">
        <form on:submit|preventDefault={subscribe}  id="main">
            <h2>Login</h2>

            <div class="input-parent">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required />
                {#if form && form.errors.email}
                    <p class="error">{form.errors.email}</p> // show error message to the user
                {/if}
            </div>

            <div class="input-parent">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required />
                {#if form && form.errors.password}
                    <p class="error">{form.errors.password}</p> // show error message to the user
                {/if}
            </div>

            <button type="submit">Login</button>
            <div class="linkcontainer">
                <p>Don't have an account? <a class="registerlink" href="/register">Register Here</a></p>
            </div>
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
     margin-top: 40%;
     top:40%;
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
 
 .linkcontainer{
     margin-top: 5%;
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
 
     .registerlink{
         margin-left: 10px;
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