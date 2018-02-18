import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import TextField from 'material-ui/TextField'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import GoogleMapReact from 'google-map-react'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'pickupStreetAddress',
    'pickupCity',
    'pickupProvince',
    'pickupPostalCode',
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
    // this.gmaps = {lat: 59.95, lng: 30.33, zoom: 11, api_key: 'AIzaSyAkLUTgsp7Bm2FO_o6hJholvCVM6jgtA3w'}.bind(this);
    this.state = {center: {lat: 59.95, lng: 30.33}, zoom: 12, maps_api_key: 'AIzaSyBW10pqKiQRHZ3I3v3Uof1WpWextat-P_8'};
  }

  setPickupLocation(event) {
    let base_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    let pickup_address = this.props.fullAddress;
    let api_key = '&key=AIzaSyAkLUTgsp7Bm2FO_o6hJholvCVM6jgtA3w';
    var fetch_url = base_url + pickup_address + api_key

    fetch(fetch_url)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          center: result.results[0].geometry.location
        })
      })
  }

  render() {
    return (
      <div>
        <form>
          <div >
            <Field name="pickupStreetAddress" component={renderTextField} label="Street Address" fullWidth={true} />
          </div>
          <div>
            <Field name="pickupCity" component={renderTextField} label="City" fullWidth={true} />
          </div>
          <div>
            <Field name="pickupProvince" component={renderTextField} label="Province" fullWidth={true} />
          </div>
          <div>
            <Field name="pickupPostalCode" component={renderTextField} label="Postal Code" fullWidth={true} />
          </div>
          <div>
            <Field
              name="pickupCountry"
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
              name="pickupNotes"
              component={renderTextField}
              label="Notes - i.e. buzz 444 to gain access to building"
              multiLine={true}
              rows={2}
              fullWidth={true}
              onClick={this.setPickupLocation}
            />
          </div>
          <div style={{height:'200px', width:'100%',overflow:'hidden'}}>
            <GoogleMapReact
              bootstrapURLKeys={{key: this.state.maps_api_key}}
              center={this.state.center}
              defaultZoom={this.state.zoom}
              style={{height:'200px',position:'relative'}}
            />
          </div>
        </form>
      </div>
    )
  }
}

PickupLocationForm = reduxForm({
  form: 'PickupLocationForm', // a unique identifier for this form
  validate,
})(PickupLocationForm)

const selector = formValueSelector('PickupLocationForm') // <-- same as form name
PickupLocationForm = connect(state => {
  const { pickupStreetAddress, pickupCity, pickupProvince, pickupPostalCode } = selector(state, 'pickupStreetAddress', 'pickupCity', 'pickupProvince', 'pickupPostalCode')
  return {
    fullAddress: `${pickupStreetAddress || ''}+${pickupCity || ''}+${pickupProvince || ''}+${pickupPostalCode || ''}`
  }
})(PickupLocationForm)

export default PickupLocationForm;