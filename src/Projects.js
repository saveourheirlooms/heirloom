import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Report from "../src/contracts/hei.json"
import logo from './bg.png';
class Projects extends Component {

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
      const contractAddress = this.state.contract._address
      this.setState({contractAddress})
    }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      buffer: null,
      contract: null,
      reportHash: "QmSYkPPhR5ESaxR4xLfZZefUS2Hogu24uV3WAgpv5xZAdG",
      length: "",
      contractAddress: ""
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

  

  render() {

   return (

      <div className="container">
        <div className="mx-auto" style={{width: '1080px'}}>
          <div className="content" >
            <h1 className="mb-sm-4 display-4 fw-light lh-sm fs-4 fs-lg-6 fs-xxl-7" style={{fontSize: '40px'}} >Projects </h1>
            <div className="col">
              <div className="row bg-light p-4 mb-3 rounded" style={{height: '200px'}}>
                <h2 className="font-weight-light">Tree Foundation</h2>
                <div className="progress" style={{width: '300px', marginTop: '12px', marginLeft: '50px'}}>
                  <div className="progress-bar" role="progressbar" style={{width: '40%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
                </div>
                <div className="progress-text">
                  <span className="font-italic" style={{lineHeight: '40px', marginLeft: '50px'}}>Remaining 1000 ₺</span>
                </div>
                <h5 className="font-weight-light" style={{width: '850px', marginTop: '-20px'}}> Lorem ipsum dolo re si amet Lorem ipsum dolo re si amet Lorem ipsum dolo re si amet</h5>
                <h5 className="font-weight-light" style={{width: '850px', fontSize: "15px"}}>Contract Address: {this.state.contractAddress}</h5>
                <div className="photo-project position-absolute" style={{right: '20px'}}>
                  <img src={logo} alt="" style={{marginRight: '20px'}} height={170} width={170} />
                  <div type="button" className="btn btn-outline-primary" style={{height: '45px', left: 0}}>
                    <h5 className="font-weight-light">-&gt;</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;