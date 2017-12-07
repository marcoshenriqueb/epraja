import auth from './auth';
import bill from './bill';
import billStatus from './billStatus';

export default {
  ...auth,
  ...bill,
  ...billStatus,
};
