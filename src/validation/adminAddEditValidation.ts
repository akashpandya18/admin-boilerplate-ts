import validator from 'validator';
import { DeadDomainEmail } from '@/lib/utils';

interface Data {
  name: string;
  email: string;
}

interface SelectedMenu {
  value: number;
}

interface Errors {
  name?: string;
  email?: string;
  selectedMenu?: string;
}

function AdminAddEditValidation(data: Data, selectedMenu: SelectedMenu) {
  const errors: Errors = {};
  const isDeadDomain = DeadDomainEmail(data.email);
  if (validator.isEmpty(data.name.trim())) errors.name = 'Please enter name.';

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
