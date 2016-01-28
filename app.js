//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var path = require('path');
var http = require('http');
var fs   = require('fs');

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
    for (var child of childs) {
      traverse(child, accessor, traverser);
    };
  }
  traverser(json);
}

var validate = (users) => {
  var usersCounts = {
    director:       0,
    deputyDirector: 0,
    contractor:     0,
    courier:        0
  };
  traverse(users, (user) => user.subordinates, (user) => {
    switch (user.type) {
      case usersTypes.DIRECTOR:
          usersCounts.director++;
        break;
      case usersTypes.DEPUTY_DIRECTOR:
          usersCounts.deputyDirector++;
        break;
      case usersTypes.CONTRACTOR:
          usersCounts.contractor++;
        break;
      case usersTypes.COURIER:
          usersCounts.courier++;
        break;
    }
  });
  return (usersCounts.director   <= usersConstraints.DIRECTOR   && usersCounts.deputyDirector <= usersConstraints.DEPUTY_DIRECTOR &&
          usersCounts.contractor <= usersConstraints.CONTRACTOR && usersCounts.courier        <= usersConstraints.COURIER);
}

//
// Define users globally
//
var data = {};

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
      socket.emit('updateUsers', data);
    });
    
    socket.on('changeUsers', (newData) => {
      if (validate(newData.users)) {
        data.users = newData.users;
        socket.broadcast.emit('updateUsers', data);
      } else {
        socket.emit('updateUsers', data);
      }
    });
  });
};

//
// Persistence implementation
//
var startPersisting = () => {
  setInterval(() => {
    fs.writeFile('./users.json', JSON.stringify(data.users), (error) => {
      if (error) throw error;
    });
  }, 1000);
}

fs.readFile('./users.json', 'utf8', (error, usersRaw) => {
  if (error) throw error;
  var newUsers = JSON.parse(usersRaw);
  if (validate(newUsers)) {
    data.users = newUsers;
    startPersisting();
    startNetworking();
  } else {
    throw new Error('Invalid users.json');
  }
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");