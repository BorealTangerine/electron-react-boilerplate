import React, { Component } from 'react';
import InputForm from './InputForm';
import AreaForm from './AreaForm';
class Form extends Component {
    handleSubmit = (e)=> {

        this.props.editing()
        e.preventDefault();}

        formType = ()=>{
            switch (this.props.type) {
                case 'input': return <InputForm text={this.props.text} name='Title' submit={this.handleSubmit} action={this.props.action}/>
                case 'area': return <AreaForm text={this.props.text}  name='Body' submit={this.handleSubmit} action={this.props.action} editing={this.props.editing}/>

                default:

            }
        }

        render(){
            return (
                this.formType()
            )
        }
}

export default Form
