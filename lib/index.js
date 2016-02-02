'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mecabMod = require('./mecab-mod.js');

var _mecabMod2 = _interopRequireDefault(_mecabMod);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mecab = new _mecabMod2.default();

var Markov = function () {
  function Markov(text, SENTENCE_COUNT) {
    _classCallCheck(this, Markov);

    this.makeWordbank(text);
  }

  // use mecab then make wordbank

  _createClass(Markov, [{
    key: 'makeWordbank',
    value: function makeWordbank(text) {
      var _this = this;

      mecab.parse(text, function (err, words) {
        var tmp = ['@'];
        var wordbank = {};
        for (var key in words) {
          var t = words[key];
          var word = t[0];
          word = word.replace(/\s*/, '');
          if (word == '' || word == 'ESO') continue;

          tmp.push(word);
          if (tmp.length < 3) continue;

          if (tmp.length < 3) tmp.splice(0, 1);

          _this.setWord3(wordbank, tmp);

          if (word == '。') {
            tmp = ['@'];
            continue;
          }
        }

        _this.makeSentence(wordbank);
      });
    }
  }, {
    key: 'setWord3',
    value: function setWord3(p, s3) {
      var w1 = s3[0];
      var w2 = s3[1];
      var w3 = s3[2];

      if (p[w1] == undefined) {
        p[w1] = {};
      }

      if (p[w1][w2] == undefined) {
        p[w1][w2] = {};
      }

      if (p[w1][w2][w3] == undefined) {
        p[w1][w2][w3] = 0;
      }

      p[w1][w2][w3]++;
    }
  }, {
    key: 'makeSentence',
    value: function makeSentence(wordbank) {
      for (var i = 0; i < this.SENTENCE_COUNT; i++) {
        var ret = [];
        var top = wordbank['@'];
        if (!top) continue;

        var w1 = this.choiceWord(top);
        var w2 = this.choiceWord(top[w1]);

        ret.push(w1);
        ret.push(w2);
        for (;;) {
          var w3 = this.choiceWord(wordbank[w1][w2]);
          ret.push(w3);

          if (w3 == '。') break;

          w1 = w2;
          w2 = w3;
        }

        console.log(ret.join(''));
      }
    }
  }, {
    key: 'choiceWord',
    value: function choiceWord(obj) {
      var ks = [];
      for (var key in obj) {
        ks.push(key);
      }

      var i = this.rnd(ks.length);
      return ks[i];
    }
  }, {
    key: 'rnd',
    value: function rnd(num) {
      return Math.floor(Math.random() * num);
    }
  }]);

  return Markov;
}();

module.exports = Markov;