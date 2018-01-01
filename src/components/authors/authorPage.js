"use strict";
// this page is the Controller View (parent), authorList is a child of this page that takes props
var React = require('react');
var Router = require('react-router');
var Link = require('react-router').Link;
var AuthorStore = require('../../stores/authorStore.js');
var AuthorList = require('./authorList');

var AuthorPage = React.createClass({
    getInitialState: function() {
        return {
            authors: AuthorStore.getAllAuthors()
        };
    },

    render: function () {
        return (
            <div>
                <h1>Authors</h1>
                <Link to="addAuthor" className="btn btn-default">Add Author</Link>
                <AuthorList authors={this.state.authors} />
            </div>
        );
    }
});

module.exports = AuthorPage;
