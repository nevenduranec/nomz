var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Main = require('../components/Main');
var Auth = require('../components/Auth');
var Orders = require('../components/Orders');

var routes = (
    <Router history={hashHistory}>
        <Route path='/' component={Main}>
            <IndexRoute component={Auth} />
            <Route path='orders' component={Orders} />
        </Route>
    </Router>
);

module.exports = routes;
