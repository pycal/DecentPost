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
import PackageDimensionsForm from './PackageDimensionsForm';
import ContractOfferForm from './ContractOfferForm';

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
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
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
        return <PackageDimensionsForm/>;
      case 3:
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
            <StepLabel>Set pickup location</StepLabel>
          </Step>
          <Step>
            <StepLabel>Set delivery location</StepLabel>
          </Step>
          <Step>
            <StepLabel>Describe your package</StepLabel>
          </Step>
          <Step>
            <StepLabel>Set bounty and bond</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              Woot!
            </p>
          ) : (
            <div>
              {this.getStepContent(stepIndex)}
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 3 ? 'Finish' : 'Next'}
                  primary={true}
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

export default MultiStepSendForm;