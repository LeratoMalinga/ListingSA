<script>
  import * as z from 'zod';
  import { sendContactDetails} from '$lib/api/api';

  const schema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  });

  export let isOpen = false;
  export let name = '';
  export let phone = '';
  export let email = '';
  export let errors = {};

  function closeModal() {
    name = '';
    phone = '';
    email = '';
    errors = {};
    isOpen = false;
  }

  function saveData() {
    const data = { name, phone, email };

    try {
      schema.parse(data);
      sendContactDetails(data);
      // Do something with the data here
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
        <button type="submit">Save</button>
      </form>
      <button on:click={closeModal}>Cancel</button>
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
</style>
