'use strict';

var React = require('react');
var mui = require('material-ui');
var Checkbox = mui.Checkbox;
var Paper = mui.Paper;

var NewspapersApp = React.createClass({

    getInitialState: function() {
        return {
            newspapers_list: [{"id":1,"name":"Le Monde","url":"http://www.lemonde.fr"},
            {"id":2,"name":"Le Figaro","url":"http://www.lefigaro.fr"},
            {"id":3,"name":"20 Minutes","url":"http://www.20minutes.fr"}]
        };
    },

    render: function(){
        return (
            <div>
                { /* Header : */ }
                <header className="py2 blue bg-white">
                    <div className="dark-gray thin-header">
                        Newspapers App
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
                                                        <Checkbox label={newspaper.name} />
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
                            <div className="col col-9 py3 px3">Main content.</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = NewspapersApp;
