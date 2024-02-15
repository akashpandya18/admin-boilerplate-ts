import validator from 'validator';

interface Data {
  title: string;
  message: string;
  sentToUser: number;
}
interface SelectedEmailList {
  [x: string]: number;
}
interface Errors {
  title?: string;
  message?: string;
  email_ids?: string;
}

function AddPushNotificationVali(
  data: Data,
  selectedEmailList: SelectedEmailList
) {
  const errors: Errors = {};

  if (validator.isEmpty(data.title.trim()))
    errors.title = 'Please enter the title.';
  if (validator.isEmpty(data.message.trim()))
    errors.message = 'Please enter the message.';

  if (data?.sentToUser === 4) {
    if (selectedEmailList?.length === 0)
      errors.email_ids = 'Please select email address.';
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddPushNotificationVali;
