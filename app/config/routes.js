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

const muiTheme = getMuiTheme({
    //fontFamily: 'Roboto'
});

var routes = (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={hashHistory}>
            <Route path='/' component={Main}>
                <IndexRoute component={Orders} />
            </Route>
        </Router>
    </MuiThemeProvider>
);

module.exports = routes;
