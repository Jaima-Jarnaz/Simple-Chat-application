const users = [
  // {
  //   id: 30,
  //   username: "mustakim",
  //   room: "mim",
  // },
  // {
  //   id: 31,
  //   username: "tanjina",
  //   room: "mim",
  // },
];
const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: "Username or room is required" };
  }

  // //check for the user and validate
  // const existingUser = users.find((user) => {
  //   if (user.username === username && user.room === room) {
  //     let error = "Sorry UserName is already taken";
  //     return { error: error };
  //   }
  // });

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  const user = {
    id: id,
    username: username,
    room: room,
  };
  users.push(user);
  console.log("newly added user", user);
  console.log("all users with newly added user", users);
  return { user: user };
};

/////````````````````removing user```````````````````````````````

const removeUser = (id) => {
  // const index = users.findIndex((id) => users.id === id);
  // //when  username exist with the same id
  // if (index !== -1) {
  //   console.log(index);
  //   return users.splice(index, 1)[0];
  // }

  const removeuser = users.filter((removeData) => removeData.id === id);
  console.log("removed user", removeuser[0]);
  return removeuser[0];
};

//````````````get user``````````````````````
const getUser = (id) => {
  return users.find((id) => users.id === id);
};

///``````````get all user data In Room````````````````````

const getAllUserDataInRoom = (room) => {
  room = room.trim().toLowerCase();
  const usersData = users.filter((user) => user.room === room);
  console.log("all users in a room USER", usersData);
  return usersData;

  // room = room.trim().toLowerCase();
  // return users.filter((user) => user.room === room);
};

// addUser({
//   id: 32,
//   username: "jarnaz",
//   room: "mim",
// });
// removeUser(31);
// getAllUserDataInRoom("mim");
// getUser(30);

// console.log(users);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getAllUserDataInRoom,
};
