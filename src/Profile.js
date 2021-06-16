import React, { Component } from 'react';
import Web3 from "web3";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Report from "../src/contracts/hei.json"
class CreateProject extends Component {

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
    this.setState({length})
    var i;
    for (i = 1; i <= length; i++) {
      const owneracc= await this.state.contract.methods.ownerOf(i).call()
      if(owneracc== this.state.account){
        const nft = await this.state.contract.methods.tokenURI(i).call()
        const response = await fetch(nft);

      if(!response.ok)
      throw new Error(response.statusText);

      const json = await response.json();
      console.log(json)
      var deneme = []
      deneme.push(json)
      const x = document.querySelector(".tokens")
      Object.values(deneme).map(item =>{
      const imageurl = "https://ipfs.io/ipfs/" + item.image.substring(7)
      x.innerHTML += `
        <div class="col-md-4">
                    <div class="card" style="width: 18rem;">
                      <img class="card-img-top" height="250" width="250" src="${imageurl}" alt="Card image cap">
                      <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                      </div>
                    </div>
                  </div>


          `
      })
      }
    }
  }

  render() {

    return (
      <div className="container">
  <div className="row gutters">
    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12" style={{height: '400px'}}>
      <div className="card h-100">
        <div className="card-body">
          <div className="account-settings">
            <div className="user-profile">
              <div className="user-avatar">
                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Maxwell Admin" width={200} height={200} />
              </div>
              <h5 className="user-name">John Smith</h5>
              <h6 className="user-email">john@smith.com</h6>
            </div>
            <div className="about">
              <h5>Badges</h5>
              <span className="badge badge-primary">Tree Lover</span>
              <span className="badge badge-primary">Tree Lover</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12" style={{height: '400px'}}>
      <div className="card h-100">
        <div className="card-body">
          <div className="row gutters">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <h6 className="mb-2 text-primary">Personal Details</h6>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" className="form-control" id="fullName" placeholder="Enter full name" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="eMail">Email</label>
                <input type="email" className="form-control" id="eMail" placeholder="Enter email ID" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="text" className="form-control" id="phone" placeholder="Enter phone number" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="website">Address</label>
                <input type="url" className="form-control" id="website" value={this.state.account} readOnly />
              </div>
            </div>
          </div>
          <div className="row gutters">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <h6 className="mt-3 mb-2 text-primary" />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="Street">Image</label>
                <input type="name" className="form-control" id="Street" placeholder="Enter Image URL" />
              </div>
            </div>
          </div>
          <div className="row gutters">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="text-right">
                <button type="button" id="submit" name="submit" className="btn btn-secondary">Cancel</button>
                <button type="button" id="submit" name="submit" className="btn btn-primary">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-xl-12 col-lg-3 col-md-12 col-sm-12 col-12 mt-4 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <div className="account-settings">
            <div className="user-profile">
              <h5 className="user-name">Tokens</h5>
            </div>
            <div className="tokens row">
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

export default CreateProject;