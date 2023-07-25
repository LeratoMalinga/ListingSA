import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7011/ChatHub') // Replace with your actual hub URL
  .build();

export async function startConnection() {
  try {
    await connection.start();
    console.log('SignalR connection established.');
  } catch (err) {
    console.error('Error starting SignalR connection:', err);
  }
}

export function receiveMessage(callback) {
  connection.on('ReceiveMessage', (sender, message) => {
    callback(sender, message);
  });
}

export function sendMessage(user, message) {
  connection.invoke('SendMessage', user, message);
}
