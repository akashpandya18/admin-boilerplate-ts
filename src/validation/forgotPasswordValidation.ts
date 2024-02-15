import validator from 'validator';

interface Data {
  email: string;
}

interface Errors {
  email?: string;
}

function forgotPassValidation(data: Data) {
  const errors: Errors = {};

  if (validator.isEmpty(data.email.trim()))
    errors.email = 'Please enter the registered email address.';
  else if (!validator.isEmail(data.email))
    errors.email = 'Please enter valid email address.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default forgotPassValidation;
