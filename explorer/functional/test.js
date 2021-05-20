'use strict';
const RA = require('ramda-adjunct');
const {anyPass, assoc, both, compose, complement, equals, isNil, isEmpty, lensPath} = require('ramda');

let exec = {
    "formula": {

    },

    "context": {
        "meta": {

        },

        "steps": {

        },

        "config": {

        },

        "info": {

        },

        "trigger": {
            "args": {

            },
            "event": {

            }
        }

    },

    "entry": "",

    "options": {

    }
};


let data = {
    a: 1
};

const Item = {
    A: String(data.a),
    
};

console.log(equals('test')('test'));



