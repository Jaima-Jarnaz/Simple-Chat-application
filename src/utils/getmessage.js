const getMessage = (text, username) => {
  return {
    text,
    username,
    createdAt: new Date().getTime(),
  };
};

const getLocation = (url) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  getMessage: getMessage,
  getLocation: getLocation,
};
