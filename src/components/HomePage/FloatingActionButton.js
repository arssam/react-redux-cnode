import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router'

const style = {
    position: 'fixed',
    bottom: 50,
    right: 50
}

const FloatActionButton = () => (
    <MuiThemeProvider>
        <Link to={`/publishTopic`}>
            <FloatingActionButton style={style} secondary={true}>
                <ContentAdd />
            </FloatingActionButton>
        </Link>
    </MuiThemeProvider>
)

export default FloatActionButton