import React, { Component } from 'react'
import { connect } from 'react-redux'
import {selectTab,fetchTopics,recordScrollT,fetchArticle,fetchMessage} from '../actions'
import Header from '../components/HomePage/Header/Header'
import FloatingActionButton from '../components/HomePage/FloatingActionButton'
import CircleLoading from '../components/common/CircleLoading'
import Drawer from '../components/HomePage/Drawer/Drawer'
import Lists from '../components/HomePage/Lists/Lists'
import Snackbar from '../components/common/Snackbar'
import getSize from '../utils/getSize'
import Pull from '../components/common/react-pullrefresh'

class HomePage extends Component {
    state = {
        fadeIn: true,
        openDrawer: false,
        openSnackbar: false,
        isFreshing: false,
        fixedTop: 0,
        scrollT: 0
    }

    onRefresh = next => {
        if(!this.state.isFreshing){
            this.setState({
                isFreshing: true
            })
            this.fresh()
            setTimeout(_ => {
                next()
                this.openSnackbar()
                this.setState({
                    isFreshing: false
                })
            }, 3000)
        }
    }
    fresh = () => {
        const { selectedTab, login, dispatch } = this.props;
        dispatch(fetchTopics(selectedTab,1))
        dispatch(fetchMessage(login.accessToken))
    }
    openSnackbar = () => {
        this.setState({
            openSnackbar: true
        })
        setTimeout(() => {
            this.setState({
                openSnackbar: false
            })
        },2500)
    }
    handleClick = tab => {
        let {scrollT} = getSize()
        const {selectedTab,dispatch,tabData} = this.props;
        dispatch(recordScrollT(selectedTab,scrollT))
        dispatch(selectTab(tab))

        const ua = navigator.userAgent;
        if(!tabData[tab] && ua.indexOf('Mobile') === -1) {
            if(scrollT >= 64) {
                dispatch(recordScrollT(tab,64))
                this.setState({
                    scrollT: 64
                })
            } else {
                dispatch(recordScrollT(tab,scrollT))
                this.setState({
                    scrollT: scrollT
                })
            }
        }
    }

    loadMore = () => {
        const {selectedTab, page, isFetching, dispatch} = this.props
        let ipage = page
        if(!isFetching) dispatch(fetchTopics(selectedTab, ++ipage))
    }

    toggleDrawer = () => {
        this.setState({
            openDrawer: !this.state.openDrawer
        })
    }

    componentWillReceiveProps(newProps) {
        const {topics,isFetching,selectedTab,scrollT,dispatch} = newProps
        //去除刷新时记住的滚动条位置
        if(topics.length === 0 && this.props.scrollT === 0) {
            window.scrollTo(0,0)
        }
        //fetchTopics开始后先发送一个request的action，这个action也会改变state从而触发该方法。
        //如果不对isFetching进行判断，会再次进行fetchTopics从而进行了不必要的重复数据请求
        if(!isFetching && topics.length === 0){
            dispatch(fetchTopics(selectedTab))
        }
        if(selectedTab !== this.props.selectedTab) {
            if(scrollT) {
                window.scrollTo(0,scrollT)
            }
        }
    }

    tabs = [
        {
            title: '全部',
            filter: 'all'
        },
        {
            title: '精华',
            filter: 'good'
        },
        {
            title: '分享',
            filter: 'share'
        },
        {
            title: '问答',
            filter: 'ask'
        },
        {
            title: '招聘',
            filter: 'job'
        }
    ]

    render() {
        const {selectedTab,isFetching,page,topics,dispatch,article,login,profile,unreadMessageCount,tabData} = this.props
        return (
            <div className={this.state.fadeIn ? 'fade-in': ''}>
                <Pull zIndex={10000} size={60} max={200} color='#e91e63' onRefresh={this.onRefresh} />
                <Header filter={selectedTab} onClick={this.handleClick} toggleDrawer={this.toggleDrawer}
                fixedTop={this.state.fixedTop} unreadMessageCount={unreadMessageCount} tabs={this.tabs}>
                    {this.tabs.map((tab, index) => 
                        <div key={index}>
                            {((isFetching && page === 0) || (tab.filter !== selectedTab && !tabData[tab.filter])) && <CircleLoading />}
                            {tab.filter === selectedTab && 
                                <div style={{opacity: (!isFetching || page >= 1) ? 1 : 0}}>
                                    <Lists topics={topics} fetchArticle={fetchArticle} dispatch={dispatch} article={article} isFetching={isFetching} />
                                </div>}
                        </div>    
                    )}
                </Header>
                {!isFetching && <FloatingActionButton />}
                <Drawer toggleDrawer={this.toggleDrawer} openDrawer={this.state.openDrawer}
                    {...({login,dispatch,profile})} />
                <Snackbar isOpened={this.state.openSnackbar} message='刷新成功' />
            </div>
        )
    }

    componentDidMount() {
        const {selectedTab, page, scrollT, dispatch} = this.props
        if(page === 0) dispatch(fetchTopics(selectedTab))
        if(scrollT) window.scrollTo(0, scrollT)
        let lastScrollY = this.lastScrollY

        window.onscroll = () => {
            let {windowH, contentH, scrollT} = getSize()
            if(windowH + scrollT + 100 > contentH) this.loadMore()
        }
    }
    componentDidUpdate() {
        let {windowH,contentH,scrollT} = getSize()
        const {topics} = this.props
        // 第一次切换到没有加载数据的tab时，在willReceiveProp中已经将页面滚动了一定距离，在render中打印scrollT也不为0
        // 但是一进入这个函数scrollT就变为0,而且也未触发onscroll事件（问题待解决），所以目前只能去重新判断这种情况
        if(scrollT === 0 && this.state.scrollT > 0) window.scrollTo(0,this.state.scrollT)

        // 判断内容加载后，内容的高度是否填满屏幕，若网页太高，加载一次内容的高度不能填满整个网页，则继续请求数据
        if(topics.length > 0 && windowH + 200 > contentH ) this.loadMore()
    }
    componentWillUnmount(){
        let {scrollT} = getSize()
        const {selectedTab, dispatch} = this.props
        dispatch(recordScrollT(selectedTab, scrollT))
        // 必须解除组件绑定的事件，否则当组件再次被加载时，该事件会监听两个组件
        window.onscroll = null
    }
}

function mapStateToProps(state) {
    const {homePage, article, login, profile, message} = state
    const {selectedTab, tabData} = homePage
    const unreadMessageCount = message.hasNotReadMessage.length
    //当组件第一次render时,还未进行任何action,初始化的state里没有tabData[selectedTab]，所以这里需要初始化
    const {isFetching,page,scrollT,topics} = tabData[selectedTab] || {isFetching: false, page: 0, scrollT: 0, topics: []}
    return {isFetching, page, scrollT, topics, selectedTab, article, login, profile, tabData, unreadMessageCount}
}

export default connect(mapStateToProps)(HomePage)