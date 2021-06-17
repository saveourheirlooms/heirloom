import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Report from "../src/contracts/hei.json"
class Tokens extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.get()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Report.networks[networkId]
    if(networkData){
      const abi = Report.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract})
    } else{
      window.alert("Smart contract not deployed to detect network!")
      }
    }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      buffer: null,
      contract: null,
      reportHash: "QmSYkPPhR5ESaxR4xLfZZefUS2Hogu24uV3WAgpv5xZAdG",
      length: ""
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

    async get(){
    const length = await this.state.contract.methods.totalSupply().call()
    const name = await this.state.contract.methods.name().call()
    const symbol = await this.state.contract.methods.symbol().call()
    this.setState({length})
    var i;
    for (i = 1; i <= length; i++) {
      const nft = await this.state.contract.methods.tokenURI(i).call()
      const response = await fetch(nft);

      if(!response.ok)
      throw new Error(response.statusText);

      const json = await response.json();
      console.log(json)

      var deneme = []
      deneme.push(json)
      const x = document.querySelector(".row")
      Object.values(deneme).map(item =>{
      const imageurl = "https://ipfs.io/ipfs/" + item.image.substring(7)

      x.innerHTML += `
        <div class="col-md-4">
          <div class="card" style="width: 18rem;">
            <img class="card-img-top" height="250" width="250"src="${imageurl}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <button href="#" id="btn" class="btn btn-primary">Buy</button>
              <div class="float-right" style="line-height: 40px;">
                $10
              </div>
            </div>
            </div>
        </div>

          `
      })
    }
  }

  /*async buy(tokenID){
     await this.state.contract.methods.transferFrom("0x14Aa020C4bB7521C2e908e79BB2E49cBb2675551", metadata, metadata).send({from: "0x14Aa020C4bB7521C2e908e79BB2E49cBb2675551"}).on("confirmation",(r) =>{
        console.log("success")
    })
  }*/

  render() {

    return (
      <div class="container">
      <div class="mx-auto" style={{width: "1080px"}}>
         <h1 class="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7">NFTs</h1>
         <div class="row"></div>
      </div>
       </div>
    );
  }
}

export default Tokens;