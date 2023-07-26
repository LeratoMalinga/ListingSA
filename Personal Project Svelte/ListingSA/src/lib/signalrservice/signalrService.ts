// signalr-service.js

import * as signalR from '@microsoft/signalr';

const signalRService = {
  connection: null,

  // Initialize the SignalR connection
  async initialize() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https:/localhost:7011/ChatHub') // Replace with the URL of your ChatHub endpoint
      .build();

    try {
      await this.connection.start();
      console.log('SignalR connection started successfully.');
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
    }
  },

  // Method to send a message to the SignalR Hub
  async sendMessage(message) {
    try {
      await this.connection.invoke('SendMessageToUser', message);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  },

  // Method to receive messages from the SignalR Hub
  onReceiveMessage(callback) {
    this.connection.on('ReceiveDM', (message) => {
      callback(message);
    });
  },
};

export default signalRService;
