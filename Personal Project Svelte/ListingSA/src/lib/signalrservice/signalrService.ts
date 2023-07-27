import * as signalR from '@microsoft/signalr';


const signalRService = {
  connection: null,
  connectionId: null, // Add a property to store the connection ID

  // Initialize the SignalR connection
  async initialize(userId,fullName,userName) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https:/localhost:7011/ChatHub') // Replace with the URL of your ChatHub endpoint
      .build();

    try {
      await this.connection.start();
      this.connectionId = this.connection.connectionId;
      console.log('Connection ID:', this.connectionId);
      console.log('SignalR connection started successfully.');
       await this.connection.invoke('PublishUserOnConnect', userId, fullName, userName);
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
    }
  },

  async sendMessage(model) {
    try {
      await this.connection.invoke('SendMessageToUser', model);
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
