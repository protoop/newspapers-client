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
                newspapers.map(function(newspaper) {
                    newspaper.display = false;
                });
                if (this.isMounted()) {
                    this.setState({newspapers_list: newspapers});
                }
            } else {
                console.log("API error : no newspaper :(");
            }
        }.bind(this));
    },

    onCheck: function () {
        var newspapers_list = this.state.newspapers_list;
        newspapers_list.map(function(newspaper) {
            var refname = "filters_checkbox_newspaper_" + newspaper.id;
            newspaper.display = this.refs[refname].isChecked();
        }.bind(this));
        this.setState(newspapers_list);
    },

    render: function(){

        var NewspapersArticlesLists = this.state.newspapers_list.map(function(newspaper) {
            return (
                <div>
                    <ArticlesList newspaper={newspaper}
                                  display={newspaper.display} />
                </div>
            );
        });

        var displayNoNewspaperCheckedMessageBool = true;
        this.state.newspapers_list.map(function(newspaper) {
            if (newspaper.display){
                displayNoNewspaperCheckedMessageBool = false;
            }
        });
        var displayNoNewspaperCheckedMessage = displayNoNewspaperCheckedMessageBool ?
            'articles-list-no-newspaper-text p4' : 'display-none';

        var FiltersNewspapersCheckboxes = this.state.newspapers_list.map(function(newspaper) {
            return (
                <div>
                    <Checkbox label={newspaper.name}
                              ref={"filters_checkbox_newspaper_" + newspaper.id}
                              onCheck={this.onCheck}
                              defaultSwitched={false} />
                </div>
            );
        }.bind(this));

        return (
            <div>
                { /* Header : */ }
                <header className="header fixed z-index-header">
                    <div className="centered-header">
                        <div className="left">Newspapers App</div>
                        <div className="right">
                            (icon here -->)
                            <IconButton iconClassName="muidocs-icon-action-home"
                                        className="color-main border border-blue right"
                                        tooltip="Menu"/>
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
                                            {FiltersNewspapersCheckboxes}
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
                                {NewspapersArticlesLists}
                                <div className={displayNoNewspaperCheckedMessage}>
                                    <p>Select a newspaper on the left to display its articles.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = NewspapersApp;
