<script lang="ts">
import type { Item } from '$lib/types/types';
import { getItembyid} from '$lib/api/api';
import { onMount } from 'svelte';

const params = new URLSearchParams(window.location.search);
const itemId = params.get('id');

let item: Item[] = [];

async function getItem() {
      const token = localStorage.getItem('token');
    
      if (!token) {
        // handle missing token
        return;
      }
    
      item = await getItembyid(itemId);
    }

    onMount(getItem);

</script>


