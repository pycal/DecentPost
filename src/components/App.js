import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Home from './Home';
import DecentPostNav from './DecentPostNav'
import {push} from "react-router-redux";
import contractABI from 'contracts/DecentPost.json';
import contract from 'truffle-contract';
import FontIcon from 'material-ui/FontIcon';
import Blockies from 'ethereum-blockies';
import Avatar from 'material-ui/Avatar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  async getContractState(decentPostContract) {
    const instance = await decentPostContract.deployed();
    this.props.dispatchContract(instance);
    this.getAccount(this.props.web3);
  }

  getAccount(web3) {
    web3.eth.getAccounts((err, accounts) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accounts.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      var account = accounts[0];

      console.log("LOL")
      window.account = account;
      this.setState({
        account: account
      })
      this.props.dispatchAccount({account});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.web3Provider) {
      let decentPostContract = contract(contractABI);
      decentPostContract.setProvider(nextProps.web3Provider);
      this.getContractState(decentPostContract);
    }
  }

  createAvatar(seed) {
    return Blockies.create({
      seed: seed,
      color: '#dfe',
      bgcolor: '#aaa',
      size: 10,
      scale: 2
    });
  }

  render() {
    let accountAvatar = null;

    if (window.account) {
      const icon = this.createAvatar(window.account);
      accountAvatar = (<Avatar size={30} style={{marginTop: '10px'}} src={icon.toDataURL()} />)
    }

    return (
      <div className="App">
        <AppBar
          title="DecentPost"
          // iconClassNameRight="muidocs-icon-navigation-expand-more"
          iconElementRight={accountAvatar}
        />
        {this.props.children || <Home/>}
        <DecentPostNav />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    web3Provider: state.web3.web3Provider,
    web3: state.web3.web3Instance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchContract: (contract) => dispatch({
      type: 'CONTRACT_LOADED',
      payload: {
        contract
      }
    }),
    dispatchAccount: (account) => dispatch({
      type: 'ACCOUNT_LOADED',
      payload: {
        account
      }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
