
import type { Item } from '$lib/types/types';


export async function fetchItems(): Promise<Item[]> {
  const response = await fetch('https://localhost:7011/api/Property/GetProperties');
  const data = await response.json();
  return data;
}
