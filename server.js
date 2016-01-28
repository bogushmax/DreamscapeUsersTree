//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var fs   = require('fs');

var async    = require('async');
var socketio = require('socket.io');
var express  = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io     = socketio.listen(server);

//
// users.json validator
//
var usersTypes = {
  DIRECTOR:        "Director",
  DEPUTY_DIRECTOR: "DeputyDirector",
  CONTRACTOR:      "Contractor",
  COURIER:         "Courier"
};

var usersConstraints = {
  DIRECTOR:        1,
  DEPUTY_DIRECTOR: 3,
  CONTRACTOR:      4,
  COURIER:         Infinity
};

var traverse = (json, accessor, traverser) => {
  var childs = accessor(json);
  if (childs && childs.length > 0) {
    childs.forEach((child) => {
      traverse(child, accessor, traverser);
    });
  }
  traverser(json);
}

var validate = (users) => {
  var usersCounts = {
    DIRECTOR:        0,
    DEPUTY_DIRECTOR: 0,
    CONTRACTOR:      0,
    COURIER:         0
  };
  traverse(users, (user) => user.subordinates, (user) => {
    switch (user.type) {
      case usersTypes.DIRECTOR:
          usersCounts.DIRECTOR++;
        break;
      case usersTypes.DEPUTY_DIRECTOR:
          usersCounts.DEPUTY_DIRECTOR++;
        break;
      case usersTypes.CONTRACTOR:
          usersCounts.CONTRACTOR++;
        break;
      case usersTypes.COURIER:
          usersCounts.COURIER++;
        break;
    }
  });
  console.log(usersCounts);
  return (usersCounts.DIRECTOR   <= usersConstraints.DIRECTOR   && usersCounts.DEPUTY_DIRECTOR <= usersConstraints.DEPUTY_DIRECTOR &&
          usersCounts.CONTRACTOR <= usersConstraints.CONTRACTOR && usersCounts.COURIER         <= usersConstraints.COURIER);
}

//
// Define users globally
//
var users;

//
// Networking
//
var startNetworking = () => {
  router.use(express.static(path.resolve(__dirname, 'publish')));

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      // ...
    });
    
    socket.on('getUsers', () => {
      socket.emit('updateUsers', users);
    });
    
    socket.on('changeUsers', (newUsers) => {
      if (validate(newUsers)) {
        users = newUsers;
        socket.broadcast.emit('updateUsers', users);
      }
    });
  });
};

//
// Persistence implementation
//
fs.readFile('./users.json', 'utf8', (error, usersRaw) => {
  if (error) throw error;
  var newUsers = JSON.parse(usersRaw);
  if (validate(newUsers)) {
    users = newUsers;
    startNetworking();
  } else {
    throw new Error('Invalid users.json');
  }
});

setInterval(() => {
  fs.writeFile('./users.json', JSON.stringify(users), (error) => {
    if (error) throw error;
  });
}, 1000);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");