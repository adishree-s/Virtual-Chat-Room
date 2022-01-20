const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required.",
    };
  }

  //Validation

  const existingUser = users.find((user) => {
    return user.username === (username && user.room === room);
  });

  if (existingUser) {
    return {
      error: "Username is taken!",
    };
  }

  const user = {
    id: id,
    username: username,
    room: room,
  };

  users.push(user);

  return { user };
};

//Remove user by id

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return id === user.id;
  });

  if (index != -1) {
    const removedUser = users.splice(index, 1)[0];
    return removedUser;
  }
};

//getUser

const getUser = (id) => {
  const user = users.find((user) => {
    return user.id === id;
  });

  return user;
};

const getUsersInRoom = (room) => {
  room.trim().toLowerCase();
  const roomUsers = users.filter((user) => {
    return user.room === room;
  });

  return roomUsers;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
