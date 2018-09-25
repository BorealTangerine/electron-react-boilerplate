import React, { Component } from 'react';

class InputForm extends Component {
    state = {value:this.props.text}

    render(){
        return (
            <div onBlur={this.props.submit}>
                <input className='input' placeholder={this.props.name} defaultValue={this.state.value} onChange={this.props.action} autoFocus/>
            </div>
        );
    }
}

export default InputForm;
