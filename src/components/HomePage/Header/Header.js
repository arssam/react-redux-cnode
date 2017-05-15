import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import {Link} from 'react-router';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import IconButton from 'material-ui/IconButton';
import SwipeableViews from 'react-swipeable-views';

class Header extends Component {
    static PropTypes = {
        filter: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    }
    state = {
        sildeIndex: 0
    }
    componentWillMount(){
        const {tabs, filter} = this.props;
        let sildeIndex;
        tabs.forEach((tab,index) => {
            if(tab.filter === filter) sildeIndex = index;
        })
        this.setState({
            sildeIndex: sildeIndex
        })
    }
    handleChange = value => {
        this.setState({
            sildeIndex: value
        })
        this.props.onClick(this.props.tabs[value].filter)
    }

    render(){
        return (
            <MuiThemeProvider>
                <div>
                    <div className={styles.header} style={{top: -this.props.fixedTop}}>
                        <AppBar title={<p style={{textAlign: 'center'}}>NodeJS论坛</p>}
                            onLeftIconButtonTouchTap={this.props.toggleDrawer} 
                            iconElementRight={
                                <div style={{marginTop: -8}}>
                                    <Badge badgeContent={this.props.unreadMessageCount} secondary={true} style={{top: 3}}>
                                        <Link to={`/message`}>
                                            <IconButton tooltip='未读信息' style={{padding: 0, width: 25, height: 25}}>
                                                <div>
                                                    <NotificationsIcon style={{color: 'white'}}/>
                                                </div>
                                            </IconButton>
                                        </Link>
                                    </Badge>
                                </div>}/>
                         <Tabs onChange={this.handleChange} value={this.state.sildeIndex}>
                            {this.props.tabs.map((tab, i) => 
                                <Tab key={i} label={tab.title} value={i}>
                                </Tab>
                                )}
                         </Tabs>  
                      </div>
                      <SwipeableViews index={this.state.sildeIndex} onChangeIndex={this.handleChange}>
                        {this.props.children}
                      </SwipeableViews>   
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Header