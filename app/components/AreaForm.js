import React, { Component } from 'react';


class AreaForm extends Component {
    state = {value:this.props.text}

    render(){
        return (
            <div onBlur={this.props.submit}>
            <textarea className='textarea' placeholder={this.props.name} defaultValue={this.state.value} onChange={this.props.action} autoFocus/>
        </div>
        );
    }
}

export default AreaForm;
