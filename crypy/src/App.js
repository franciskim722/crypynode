import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

const socket = openSocket('http://localhost:8000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socketState: ''
    }
    this.socketRead = this.socketRead.bind(this);
  }

  socketRead() {
    socket.on('connect', () => {
      console.log("Connected to socket");
    });
    socket.on('receiveBittrex', (data) => {
      console.log(data);
      // if(data !== undefined && data.M[0].A !== undefined){
      //   console.log(data.M[0].A);
      // }
    });
    socket.emit('getBittrex');
    socket.on('disconnect', function(){});
  }

  render() {
    return (
      <div className="App">
      {this.socketRead()}
      </div>
    );
  }
}

export default App;
