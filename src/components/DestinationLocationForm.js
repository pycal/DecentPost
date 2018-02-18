import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import ContactList from './ContactList'

const setDestinationLocation = () => {
  alert('TODO: hit up google maps for destination lat / long')
}

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

const DestinationLocationForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <ContactList />
      </div>
      <div>
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
      <div>
        <RaisedButton label='Set Destination Location' onClick={setDestinationLocation} />
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'DestinationLocationForm', // a unique identifier for this form
  validate,
})(DestinationLocationForm)