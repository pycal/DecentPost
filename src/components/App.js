import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Home from './Home';
import DecentPostNav from './DecentPostNav'
import {push} from "react-router-redux";
import contractABI from 'contracts/DecentPost.json';
import contract from 'truffle-contract';

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class App extends Component {
  async getContractState(decentPostContract) {
    const instance = await decentPostContract.deployed();
    this.props.dispatchContract(instance)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.web3Provider) {
      let decentPostContract = contract(contractABI);
      decentPostContract.setProvider(nextProps.web3Provider);
      this.getContractState(decentPostContract);
    }
  }

  render() {
    return (
      <div className="App">
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
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
