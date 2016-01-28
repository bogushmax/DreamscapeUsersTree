import React    = require('react');
import Services = require('./services');
import Node     = require('./node');

class Main extends React.Component<any, any> {
    private services : Services;

    constructor(props : any) {
      super(props);
      this.state = {};
      this.services = new Services();
      this.services.addUpdateUsersListener((data : {}) => {
        this.setState({ data: data });
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
                
                tempName        = parentUser.name;
                parentUser.name = user.name;
                user.name       = tempName;

                this.services.sendUsersChangeMessage(this.state.data);
                this.setState({ rootUser: this.state.data.users, lastRaisedUser: parentUser });
            }
        }
    }

    render() {
        return (
            <div className="tree">
                { (this.state.data && this.state.data.users) ? <Node user={this.state.data.users} parentUser={null} onRaise={this.onRaise.bind(this)} /> : false }
            </div>
        );
    }
}

export = Main;