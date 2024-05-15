<!-- DeleteModal.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    let isOpen = false;
  
    export function open() {
      isOpen = true;
    }
  
   export function close() {
      isOpen = false;
    }
  
    export function confirmDelete() {
      dispatch('delete');
      close();
    }
  </script>
  
  {#if isOpen}
    <div class="modal">
      <div class="modal-content">
        <h2>Delete Item</h2>
        <p>Are you sure you want to delete this item?</p>
        <div class="modal-buttons">
          <button on:click={confirmDelete}>Delete</button>
          <button on:click={close}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}
  