import React, { Component } from 'react';
import { connect } from 'react-redux';

class Deliver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newPackages: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contract) {
      nextProps.contract.NewPackage({fromBlock: 0, toBlock: 'latest'}).watch((error, result) => {
        if (!error) {
          const newPackage = parseInt(result.args._packageId);
          console.log("NEWPACKAGE", newPackage);
          this.setState({
            newPackages: this.state.newPackages.concat(newPackage)
          })
        }
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.newPackages.forEach((packageId) => {
          <p>(packageId)</p>
        })}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3.web3Instance,
    contract: state.contract.instance
  }
}

export default connect(mapStateToProps)(Deliver);
