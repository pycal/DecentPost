import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DestinationLocationForm from './DestinationLocationForm';
import PickupLocationForm from './PickupLocationForm';
import ContractOfferForm from './ContractOfferForm';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import {blue500} from 'material-ui/styles/colors';


/**
 * Horizontal steppers are ideal when the contents of one step depend on an earlier step.
 * Avoid using long step names in horizontal steppers.
 *
 * Linear steppers require users to complete one step in order to move on to the next.
 */
class MultiStepSendForm extends React.Component {
  state = {
    finished: false,
    stepIndex: 0,
  };

  handleNext = () => {
    window.scrollTo(0,0);
    const {stepIndex} = this.state;
    const finished = stepIndex >= 2;

    let formData = Object.assign({}, this.state.formData, this.props.form);

    this.setState({
      formData: formData
    })

    if (finished) {

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

        // const newPackage = {
        //   bounty: this.state.formData.ContractOfferForm.values.bounty,
        //   deliver
        //   insurance: this.state.formData.ContractOfferForm.values.bond,
        //   receiver: window.chosenAddress.selectedAddress,
        //   metadata: '123'
        // }

        // uint256 _bounty,  uint256 _deliverBy, uint256 _insurance, address _receiver, string _metadata


        const ipfsBlob = {
          destination: window.destinationLatLng,
          pickUp: window.pickUpLatLng
        }

        fetch("http://127.0.0.1:8080/ipfs/", {
          body: JSON.stringify(ipfsBlob),
          cache: 'no-cache',
          method: 'POST',
          mode: 'cors'
        })
        .then((response) => {
          const ipfsHash = response.headers.get('Ipfs-Hash');

          let bounty = window.web3.toWei(this.state.formData.ContractOfferForm.values.bounty, 'ether');
          let bond = window.web3.toWei(this.state.formData.ContractOfferForm.values.bond, 'ether');

          var transaction = this.props.contract.createPackage(
            bounty,
            window.deliverBy,
            bond,
            window.chosenAddress.selectedAddress,
            ipfsHash,
            {
              from: account,
              value: bounty
            }
          ).then(() => { debugger });
        });
      })
    }

    this.setState({
      stepIndex: stepIndex + 1,
      finished: finished
    });

  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <PickupLocationForm/>;
      case 1:
        return <DestinationLocationForm/>;
      case 2:
        return <ContractOfferForm/>;
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Pickup</StepLabel>
          </Step>
          <Step>
            <StepLabel>Destination</StepLabel>
          </Step>
          <Step>
            <StepLabel>Offer</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <Paper style={{padding: 20,
            textAlign: 'center'}} zDepth={2}>
              <FontIcon className="material-icons" style={{
                fontSize: 84,
                color: blue500
              }}>beenhere</FontIcon>
              <p>Package Ready for Pick Up</p>
            </Paper>
          ) : (
            <div>
              {this.getStepContent(stepIndex)}
              <div style={{marginTop: 12}}>
                <RaisedButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{marginRight: 12}}
                  secondary={true}
                  fullWidth={true}
                />
                <br/><br/>
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  primary={true}
                  fullWidth={true}
                  onClick={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3.web3Instance,
    contract: state.contract.instance,
    account: state.account,
    form: state.form
  }
}

export default connect(mapStateToProps)(MultiStepSendForm);
