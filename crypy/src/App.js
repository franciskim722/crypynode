import React, { Component } from 'react';
import axios from 'axios';
import openSocket from 'socket.io-client';
import './App.css';

import '@blueprintjs/core/dist/blueprint.css';
import '@blueprintjs/table/dist/table.css';

import {Cell, Column, Table} from '@blueprintjs/table';

const socket = openSocket('http://localhost:8000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socketState: '',
      marketLive: [],
      marketSummary:[]
    }
  }

  componentDidMount(){
    axios.get(`http://localhost:4000`)
    .then((res) => {
      const marketSummary = res.data.result;
      this.setState({marketSummary});
    });

    socket.on('connect', () => {
      console.log("Connected to socket");
    });

    socket.on('receiveBittrex', (data) => {
      if (Object.keys(data).length === 0 && data.constructor === Object) {
      } else {
        let marketLive = data.M[0].A[0].Deltas;
        this.setState({marketLive});
      }
    });

    socket.emit('getBittrex');
    socket.on('disconnect', function(){});
  }

  render() {
    const { marketLive, marketSummary } = this.state;

    if(marketLive){
      return (
        <div className="App">
          <Table numRow={5}>
            <Column name="Coin Information"/>
            <Column />
            <Column />
          </Table>
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}

export default App;
