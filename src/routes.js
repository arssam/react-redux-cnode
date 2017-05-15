import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Article from './containers/Article';
import HomePage from './containers/HomePage';
import Login from './containers/Login'
import Profile from './containers/Profile'
import Message from './containers/Message';
import PublishTopic from './containers/PublishTopic';

const routes = (
    <Route path='/' component={App}>
        <IndexRoute component={HomePage}/>
        <Route path='topic/:id' component={Article}/>
        <Route path='login' component={Login} />
        <Route path='profile' component={Profile} />
        <Route path='message' component={Message}/>
        <Route path='publishTopic' component={PublishTopic}/>
    </Route>
)

export default routes;