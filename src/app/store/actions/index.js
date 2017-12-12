import auth from './auth';
import bill from './bill';
import billStatus from './billStatus';
import menuItem from './menuItem';
import menuItemStatus from './menuItemStatus';
import menuCategory from './menuCategory';
import survey from './survey';
import surveyRate from './surveyRate';

export default {
  ...auth,
  ...bill,
  ...billStatus,
  ...menuItem,
  ...menuItemStatus,
  ...menuCategory,
  ...survey,
  ...surveyRate,
};
