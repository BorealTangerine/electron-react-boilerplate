import React from 'react';
import {connect} from 'react-redux';
import {Header, List, }from 'semantic-ui-react';
import * as R from 'ramda';
class ExceptionsContainer extends React.Component {
    state = { visible: true }
    toggleVisibility = () => this.setState({ visible: !this.state.visible })
    render() {
        return(<div className='exceptions-padding'>
            <div className='ui segment '>

                <Header>Message Log</Header>
                <ExceptionsList exceptions={this.props.exceptions}/>
            </div>
        </div>);
    }
}

class ExceptionsList extends React.Component {

    mapState = (exceptions) => (R.uniq(exceptions).map((error, index) => { return <ExceptionsItem key={index} text={error}/>; }))
    getExceptions = () => (this.props.exceptions)
    render() {
        return(<List className='list-max'>
            {this.mapState(this.props.exceptions)}
        </List>);
    }
}

class ExceptionsItem extends React.Component {
    render() {
        return(<List.Item>
            {this.props.text}
        </List.Item>);
    }
}
const mapStateToProps = state => state;
export default connect(mapStateToProps)(ExceptionsContainer)
