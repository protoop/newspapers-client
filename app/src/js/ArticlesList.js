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
            articles: [],
            displayLoadMore: true
        };
    },

    componentDidMount: function() {
        $.get(config.web.url + ':' + config.web.port +  '/newspapers/'
            + this.props.newspaper.id +'/articles', function(result) {
            if (result && result["status"] && result["status"] == 'ok'){
                var articles= result["data"];
                var newDisplayLoadMore = this.state.displayLoadMore;
                if(articles.length < 10){
                    newDisplayLoadMore = false;
                }
                if (this.isMounted()) {
                    this.setState({
                        articles: articles,
                        displayLoadMore: newDisplayLoadMore
                    });
                }
            } else {
                console.log("API error : no article :(");
            }
        }.bind(this));
    },

    handleLoadMoreClick: function(event){
        var nb = Math.ceil(this.state.articles.length /10) * 10;
        $.get(config.web.url + ':' + config.web.port +  '/newspapers/'
            + this.props.newspaper.id +'/articles/offset/'+nb, function(result) {
            if (result && result["status"] && result["status"] == 'ok'){
                var new_articles = result["data"];
                var newDisplayLoadMore = this.state.displayLoadMore;
                var old_articles = this.state.articles;
                if(new_articles.length < 10){
                    newDisplayLoadMore = false;
                }
                new_articles = old_articles.concat(new_articles);
                this.setState({
                    articles: new_articles,
                    displayLoadMore: newDisplayLoadMore
                });
            } else {
                console.log("API error : no article :(");
            }
        }.bind(this));
    },

    render: function(){

        var display = this.props.display ? 'articles-list' : 'display-none';
        var displayLoadMore = this.state.displayLoadMore ? 'articles-list-load-more' : 'display-none';

        return (
            <div className={display}>
                <h2 className="newspaper-title">{this.props.newspaper.name}</h2>
                <Paper zDepth={1} className="mb2 bg-white">
                    <div className="p2">
                        {this.state.articles.map(function(article) {
                            return (
                                <div>
                                    <ArticlePanel article={article} display={display} />
                                </div>
                            );
                        })}
                        <div>
                            <a className={displayLoadMore}
                               onClick={this.handleLoadMoreClick}
                               href="javascript:return;" >Load more...</a>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
});

module.exports = ArticleList;
