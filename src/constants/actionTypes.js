"use strict";

// this mirrors key on both sides
var keyMirror = require('react/lib/keyMirror');

// like a enum in Java and C#
module.exports = keyMirror({
    INITIALIZE: null,
    CREATE_AUTHOR: null,
    UPDATE_AUTHOR: null,
    DELETE_AUTHOR: null
});