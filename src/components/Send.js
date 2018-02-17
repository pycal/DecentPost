import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import MultiStepSendForm from './MultiStepSendForm';
import PickupLocationForm from './PickupLocationForm';

const CreatePackageForm = () => (
  <form>
    <TextField
      hintText="Address"
    /><br />
  </form>
);

class Send extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.web3.eth.getAccounts((err, accounts) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accounts.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      var account = accounts[0];

      const bounty = "1000000000000000000";
      const deliverByEpoch = 1519711436;
      const insurance = 10000;
      const receiver = "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"
      const metadata = "abc"

      var transaction = this.props.contract.createPackage(
        bounty,
        deliverByEpoch,
        insurance,
        receiver,
        metadata,
        {
          from: account,
          value: bounty
        }
      ).then((data) => { alert('package made') });
    })
  }

  render() {
    const loading = (
      <div>
        <CircularProgress size={180} thickness={15} />
      </div>
    )

    let body = null;
    if(this.props.contract) {
      body = (
        <div>
          <MultiStepSendForm/>
        </div>

      )
    } else {
      body = (
        <div>
          <CircularProgress size={180} thickness={15} />
        </div>
      )
    }

    return (
      <div>
        { body }
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

export default connect(mapStateToProps)(Send);
