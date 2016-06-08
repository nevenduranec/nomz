var React = require('react');
var ReactDOM = require('react-dom');
var routes = require('./config/routes');
require('materialize-css/bin/materialize.css')
require('materialize-css/bin/materialize.js')
require('./assets/css/app.scss');
window.jQuery = window.$ = require('jquery');
window.$.velocity = require('velocity-animate/velocity.js');


ReactDOM.render(
    routes,
    document.getElementById('app')
);
