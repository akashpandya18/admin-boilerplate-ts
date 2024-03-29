import validator from 'validator';
import { DeadDomainEmail } from '@/lib/utils';

interface Data {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gym_id: number;
  status: number;
  gym: {
    id: string;
    name: string;
    domain_name: string;
  };
}

interface Errors {
  first_name: string;
  email: string;
  selectedMenu: string;
}

function AdminAddEditValidation(data: Data, selectedMenu: { value: number }) {
  const errors: Errors = {
    first_name: '',
    email: '',
    selectedMenu: '',
  };
  const isDeadDomain = DeadDomainEmail(data.email);
  if (validator.isEmpty(data.first_name.trim()))
    errors.first_name = 'Please enter name.';

  if (validator.isEmpty(data.email.trim()))
    errors.email = 'Please enter email address.';
  else if (!validator.isEmail(data.email))
    errors.email = 'Please enter valid email address.';
  else if (isDeadDomain)
    errors.email = 'A disposable email address is not allowed.';
  if (!selectedMenu?.value?.toString()) {
    errors.selectedMenu = 'Please select user type.';
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AdminAddEditValidation;
