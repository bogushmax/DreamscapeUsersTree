import io = require('socket.io-client');

class Services {
    private socket : SocketIOClient.Socket;
    
    constructor() {
        this.socket = io.connect('https://dreamscape-organization-tree-bogushmax.c9users.io/');
    }
    
    addConnectListener(callback: () => void) : void {
        this.socket.on('connect', callback);
    }
    
    removeConnectListener(callback: () => void) : void {
        this.socket.removeListener(callback);
    }
    
    addUpdateUsersListener(callback: (users : {}) => void) : void {
        this.socket.on('updateUsers', (usersRaw : {}) => { callback(usersRaw) });
    }
    
    removeUpdateUsersListener(callback: (users : string) => void) : void {
        this.socket.removeListener('updateUsers', callback);
    }
    
    sendUsersUpdateRequest() : void {
        this.socket.emit('getUsers');
    }
    
    sendUsersChangeMessage(users) : void {
        this.socket.emit('changeUsers', users);
    }
}

export = Services;