import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Map from './Map';

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};


class App extends Component {
  render() {
    return (
      <div className="App">
        <Paper style={style} zDepth={1}>
          <h1>Hello</h1>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    web3Provider: state.web3.web3Provider
  }
}

export default connect(mapStateToProps)(App);
