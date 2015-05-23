'use strict';

var config = require('./config');

var React        = require('react');
var $            = require('jquery');
var _            = require('lodash');
var mui          = require('material-ui');
var Paper        = mui.Paper;
var Checkbox     = mui.Checkbox;
var IconButton   = mui.IconButton;
var ArticlesList = require('./ArticlesList');

var NewspapersApp = React.createClass({

    getInitialState: function() {
        return {
            newspapers_list: []
        };
    },

    componentDidMount: function() {
        $.get(config.web.url + ':' + config.web.port +  '/newspapers', function(result) {
            if (result && result["status"] && result["status"] == 'ok'){
                var newspapers = result["data"];
                newspapers = _.sortBy(newspapers, 'name');
                if (this.isMounted()) {
                    this.setState({newspapers_list: newspapers});
                }
            } else {
                console.log("API error : no newspaper :(");
            }
        }.bind(this));
    },


    render: function(){
        return (
            <div>
                { /* Header : */ }
                <header className="header fixed z-index-header">
                    <div className="centered-header">
                        <div className="left">Newspapers App</div>
                        <div className="right">
                            (icon here -->)
                            <IconButton iconClassName="muidocs-icon-action-home"
                                        className="color-main border border-blue right" tooltip="Menu"/>
                        </div>
                    </div>
                </header>
                { /* App content : */ }
                <div className="container">
                    <div className="clearfix">
                        <div className="mx-auto">
                            { /* App menu column : */ }
                            <div className="col col-3 filters py3">
                                <Paper zDepth={1} className="bg-white">
                                    <div className="p2">
                                        <div className="filter filter-newspapers">
                                            <p>Newspapers</p>
                                            {this.state.newspapers_list.map(function(newspaper) {
                                                return (
                                                    <div>
                                                        <Checkbox label={newspaper.name} defaultSwitched={true} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="filter last-filter filter-tags">
                                            <p>Tags</p>
                                            <p>tag 1</p>
                                            <p>tag 2</p>
                                            <p>...</p>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                            { /* App main column : */ }
                            <div className="col col-9 py3 px3">
                                <Paper zDepth={1} className="bg-white">
                                    <div className="p2">
                                        {this.state.newspapers_list.map(function(newspaper) {
                                            return (
                                                <div>
                                                    <h2>{newspaper.name}</h2>
                                                    <ArticlesList newspaper={newspaper}></ArticlesList>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = NewspapersApp;
