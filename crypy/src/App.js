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
      marketHeaders: [],
      marketLive: [],
      marketSummary:[]
    };
    this.renderCell = this.renderCell.bind(this);
  }

  componentWillMount(){
    axios.get(`http://localhost:4000`)
    .then((res) => {
      this.setState({
        marketHeaders: Object.keys(res.data.result[0]),
        marketSummary:res.data.result
      });
    });

    // socket.on('connect', () => {
    //   console.log("Connected to socket");
    // });
    //
    // socket.on('receiveBittrex', (data) => {
    //   if (Object.keys(data).length === 0 && data.constructor === Object) {
    //   } else {
    //     let marketLive = data.M[0].A[0].Deltas;
    //     this.setState({marketLive});
    //   }
    // });
    //
    // socket.emit('getBittrex');
    // socket.on('disconnect', function(){});
  }

  renderCell(rowIndex, colIndex){
    const {marketHeaders, marketSummary} = this.state;
    return (
      <Cell>
        {marketSummary[rowIndex][marketHeaders[colIndex]]}
      </Cell>
    )
  }

  render() {
    const { marketHeaders, marketSummary } = this.state;

      return (
        <div className="pt-card pt-elevation-4 crypy-card">
          <h2>Market Information:</h2>
          <Table numRows={marketSummary.length}>
            {marketHeaders.map((col, i) => {
              return (
                <Column
                  key={i}
                  name={col}
                  renderCell={this.renderCell}
                />
              );
            })}
          </Table>
        </div>
      );
  }
}

export default App;
