"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var AuthorApi = require('../api/authorApi');
var ActionTypes = require('../constants/actionTypes');

var AuthorActions = {
    // this is an action creator
    createAuthor: function (author) {
        var newAuthor = AuthorApi.saveAuthor(author);

        // this is the actual action
        // Hey dispatcher - go tell all the stores that an author was just created
        Dispatcher.dispatch({
            actionType: ActionTypes.CREATE_AUTHOR,
            author: newAuthor
        });
    }
};

module.exports = AuthorActions;