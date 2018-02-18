import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'bounty',
    'bond',
    'deliverBy',
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <Field name="bounty" component={renderTextField} label="Bounty" fullWidth={true} />
        </div>
        <div>
          <Field name="bond" component={renderTextField} label="Bond" fullWidth={true} />
        </div>
        <div>
          <Field name="deliverBy" component={renderTextField} label="Deliver By" fullWidth={true} />
        </div>
      </form>
      <RaisedButton label="Make Package" fullWidth={true} onClick={this.handleSubmit} />
    </div>
  )
}

export default reduxForm({
  form: 'DestinationLocationForm', // a unique identifier for this form
  validate,
})(DestinationLocationForm)