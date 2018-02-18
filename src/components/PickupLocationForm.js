import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import TextField from 'material-ui/TextField'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'streetAddress',
    'city',
    'province',
    'postalCode',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })
  // TODO: form validation here
  return errors
}

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

const renderCheckbox = ({ input, label }) => (
  <Checkbox
    label={label}
    checked={input.value ? true : false}
    onCheck={input.onChange}
  />
)

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioButtonGroup
    {...input}
    {...rest}
    valueSelected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
)

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
)



class PickupLocationForm extends Component {
  constructor(props) {
    super(props);
    this.setPickupLocation = this.setPickupLocation.bind(this);
  }
  setPickupLocation(event) {
    let base_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    let pickup_address = this.props.fullAddress;
    let api_key = '&key=AIzaSyAkLUTgsp7Bm2FO_o6hJholvCVM6jgtA3w';
    var fetch_url = base_url + pickup_address + api_key

    alert(fetch_url)
    fetch(fetch_url)
      .then(res => res.json())
      .then((result) => {
        alert(JSON.stringify(result.results[0].geometry.location))
      })
  }


  render() {
    return (
      <form>
        <div >
          <Field name="streetAddress" component={renderTextField} label="Street Address" fullWidth={true} />
        </div>
        <div>
          <Field name="city" component={renderTextField} label="City" fullWidth={true} />
        </div>
        <div>
          <Field name="province" component={renderTextField} label="Province" fullWidth={true} />
        </div>
        <div>
          <Field name="postalCode" component={renderTextField} label="Postal Code" fullWidth={true} />
        </div>
        <div>
          <Field
            name="country"
            component={renderSelectField}
            label="Country"
            fullWidth={true}
          >
            <MenuItem value="canada" primaryText="Canada" />
            <MenuItem value="usa" primaryText="United States of America" />
          </Field>
        </div>

        <div>
          <Field
            name="notes"
            component={renderTextField}
            label="Notes - i.e. buzz 444 to gain access to building"
            multiLine={true}
            rows={2}
            fullWidth={true}
          />
        </div>
        <div id="map"></div>
        <div>
          <RaisedButton label='Set Pickup Location' onClick={this.setPickupLocation} />
        </div>
      </form>
    )
  }
}

PickupLocationForm = reduxForm({
  form: 'PickupLocationForm', // a unique identifier for this form
  validate,
})(PickupLocationForm)

const selector = formValueSelector('PickupLocationForm') // <-- same as form name
PickupLocationForm = connect(state => {
  // 1600+Amphitheatre+Parkway,+Mountain+View,+CA
  const { streetAddress, city, province, postalCode } = selector(state, 'streetAddress', 'city', 'province', 'postalCode')
  return {
    fullAddress: `${streetAddress || ''}+${city || ''}+${province || ''}+${postalCode || ''}`
  }
})(PickupLocationForm)

export default PickupLocationForm;