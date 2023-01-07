const randomId = (length: number) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

  let string = "";

  for (let i = 0; i < length; i += 1) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }

  return string;
};

export default {
  randomId,
};
