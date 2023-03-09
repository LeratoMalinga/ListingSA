// @ts-nocheck
import type { PageServerLoad } from "./$types"

const GetProperties = async () => {
    console.log("page started");
    const res = await fetch ("https://localhost:7011/api/Property/GetProperties");
    const data = await res.json();
    console.log(data);
    return data.products
}

export const load = async () => {
    try{
        return {
            products: await GetProperties(),
        }
    }
	catch(error)
    {
      console.log(error)
    }
}


;null as any as PageServerLoad;