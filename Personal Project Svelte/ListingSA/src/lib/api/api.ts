
import type { Item } from '$lib/types/types';


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
    }
  });

  if (!response.ok) {
    // handle error
    console.error('Error deleting item:', response.statusText);
    return;
  }

  // success
}


