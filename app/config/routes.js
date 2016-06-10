var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Main = require('../components/Main');
var Auth = require('../components/Auth');
var Orders = require('../components/Orders');

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var routes = (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router history={hashHistory}>
            <Route path='/' component={Main}>
                <IndexRoute component={Auth} />
                <Route path='orders' component={Orders} />
            </Route>
        </Router>
    </MuiThemeProvider>
);

module.exports = routes;
