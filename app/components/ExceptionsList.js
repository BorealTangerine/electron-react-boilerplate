class ExceptionsList extends React.Component {
    componentDidMount() {
        store.subscribe(() => this.forceUpdate());
    }
    mapState = (exceptions) => (exceptions.map((error, index) => {return <ExceptionsItem key={index} text={error}/>}))


    getExceptions = () => (store.getState().exceptions)
    render() {
        return (<List>
            {this.mapState(store.getState().exceptions)}
        </List>)
    }
}

class ExceptionsItem extends React.Component {
    render() {
        return (<List.Item>
            {this.props.text}
        </List.Item>)
    }
}
