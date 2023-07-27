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

export interface ChatMessage {
  Id: string;
  User: string; // Assuming that the 'User' property is a string representation of a GUID (e.g., "64e5ca9d-2be9-44df-9fe5-39412ed11805")
  UserName?: string; // Optional property denoted by '?'
  Sender?: string; // Optional property denoted by '?'
  Receiver?: string; // Optional property denoted by '?'
  Message?: string; // Optional property denoted by '?'
  Timestamp: Date; // Assuming 'Timestamp' is a Date type
  CommunicationId: number;
}
