'use strict';

var React = require('react');
window.React = React;

//Required by React Material UI : http://material-ui.com/#/get-started
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var NewspapersApp = require('./NewspapersApp');

React.render((<NewspapersApp />), document.getElementById('app'));