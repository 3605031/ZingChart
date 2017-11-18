import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { core as ZingChart } from 'zingchart-react';
import axios from 'axios';
import "./App.css"
import { Button } from 'react-bootstrap';


class App extends Component {
  constructor() {
    super();
    this.state = {
      BTC: {},
      ETH: {},
      LTC: {}
    }
    this.get30Days = this.get30Days.bind(this);
    this.getHourly = this.getHourly.bind(this)
  }

  get30Days(currency){
    axios.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${currency}&tsym=USD&limit=30&aggregate=1`)
      .then(res => {
        console.log(res)
        

        var myConfig2 = {
          type: "stock",
          title: {
            text: `${currency} 30 Days`,
            adjustLayout: true,
            fontColor: "#E3E3E5",
            marginTop: 7
          },
          plot: {
            aspect: "candlestick",
            tooltip: {
              text: "On %kl:<br><br>Open: $%open<br>High: $%high<br>Low: $%low<br>Close: $%close<br>"
            },
            trendUp: { //Stock Gain
              backgroundColor: "green",
              lineColor: "green",
              borderColor: "green"
            },
            trendDown: { //Stock Loss
              backgroundColor: "red",
              lineColor: "red",
              borderColor: "red"
            },
            trendEqual: { //No gain or loss
              backgroundColor: "blue",
              lineColor: "blue",
              borderColor: "blue"
            }
          },
          scaleX: {
            step: "day",
            transform: {
              minValue: 1420232400000,
              type: "date",
              all: "%D,<br>%m/%d"
            },
            item : {
              fontColor : "#dfdfe1"
            }
          },
          scaleY: {
            values: "4000:8000:1000",
            format: "$%v",
            item : {
              fontColor : "#dfdfe1"
            }
          },
          series: [{
            values: [
            ]
          }],
          backgroundColor: '#2C2C39'
        };

        //refactoring data to match Zingchart required format
        let resData = res.data.Data.map(apidata => {
          return [apidata.time * 1000, [apidata.open, apidata.high, apidata.low, apidata.close]]
        })
        console.log("resdata", resData);
        console.log("res Values array:", resData)
        let newValues = [{
          values:
          resData
        }]

        //X-scaling and api data point
        myConfig2.series = newValues
        myConfig2.scaleX.transform.minValue = res.data.TimeFrom * 1000;

        //Find the maximum/min high/low in the array for y scaling
        let highArray = res.data.Data.map(apidata => {
          return apidata.high
        })
        let max = highArray.reduce(function (a, b) {
          return Math.max(a, b);
        })
        let lowArray = res.data.Data.map(apidata => {
          return apidata.low
        })
        let min = lowArray.reduce(function (a, b) {
          return Math.min(a, b);
        })
        myConfig2.scaleY.values = `${Math.floor(min)}:${Math.ceil(max)}:${parseInt(max/10-min/10)}`

        console.log("new config2:", myConfig2)
        this.setState({
          [currency]: myConfig2
        })

      })
      .catch(err => {
        console.log(err)
      })
  }
     getHourly(currency){
    axios.get(`https://min-api.cryptocompare.com/data/histohour?fsym=${currency}&tsym=USD&limit=24&aggregate=1`)
      .then(res => {
        console.log(res)
        
        var myConfig2 = {
          type: "stock",
          title: {
            text: `${currency} Hourly`,
            adjustLayout: true,
            fontColor: "#E3E3E5",
            marginTop: 7
          },
          plot: {
            aspect: "candlestick",
            tooltip: {
              text: "On %kl:<br><br>Open: $%open<br>High: $%high<br>Low: $%low<br>Close: $%close<br>"
            },
            trendUp: { //Stock Gain
              backgroundColor: "green",
              lineColor: "green",
              borderColor: "green"
            },
            trendDown: { //Stock Loss
              backgroundColor: "red",
              lineColor: "red",
              borderColor: "red"
            },
            trendEqual: { //No gain or loss
              backgroundColor: "blue",
              lineColor: "blue",
              borderColor: "blue"
            }
          },
          scaleX: {
            step: 60000*60,
            transform: {
              minValue: 1420232400000,
              type: "date",
              all: "%m/%d,<br>%h %A"
            },
            item : {
              fontColor : "#dfdfe1"
            }
          },
          scaleY: {
            values: "4000:8000:1000",
            format: "$%v",
            item : {
              fontColor : "#dfdfe1"
            }
          },
          series: [{
            values: [
            ]
          }],
          backgroundColor: '#2C2C39'
        };

        //refactoring data to match Zingchart required format
        let resData = res.data.Data.map(apidata => {
          return [apidata.time * 1000, [apidata.open, apidata.high, apidata.low, apidata.close]]
        })
        console.log("resdata", resData);
        console.log("res Values array:", resData)
        let newValues = [{
          values:
          resData
        }]

        //X-scaling and api data point
        myConfig2.series = newValues
        myConfig2.scaleX.transform.minValue = res.data.TimeFrom * 1000;

        //Find the maximum/min high/low in the array for y scaling
        let highArray = res.data.Data.map(apidata => {
          return apidata.high
        })
        let max = highArray.reduce(function (a, b) {
          return Math.max(a, b);
        })
        let lowArray = res.data.Data.map(apidata => {
          return apidata.low
        })
        let min = lowArray.reduce(function (a, b) {
          return Math.min(a, b);
        })
        myConfig2.scaleY.values = `${Math.floor(min)}:${Math.ceil(max)}:${parseInt(max/10-min/10)}`

        console.log("new config2:", myConfig2)
        this.setState({
          [currency]: myConfig2
        })

      })
      .catch(err => {
        console.log(err)
      })
  }
  componentDidMount() {
    this.get30Days("BTC");
    this.get30Days("ETH");
    this.get30Days("LTC");
  }

  componentDidUpdate() {
    console.log(this.state)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={require('./logo.png')} className="App-logo" alt="logo" />
          <h1 className="App-title">Cryptocurrency Stock Watch</h1>
        </header>
        <div className="currency_title">Bitcoin</div>
        <Button className="button_left" bsStyle="primary" onClick={() => this.getHourly("BTC")}>Hourly</Button>
        <Button className="button_right" bsStyle="primary" onClick={() => this.get30Days("BTC")}>30 Days</Button>
        <ZingChart id="BTC"  height="300" width="600" data={this.state.BTC} />

        <div className="currency_title">Ethereum</div>
       <Button className="button_left" bsStyle="warning" onClick={() => this.getHourly("ETH")}>Hourly</Button>
        <Button className="button_right" bsStyle="warning" onClick={() => this.get30Days("ETH")}>30 Days</Button>
        <ZingChart id="ETH"  height="300" width="600" data={this.state.ETH} />

        <div className="currency_title">Litecoin</div>
        <Button className="button_left" bsStyle="danger" onClick={() => this.getHourly("LTC")}>Hourly</Button>
        <Button className="button_right" bsStyle="danger" onClick={() => this.get30Days("LTC")}>30 Days</Button>
        <ZingChart id="LTC"  height="300" width="600" data={this.state.LTC} />
      </div>
    );
  }
}

export default App;
