export interface Item {
    id:any;
    name: string;
    city: string;
    price: string;
    suburb:string;
    type:string;
    imageBase64:string;
    appUser:appUser;
  }

export interface appUser{
  id:string;
  email: string;
  name:string;
}


export interface request{
  To:string;
  name:string;
  contactNumber:string;
  email:string;
}