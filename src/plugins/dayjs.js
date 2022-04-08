import dayjs from 'dayjs';

import localizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

const weekId = (option, dayjsClass) => {
  const proto = dayjsClass.prototype;
  proto.weekId = function () {
    return this.format('GGGG-WW');
  };
};

dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(weekId);

export default dayjs;
