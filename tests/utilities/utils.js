module.exports = {
  getRandomString() {
    return Math.random().toString(36).slice(4);
  },
  getRandomNumber() {
    return (Math.floor(Math.random() * 9999) + 1)-1
  },
};
