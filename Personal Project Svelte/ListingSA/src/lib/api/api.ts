
import type { Item, request } from '$lib/types/types';
import { toast, Toaster } from 'svelte-french-toast';


export async function fetchItems(): Promise<Item[]> {
  const response = await fetch('https://localhost:7011/api/Property/GetProperties');
  const data = await response.json();
  return data;
}

export async function deleteItem(id: string): Promise<Item[]> {
  const token = localStorage.getItem('token');

  if (!token) {
    // handle missing token
    return;
  }

  const response = await fetch(`https://localhost:7011/api/Property/DeleteProperty/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    // handle error
    console.error('Error deleting item:', response.statusText);
    return;
  }

  // success
}


export async function updateItem(id: string,model:Item): Promise<Item[]> {
  const token = localStorage.getItem('token');

  if (!token) {
    // handle missing token
    return;
  }

  const response = await fetch(`https://localhost:7011/api/Property/UpdateProperty/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(model),
  });

  if (!response.ok) {
    // handle error
    console.error('Error updating item:', response.statusText);
    return;
  }

  // success
}

export async function getItembyid(id: string): Promise<Item[]> {
  const response = await fetch(`https://localhost:7011/api/Property/GetPropertyById/${id}`)
  const data = await response.json();
  return data;
}

export async function sendContactDetails(model:request){
  const token = localStorage.getItem('token');

  if (!token) {
    // handle missing token
    return;
  }

  const response = await fetch(`https://localhost:7011/api/Contact/SendEmail`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(model),
  });

  if (!response.ok) {
    // handle error
    console.log(response);
    toast.error("server error");
    console.error('Error Sending email:', response.statusText);
    return;
  }
  toast.success('Contact details sent');
}




