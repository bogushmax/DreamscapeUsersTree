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
        this.socket.removeListener('connect', callback);
    }
    
    addUpdateUsersListener(callback: (data : {}) => void) : void {
        this.socket.on('updateUsers', callback);
    }
    
    removeUpdateUsersListener(callback: (data : {}) => void) : void {
        this.socket.removeListener('updateUsers', callback);
    }
    
    sendUsersUpdateRequest() : void {
        this.socket.emit('getUsers');
    }
    
    sendUsersChangeMessage(data) : void {
        this.socket.emit('changeUsers', data);
    }
}

export = Services;