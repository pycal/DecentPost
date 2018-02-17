import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import asyncValidate from './asyncValidate'

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
        <Field name="streetAddress" component={renderTextField} label="Street Address" />
      </div>
      <div>
        <Field name="city" component={renderTextField} label="City" />
      </div>
      <div>
        <Field name="province" component={renderTextField} label="Province" />
      </div>
      <div>
        <Field name="postalCode" component={renderTextField} label="Postal Code" />
      </div>
      <div>
        <Field
          name="country"
          component={renderSelectField}
          label="Country"
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
        />
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>
          Submit
        </button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'DestinationLocationForm', // a unique identifier for this form
  validate,
  asyncValidate
})(DestinationLocationForm)