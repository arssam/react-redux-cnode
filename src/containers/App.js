import React, { Component } from 'react';
import { connect } from 'react-redux'
import {fetchAccess,fetchMessage,fetchProfile} from '../actions'

class App extends Component {
    componentWillMount(){
        const {dispatch} = this.props
        const LoadingAction = (accessToken,loginName) => {
            dispatch(fetchAccess(accessToken))
            dispatch(fetchMessage(accessToken))
            dispatch(fetchProfile(loginName))
        }
        if(window.localStorage.getItem('mesterInfo')){
            let masterInfo = window.localStorage.getItem('masterInfo')
            masterInfo = JSON.parse(masterInfo)
            const accessToken = masterInfo.accessToken
            const loginName = masterInfo.loginName
            LoadingAction(accessToken,loginName)
        } else {
            const accessToken = '35f04a4b-066c-4ee8-86b9-1e446e03e861'
            const loginName = 'arssam'
            LoadingAction(accessToken,loginName)
        }
    }

    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}

function mapStateToProps(state) {
    const { login, profile } = state
    return { login, profile }
}

export default connect(mapStateToProps)(App)