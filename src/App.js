import React, { Component } from 'react'
import Web3 from "web3"
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import Report from "../src/contracts/hei.json"
import { NFTStorage, File } from 'nft.storage'
import Nav from './Nav'
import Profile from './Profile'
import ProjectPage from './ProjectPage'
import Mint from './Mint'
import Nfts from './Nfts'
import Projects from './Projects'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import logo from './bg.png';
const fs = require('fs');

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhFMjEwNmYzNDRGOThiNzZGYTVhNThkOWIzNmIyZDdFYjk1QzE5MTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMzc3MDc0NDAxNSwibmFtZSI6InNvaCJ9.yYbQfQxlnAlITfuAtbP-CQo2GMFAeBlIOTUe5pOHm4c'
const client = new NFTStorage({ token: apiKey })

class App extends Component {
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
      length:0
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
      <Router>
        <div class="container">
        <Nav/>
        <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/projectpage" component={ProjectPage} />
        <Route path="/nfts" component={Nfts} />
        <Route path="/mint" component={Mint} />
        <Route path="/projects" component={Projects} />
        </Switch>
        </div>
      </Router>
    );
  }
}
const Home = () => (
    <div class="container">
  <div class="mx-auto" style={{width: "1080px"}}>
    <div class="slider clearfix" style={{marginTop: "100px"}}>
      <h1 class="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7"><span class="">Save </span><span class="">Our <span class=""  style={{fontFamily: '"Sansita Swashed", cursive'}}>Heirlooms </span> </span><br /></h1>
      <h2 class="font-weight-light mt-5">Discover the most meaningful NFTs.<br /> Support our cultural heritage.</h2>
      <div type="button" class="btn btn-outline-primary mt-5">
        <h5 class="font-weight-light">Explore Projects</h5>
      </div>
      <div class="photo" style={{float: "right", marginTop: "-280px"}}>
        <img src={logo} alt="" />
      </div>
    </div>
    <div class="supporters">
      <h1 class="font-weight-light mt-5 text-center mb-4">Trusted By</h1>
      <div class="row">
        <div class="col-sm bg-light m-2" style={{height: "180px"}}>

        </div>
        <div class="col-sm bg-light m-2">

        </div>
        <div class="col-sm bg-light m-2">

        </div>
      </div>
    </div>
    <footer>
      <div class="text-center p-4">
        © 2021
        <a class="text-reset fw-bold" href="https:///">
        </a>
      </div>
    </footer>
  </div>
</div>

  );



export default App;