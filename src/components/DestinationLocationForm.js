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
import ContactList from './ContactList'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'destinationStreetAddress',
    'destinationCity',
    'destinationProvince',
    'destinationPostalCode',
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

class DestinationLocationForm extends Component {
  constructor(props) {
    super(props);
    this.setDestinationLocation = this.setDestinationLocation.bind(this);
    // this.gmaps = {lat: 59.95, lng: 30.33, zoom: 11, api_key: 'AIzaSyAkLUTgsp7Bm2FO_o6hJholvCVM6jgtA3w'}.bind(this);
    this.state = {
      center: {lat: 59.95, lng: 30.33},
      zoom: 12,
      maps_api_key: 'AIzaSyBW10pqKiQRHZ3I3v3Uof1WpWextat-P_8',
      selectedIndex: null,
      selectedAddress: null
    };
  }

  componentWillReceiveProps(nextProps) {
    debugger
  }

  setDestinationLocation(event) {
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
        <ContactList/>
        <form>
          <div >
            <Field name="destinationStreetAddress" component={renderTextField} label="Street Address" fullWidth={true} />
          </div>
          <div>
            <Field name="destinationCity" component={renderTextField} label="City" fullWidth={true} />
          </div>
          <div>
            <Field name="destinationProvince" component={renderTextField} label="Province" fullWidth={true} />
          </div>
          <div>
            <Field name="destinationPostalCode" component={renderTextField} label="Postal Code" fullWidth={true} />
          </div>
          <div>
            <Field
              name="destinationCountry"
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
              name="destinationNotes"
              component={renderTextField}
              label="Notes - i.e. buzz 444 to gain access to building"
              multiLine={true}
              rows={2}
              fullWidth={true}
              onClick={this.setDestinationLocation}
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

DestinationLocationForm = reduxForm({
  form: 'DestinationLocationForm', // a unique identifier for this form
  validate,
})(DestinationLocationForm)

const selector = formValueSelector('DestinationLocationForm') // <-- same as form name
DestinationLocationForm = connect(state => {
  const { destinationStreetAddress, destinationCity, destinationProvince, destinationPostalCode } = selector(state, 'destinationStreetAddress', 'destinationCity', 'destinationProvince', 'destinationPostalCode')
  return {
    fullAddress: `${destinationStreetAddress || ''}+${destinationCity || ''}+${destinationProvince || ''}+${destinationPostalCode || ''}`
  }
})(DestinationLocationForm)

export default DestinationLocationForm;