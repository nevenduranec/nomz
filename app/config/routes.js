var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Main = require('../components/Main');
var Orders = require('../components/Orders');

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
    fontFamily: 'Jaldi',
    spacing: {
        desktopKeylineIncrement: 84
    },
    palette: {
      primary1Color: '#9F005A',
      accent1Color: '#55D955'
    },
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
