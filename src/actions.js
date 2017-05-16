import fetch from 'isomorphic-fetch';
export const REQUEST_TOPICS = 'REQUEST_TOPICS' //请求主题
export const RECEIVE_TOPICS = 'RECEIVE_TOPICS'  //接收主题
export const SELECT_TAB= 'SELECT_TAB' //点击tab页
export const RECORD_SCROLLT='RECORD_SCROLLT' //记录滚动条
export const REQUEST_ARTICLE = 'REQUEST_ARTICLE' //请求文章
export const RECEIVE_ARTICLE = 'RECEIVE_ARTICLE' //接收文章
export const CHANGE_CURRENT_TOPICID = 'CHANGE_CURRENT_TOPICID' //改变当前的主题
export const CURRENT_ROUTER = 'CURRENT_ROUTER' //当前的路由
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS' //登陆成功
export const LOGIN_FAILED = 'LOGIN_FAILED'  //登陆失败
export const LOGOUT = 'LOGOUT'  //退出登陆
export const REQUEST_PROFILE = 'REQUEST_PROFILE'  //请求个人信息
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE'  //得到个人信息
export const SWITCH_SUPPORT = 'SWITCH_SUPPORT'  //转换支持
export const FETCH_COMMENT = 'FETCH_COMMENT'  //请求评论
export const SWITCH_COLLECTED = 'SWITCH_COLLECTED'  //
export const RECORD_ARTICLE_SCROLLT = 'RECORD_ARTICLE_SCROLLT'
export const PUBLISH_TOPIC = 'PUBLISH_TOPIC'  //发布主题
export const FETCH_MESSAGE = 'FETCH_MESSAGE'  //请求信息
export const MARK_ALL_MESSAGES = 'MARK_ALL_MESSAGES'  //标记所有信息
export const GET_COLLECTED_TOPICS = 'GET_COLLECTED_TOPICS'

//首页
export const selectTab = tab => ({
    type: SELECT_TAB,
    tab
})

const requestTopics = tab => ({
    type: REQUEST_TOPICS,
    tab
})
const receiveTopics = (tab, topics, page, limit) => ({
    type: RECEIVE_TOPICS,
    tab,
    topics,
    page,
    limit
})
export const fetchTopics = (tab, page=1, limit=20) => {
    return dispatch => {
        dispatch(requestTopics(tab))
        fetch(`https://cnodejs.org/api/v1/topics?tab=${tab}&page=${page}&limit=${limit}`)
            .then(response => response.json())
            .then(json => dispatch(receiveTopics(tab, json.data, page, limit)))
    }
}

export const recordScrollT = (tab, scrollT) => ({
    type: RECORD_SCROLLT,
    tab,
    scrollT
})
//帖子
const requestArticle = topicId => ({
    type: REQUEST_ARTICLE,
    topicId
})
const receiveArticle = (topicId, article) => ({
    type: RECEIVE_ARTICLE,
    topicId,
    article
})
const changeCurrentTopicId = topicId => ({
    type: CHANGE_CURRENT_TOPICID,
    topicId
})
export const recordArticleScrollT = (topicId, scrollT) => ({
    type: RECORD_ARTICLE_SCROLLT,
    topicId,
    scrollT
})
export const fetchArticle = (topicId, request=true) => {
    return dispatch => {
        if(request) {
            dispatch(requestArticle(topicId))
            fetch(`https://cnodejs.org/api/v1/topic/${topicId}`)
                .then(response => response.json())
                .then(json => dispatch(receiveArticle(topicId,json.data)))
        } else {
            dispatch(changeCurrentTopicId(topicId))
        }
    }
}

//登陆
export const fetchAccess = accessToken => {
    return dispatch => {
        fetch('https://cnodejs.org/api/v1/accesstoken', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `accesstoken=${accessToken}`
        })
            .then(response => response.json())
            .then(json => {
                if(json.success)
                    dispatch(loginSucceed(json.loginname,json.id,accessToken))
                else    
                    dispatch(loginFailed(json.error_msg))
            })
    }
}

