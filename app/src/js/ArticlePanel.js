'use strict';

var config = require('./config');

var React = require('react');
var $     = require('jquery');
var _     = require('lodash');
var mui   = require('material-ui');
var Paper = mui.Paper;

var ArticlePanel = React.createClass({

    render: function(){
        return (
            <a href={this.props.article.url} target="_blank" className="link-article">
                <article>
                    <div className="article-thumbnail">
                        <img src={this.props.article.image_url} />
                    </div>
                    <h2>{this.props.article.title}</h2>
                </article>
            </a>
        )
    }
});

module.exports = ArticlePanel;
