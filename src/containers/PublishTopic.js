import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {fetchArticle,fetchPublishTopic} from '../actions'
import Header from '../components/common/Header/Header'
import Dialog from '../components/common/Dialog'
import LinkToLogin from '../components/common/LinkToLogin/LinkToLogin'
import Form from '../components/PublishTopic/Form/Form'

class PublishTopic extends Component {
    state = {
        isOpen: false,
        isFetching: false,
        titleErr: false,
        contentErr: false
    }

    componentWillReceiveProps(newProps){
        const {publishTopic,dispatch} = newProps
        if(!this.props.publishTopic.topicId || this.props.publishTopic.topicId !== publishTopic.topicId) {
            this.setState({
                isFetching: false
            })
            dispatch(fetchArticle(publishTopic.topicId))
        }
    }

    showDialog = () => {
        this.setState({
            isOpen: true,
            isFetching: true
        })
    }
    close = () => {
        this.setState({
            isOpen: false
        })
    }
    ifTitleErr = boolean => {
        this.setState({
            titleErr: boolean
        })
    }
    ifContentErr = boolean => {
        this.setState({
            contentErr: boolean
        })
    }
    render(){
        const {dispatch,publishTopic,login} = this.props
        const ifTitleErr = this.ifTitleErr
        const ifContentErr = this.ifContentErr
        const showDialog = this.showDialog
        const state = this.state
        return (
            <div>
                <Header title='发布新主题' />
                <div style={{marginTop:100}}>
                    {login.succeed && <Form {...({ifTitleErr,ifContentErr,showDialog,fetchPublishTopic,dispatch,login,state})} />}
                    {!login.succeed && <LinkToLogin dispatch={dispatch} />}
                </div>
                <Dialog isOpen={state.isOpen} link={`/topic/${publishTopic.topicId}`} close={this.close}>
                    {state.isFetching && <div>加载中</div>}
                    {!state.isFetching && <div>发送成功,去看看</div>}
                </Dialog>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {publishTopic,login} = state
    return {publishTopic,login}
}

export default connect(mapStateToProps)(PublishTopic)