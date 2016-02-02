const Markov = require('./index.js');
const fs = require('fs');

let markov = new Markov(fs.readFileSync('./sample.txt', 'utf-8'), 3);

console.log(markov.);
