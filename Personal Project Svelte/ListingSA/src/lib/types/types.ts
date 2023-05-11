export interface Item {
    id:any;
    name: string;
    city: string;
    price: string;
    suburb:string;
    type:string;
    province:string;
    imageBase64:string;
    appUser:appUser;
  }

export interface appUser{
  id:string;
  email: string;
  name:string;
}


export interface request{
  to:string;
  agentName:string;
  name:string;
  phone:string;
  email:string;
}