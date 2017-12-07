import auth from './auth';
import bill from './bill';
import billStatus from './billStatus';
import menuItem from './menuItem';

export default {
  ...auth,
  ...bill,
  ...billStatus,
  ...menuItem,
};