export const switchSupport = (accessToken,replyId,index) => {
  return dispatch => {
    fetch(`https://cnodejs.org/api/v1/reply/${replyId}/ups`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `accesstoken=${accessToken}`
        })
    .then(response => response.json())
    .then(json => dispatch({
      type:SWITCH_SUPPORT,
      replyId,
      index,
      success:json.success,
      action:json.action
    }))
  }
}

export const fetchComment = (accessToken,topicId,content,replyId) => {
  return dispatch => {
    const postConent = replyId ? `accesstoken=${accessToken}&content=${content}&replyId=${replyId}`:`accesstoken=${accessToken}&content=${content}`
    fetch(`https://cnodejs.org/api/v1/topic/${topicId}/replies`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: postConent
        })
    .then(response => response.json())
    .then(json => dispatch({
      type:FETCH_COMMENT,
      success:json.success,
      replyId:json.reply_id
    }))
  }
}

export const switchCollected = (isCollected,accessToken,articleId) => {
  return dispatch => {
    fetch(`https://cnodejs.org/api/v1/topic_collect/${isCollected?'de_collect':'collect'}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `accesstoken=${accessToken}&topic_Id=${articleId}`
        })
    .then(response => response.json())
    .then(json => dispatch({
      type:SWITCH_COLLECTED,
      success:json.success
    }))
  }
}

//登陆成功
const loginSucceed = (loginName,loginId,accessToken) => ({
    type: LOGIN_SUCCESS,
    loginName,
    loginId,
    accessToken
})
//登陆失败
const loginFailed = failedMessage => ({
    type: LOGIN_FAILED,
    failedMessage
})
//退出登陆
export const logout = () => ({
    type: LOGOUT
})

const requestProfile = loginname => ({
    type: REQUEST_PROFILE,
    loginname
})
const receiveProfile = (loginname, profile) => ({
    type: RECEIVE_PROFILE,
    loginname,
    profile
})

const getCollectedTopics = username => {
    return dispatch => {
        fetch(`https://cnodejs.org/api/v1/topic_collect/${username}`)
            .then(response => response.json())
            .then(json => dispatch({
                type: GET_COLLECTED_TOPICS,
                success: json.success,
                data: json.data
            }))
    }
}
//请求个人信息
export const fetchProfile = loginname => {
    return dispatch => {
        dispatch(requestProfile(loginname))
        dispatch(getCollectedTopics(loginname))
        fetch(`https://cnodejs.org/api/v1/user/${loginname}`)
            .then(response => response.json())
            .then(json => dispatch(receiveProfile(loginname,json.data)))
    }
}

//发布主题
export const fetchPublishTopic = (accessToken,tab,title,content) => {
    return dispatch => {
        const postContent = `accesstoken=${accesstoken}&tab=${tab}&content=${content}&title=${title}`
        fetch(`https://cnodejs.org/api/v1/topics`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: postConent
        })
            .then(response => response.json())
            .then(json => dispatch({
                type:PUBLISH_TOPIC,
                success:json.success,
                topicId:json.topic_id
            }))
    }
}

//消息
export const fetchMessage = accessToken => {
    return dispatch => {
        fetch(`https://cnodejs.org/api/v1/messages?accesstoken=${accessToken}`)
            .then(response => response.json())
            .then(json => dispatch({
                type: FETCH_MESSAGE,
                hasReadMessage: json.data.has_read_messages,
                hasNotReadMessage: json.data.hasnot_read_messages
            }))
    }
}

export const markAllMessage = accessToken => {
    return dispatch => {
        fetch(`https://cnodejs.org/api/v1/message/mark_all`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `accesstoken=${accessToken}`
        })
            .then(response => response.json())
            .then(json => dispatch({
                type: MARK_ALL_MESSAGES,
                isMarked: json.success
            }))
    }
}