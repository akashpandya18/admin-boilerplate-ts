import validator from 'validator';

interface Data {
  name: string;
  domain_name: string;
  default_workout_count: number;
}

interface Errors {
  name?: string;
  domain_name?: string;
  default_workout_count?: string;
}

function AdminGymAddEditValidation(data: Data) {
  const errors: Errors = {};

  if (validator.isEmpty(data.name.trim())) errors.name = 'Please enter name.';

  if (validator.isEmpty(data.domain_name.trim()))
    errors.domain_name = 'Please enter domain name.';

  if (!data.default_workout_count)
    errors.default_workout_count = 'Please enter workout count.';

  // if (!selectedMenu?.value) {
  //   errors.selectedMenu = 'Please select font.';
  // }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AdminGymAddEditValidation;
