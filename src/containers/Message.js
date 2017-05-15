import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {fetchMessage,fetchArticle} from '../actions'
import Content from '../components/Message/Content/Content'
import LinkToLogin from '../components/common/LinkToLogin/LinkToLogin'
import Header from '../components/common/Header/Header'
import getSize from '../utils/getSize'

class Message extends Component {
    ComponentDidMount() {
        const {login,dispatch,message} = this.props
        if(login.accessToken && message.hasReadMessage.length === 0) {
            dispatch(fetchMessage(login.accessToken))
        }
    }
    render() {
        const {dispatch,message,article,login} = this.props
        return (
            <div>
                <div>
                    <Header title='详情' />
                    <div style={{marginTop:64}}>
                        {!login.succeed && <LinkToLogin dispatch={dispatch} />}
                        {login.succeed && <Content {...message} {...({dispatch,fetchArticle,article,login})} />}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {login,message,article} = state
    return {login,message,article}
}

export default connect(mapStateToProps)(Message)