import React    = require('react');
import Services = require('./services');
import Node     = require('./node');

class Main extends React.Component<any, any> {
    private services : Services;

    constructor(props : any) {
      super(props);
      this.state = {};
      this.services = new Services();
      this.services.addUpdateUsersListener((rootUser : {}) => {
        this.setState({ rootUser: rootUser });
      });
      this.services.addConnectListener(() => {
        this.services.sendUsersUpdateRequest();
      });
    }

    onRaise(parentUser, user) {
        if (parentUser) {
            if (this.state.lastRaisedUser != user) {
                // Just swap name
                var tempName;
                
                tempName = parentUser.name;
                parentUser.name = user.name;
                user.name = tempName;

                this.services.sendUsersChangeMessage(this.state.rootUser);
                
                this.setState({ rootUser: this.state.rootUser, lastRaisedUser: parentUser });
            }
        }
    }

    /*    
    onMoveToLeftChief(parentUser, user) {

    }

    onMoveToRightChief(parentUser, user) {
    
    }
    */

    render() {
        return (
            <div className="tree">
                {this.state.rootUser ? <ul><Node user={this.state.rootUser} parentUser=null onRaise={this.onRaise.bind(this)} /></ul> : false}
            </div>
        );
    }
}

export = Main;