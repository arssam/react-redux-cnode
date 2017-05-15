import { combineReducers } from 'redux';
import homePage from './homePage'
import article from './article'
import login from './login'
import profile from './profile'
import message from './message'
import publishTopic from './publishTopic'

const rootReducer = combineReducers({homePage,article,login,profile,publishTopic,message})

export default rootReducer