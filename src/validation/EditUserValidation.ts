import validator from 'validator';

interface Data {
  name: string;
  email: string;
  dob: string;
}

interface Errors {
  name?: string;
  email?: string;
  dob?: string;
}

function AddUserValidation(data: Data) {
  const errors: Errors = {};
  if (validator.isEmpty(data.name.trim()))
    errors.name = 'Please enter the name.';
  if (validator.isEmpty(data.email.trim()))
    errors.email = 'Please enter the registered email address.';
  else if (!validator.isEmail(data.email))
    errors.email = 'Please enter valid email address.';
  if (validator.isEmpty(data.dob.trim()))
    errors.dob = 'Please enter the date of birth.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddUserValidation;
