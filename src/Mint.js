import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Report from "../src/contracts/hei.json"
import { NFTStorage, File } from 'nft.storage'

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhFMjEwNmYzNDRGOThiNzZGYTVhNThkOWIzNmIyZDdFYjk1QzE5MTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMzc3MDc0NDAxNSwibmFtZSI6InNvaCJ9.yYbQfQxlnAlITfuAtbP-CQo2GMFAeBlIOTUe5pOHm4c'
const client = new NFTStorage({ token: apiKey })

class Mint extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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


  captureFile = (event) => {
    event.preventDefault()
    console.log("file captured.")
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer.from(reader.result)})
    }
  }

  async nftStorage(name, description){
    const metadata = await client.store({
      name: name,
      description: description,
      image: new File([this.state.buffer], 'pinpie.jpg', { type: 'image/jpg' })
    })
    const url = "https://ipfs.io/ipfs/" + metadata.url.substring(7)
    return url
    // ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
    }

  async loadToBlockchain(metadata){
    await this.state.contract.methods.mintItem(this.state.account, metadata, metadata).send({from: this.state.account}).on("confirmation",(r) =>{
        console.log("success")
    })
  }

  async onSubmit() {
    const reportName = document.querySelector(".input-fileName").value
    const reportType = document.querySelector(".input-fileDesc").value
    const metadata = await this.nftStorage(reportName,reportType)
    await this.loadToBlockchain(metadata)
  }  

  render() {

    return (
      <div class="container">
  <div class="mx-auto" style={{width: "1080px"}}>
    <div class="content">
      <h1 class="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7">Mint NFT</h1>
      <form onSubmit={e => {
    e.preventDefault();
    this.onSubmit();
  }}>
        <div class="form-group" style={{width: "420px"}}>
          <label for="exampleInputEmail1">Address</label>
          <input class="form-control" aria-describedby="addressHelp" value={this.state.account} readOnly/>
          <small id="addressHelp" class="form-text text-muted">If you need, change your address from metamask</small>
        </div>
        <div class="form-group" style={{width: "420px"}}>
          <label for="exampleInputName">NFT Name</label>
          <input class="form-control input-fileName" id="exampleInputName" aria-describedby="projectName" />
          <small id="projectName" class="form-text text-muted">General Name for your project</small>
        </div>
        <div class="form-group" style={{width: "420px"}}>
          <label for="exampleInputName">NFT Description</label>
          <input class="form-control input-fileDesc" id="exampleInputName" aria-describedby="projectName" />
          <small id="projectName" class="form-text text-muted">General Name for your project</small>
        </div>
        <div class="form-group" style={{width: "420px"}}>
          <label for="">NFT Image</label>
          <input type="file" class="form-control" onChange={this.captureFile} aria-describedby="projectName" />
          <small id="projectName" class="form-text text-muted">General Name for your project</small>
        </div>
        <input type="submit" class="d-inline-block btn btn-primary" value="Mint"/>
      </form>
    </div>
  </div>
</div>
    );
  }
}

export default Mint;