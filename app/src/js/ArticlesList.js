'use strict';

var config = require('./config');

var React        = require('react');
var $            = require('jquery');
var _            = require('lodash');
var mui          = require('material-ui');
var Paper        = mui.Paper;
var ArticlePanel = require('./ArticlePanel');

var ArticleList = React.createClass({

    getInitialState: function() {
        return {
            articles: []
        };
    },

    componentDidMount: function() {
        $.get(config.web.url + ':' + config.web.port +  '/newspapers/' + this.props.newspaper.id +'/articles', function(result) {
            if (result && result["status"] && result["status"] == 'ok'){
                var articles= result["data"];
                if (this.isMounted()) {
                    this.setState({articles: articles});
                }
            } else {
                console.log("API error : no article :(");
            }
        }.bind(this));
    },


    render: function(){
        return (
            <div className="articles-list">
                {this.state.articles.map(function(article) {
                    return (
                        <div>
                            <ArticlePanel article={article} />
                        </div>
                    );
                })}
                <div><a className="articles-list-load-more" href="">Load more...</a></div>
            </div>
        )
    }
});

module.exports = ArticleList;
