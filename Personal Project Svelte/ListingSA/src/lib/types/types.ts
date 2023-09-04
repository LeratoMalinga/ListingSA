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
  id: string;
  userName: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string; // Note: Change this to a Date type if possible (e.g., Date)
  communicationId: string; // Note: Change this to a number type if appropriate (e.g., number)
  user: {
    name: string;
    version: number;
    createdOn: string; // Note: Change this to a Date type if possible (e.g., Date)
    claims: any[]; // You may specify a more specific type for claims if you have more information about it
    roles: string[];
    logins: any[]; // You may specify a more specific type for logins if you have more information about it
    tokens: any[]; // You may specify a more specific type for tokens if you have more information about it
    id: string;
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: string | null;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: string | null; // Note: Change this to a Date type if possible (e.g., Date)
    lockoutEnabled: boolean;
    accessFailedCount: number;
  };
}

export interface AppUser{
    name: string;
    version: number;
    createdOn: string; // Note: Change this to a Date type if possible (e.g., Date)
    claims: any[]; // You may specify a more specific type for claims if you have more information about it
    roles: string[];
    logins: any[]; // You may specify a more specific type for logins if you have more information about it
    tokens: any[]; // You may specify a more specific type for tokens if you have more information about it
    id: string;
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: string | null;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: string | null; // Note: Change this to a Date type if possible (e.g., Date)
    lockoutEnabled: boolean;
    accessFailedCount: number;
}

export interface OpenChat {
  otherUserInfo: AppUser; // This should match the actual structure of your AppUser type
  id: string;
  userName: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
  communicationId: string;
}

 export interface ProcessedChatMessage {
  senderInfo: AppUser; 
  receiverInfo: AppUser;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
}

export interface UniqueUserInfo{
  id:any;
  name: string;
}