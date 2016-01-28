import React = require('react');

class Node extends React.Component<any, any> {
    constructor(props : any) { super(props) }
    render() {
        var subordinates;
        if (this.props.user.subordinates) {
            subordinates = 
            <ul>
                {
                    this.props.user.subordinates.map((user : any) => {
                        return <Node user={user} parentUser={this.props.user} onRaise={this.props.onRaise} />
                    })
                }
            </ul>;
        }
        return (
            <li>
        		<div className="btn-group">
        		    <a href="#" className="btn btn-default btn-mini">&larr;</a>
        		    <a href="#" className="btn btn-default btn-mini" onClick={this.props.onRaise.bind(this, this.props.parentUser, this.props.user)}>{this.props.user.name}</a>
        		    <a href="#" className="btn btn-default btn-mini" onClick={this.props.onRaise.bind(this, this.props.parentUser, this.props.user)}>&uarr;</a>
        		    <a href="#" className="btn btn-default btn-mini">&rarr;</a>
                </div>
        		{subordinates}
        	</li>
        );
    }
}

export = Node;