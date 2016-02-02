import Mecab from './mecab-mod.js';
import fs from 'fs';

const mecab = new Mecab();

class Markov {
  constructor(text, SENTENCE_COUNT) {
    this.makeWordbank(text);
  }

  // use mecab then make wordbank
  makeWordbank(text) {
    mecab.parse(text, (err, words) => {
      let tmp = ['@'];
      let wordbank = {};
      for (let key in words) {
        let t = words[key];
        let word = t[0];
        word = word.replace(/\s*/, '');
        if (word == '' || word == 'ESO') continue;

        tmp.push(word);
        if (tmp.length < 3) continue;

        if (tmp.length < 3) tmp.splice(0, 1);

        this.setWord3(wordbank, tmp);

        if (word == '。') {
          tmp = ['@'];
          continue;
        }
      }

      this.makeSentence(wordbank);
    });
  }

  setWord3(p, s3) {
    let w1 = s3[0];
    let w2 = s3[1];
    let w3 = s3[2];

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

  makeSentence(wordbank) {
    for (let i = 0; i < this.SENTENCE_COUNT; i++) {
      let ret = [];
      let top = wordbank['@'];
      if (!top) continue;

      let w1 = this.choiceWord(top);
      let w2 = this.choiceWord(top[w1]);

      ret.push(w1);
      ret.push(w2);
      for (;;) {
        let w3 = this.choiceWord(wordbank[w1][w2]);
        ret.push(w3);

        if (w3 == '。')
        break;

        w1 = w2;
        w2 = w3;
      }

      console.log(ret.join(''));
    }
  }

  choiceWord(obj) {
    let ks = [];
    for (let key in obj) {
      ks.push(key);
    }

    let i = this.rnd(ks.length);
    return ks[i];
  }

  rnd(num) {
    return Math.floor(Math.random() * num);
  }
}

module.exports = Markov;
