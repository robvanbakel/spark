import dayjs from '@/plugins/dayjs';

const shifts = {
  req(data) {
    const entries = Object.entries(data).map(([key, val]) => {
      switch (key) {
        case 'id':
          return null;
        case 'to':
        case 'from':
          return [key, val.dateTime()];
        default:
          return [key, val];
      }
    }).filter((v) => v);

    const requestObject = Object.fromEntries(entries);

    return JSON.stringify(requestObject);
  },
  res(data) {
    return data.map((val) => ({
      ...val,
      from: dayjs(val.from),
      to: dayjs(val.to),
    }));
  },
};

const users = {
  req(data) {
    const entries = Object.entries(data).map(([key, val]) => {
      switch (key) {
        case 'id':
          return null;
        default:
          return [key, val];
      }
    }).filter((v) => v);

    const requestObject = Object.fromEntries(entries);

    return JSON.stringify(requestObject);
  },
};

export default { shifts, users };
