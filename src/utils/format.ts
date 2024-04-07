import dayjs from "@/plugins/dayjs";

const shifts = {
  req(data: Record<string, any>) {
    const entries = Object.entries(data)
      .map(([key, val]) => {
        switch (key) {
          case "id":
            return null;
          case "to":
          case "from":
            return [key, val.dateTime()];
          default:
            return [key, val];
        }
      })
      .filter((v) => v) as [string, any][];

    const requestObject = Object.fromEntries(entries);

    return JSON.stringify(requestObject);
  },
  res(data: Record<string, any>) {
    return data.map((val: Record<string, any>) => ({
      ...val,
      from: dayjs(val.from),
      to: dayjs(val.to),
    }));
  },
};

const users = {
  req(data: Record<string, any>) {
    const entries = Object.entries(data)
      .map(([key, val]) => {
        switch (key) {
          case "id":
            return null;
          default:
            return [key, val];
        }
      })
      .filter((v) => v) as [string, any][];

    const requestObject = Object.fromEntries(entries);

    return JSON.stringify(requestObject);
  },
};

const settings = {
  req(data: Record<string, any>) {
    const entries = Object.entries(data)
      .map(([key, val]) => {
        switch (key) {
          case "id":
            return null;
          default:
            return [key, val];
        }
      })
      .filter((v) => v) as [string, any][];

    const requestObject = Object.fromEntries(entries);

    return JSON.stringify(requestObject);
  },
};

export default { shifts, users, settings };
