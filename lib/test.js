'use strict';

var Markov = require('./index.js');
var fs = require('fs');

var markov = new Markov(fs.readFileSync('./sample.txt', 'utf-8'), 3);

console.log(markov);