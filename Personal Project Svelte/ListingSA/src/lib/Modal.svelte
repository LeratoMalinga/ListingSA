<script>
  import * as z from 'zod';
  import { sendContactDetails} from '$lib/api/api';

  const schema = z.object({
    name: z.string().nonempty(),
    phone: z.string().nonempty(),
    email: z.string().nonempty().email(),
  });

  export let isOpen = false;
  export let name = '';
  export let phone = '';
  export let email = '';
  export let agentName='';
  export let to = '';
  export let errors = {};

  
  


  function closeModal() {
    name = '';
    phone = '';
    email = '';
    errors = {};
    isOpen = false;
  }

  

  export async function saveData() {
    const data = { to,name, phone, email,agentName };
   console.log(data)
    try {
      schema.parse(data);
      sendContactDetails(data);
      closeModal();
      
    } catch (error) {
      errors = error.formErrors.fieldErrors;
    }
  }
</script>

{#if isOpen}
  <div class="modal">
    <div class="modal-content">
      <h2>Enter your details</h2>
      <form on:submit|preventDefault={saveData}>
        <label>
          Name:
          <input type="text" bind:value={name} />
          {#if errors.name}<p class="error">{errors.name}</p>{/if}
        </label>
        <label>
          PhoneNumber:
          <input type="text" bind:value={phone} />
          {#if errors.phone}<p class="error">{errors.phone}</p>{/if}
        </label>
        <label>
          Email:
          <input type="email" bind:value={email} />
          {#if errors.email}<p class="error">{errors.email}</p>{/if}
        </label>
        <button type="submit" class="save">Save</button> <button on:click={closeModal} class="cancel">Cancel</button>
      </form>  
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 100%;
  }

  .error {
    color: red;
    font-size: 0.8em;
  }

  /* Button Styling */
  button {
    border: none;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
  }

  button.save {
    background-color: #4caf50;
    color: white;
  }

  button.cancel {
    background-color: red;
    color: white;
  }
  button.cancel:hover {
    background-color: rgb(109, 4, 4);
  }

  button.save:hover {
    background-color: #45a049;
  }

  /* Input Alignment */
  form label {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  form input[type="text"],
  form input[type="email"] {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
  }
</style>


