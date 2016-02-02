const Mecab = require('./mecab-mod.js');
const fs = require('fs');

const SENTENCE_COUNT = 3;

let mecab = new Mecab();

let text = fs.readFileSync('sample.txt', 'utf-8');

mecab.parse(text, (err, items) => {
  let dic = makeDic(items);
  makeSentence(dic);
});

function makeDic(items) {
  let tmp = ['@'];
  let dic = {};
  for (let i in items) {
    let t = items[i];
    let word = t[0];
    word = word.replace(/\s*/, '');
    if (word == '' || word == 'EOS') continue;
    tmp.push(word);
    if (tmp.length < 3) continue;
    if (tmp.length > 3) tmp.splice(0, 1);
    setWord3(dic, tmp);
    if (word == '。') {
      tmp = ['@'];
      continue;
    }
  }

  return dic;
}
function setWord3(p, s3) {
  let w1 = s3[0], w2 = s3[1], w3 = s3[2];
  if (p[w1] == undefined) p[w1] = {};
  if (p[w1][w2] == undefined) p[w1][w2] = {};
  if (p[w1][w2][w3] == undefined) p[w1][w2][w3] = 0;
  p[w1][w2][w3]++;
}

function makeSentence(dic) {
  for (let i = 0; i < SENTENCE_COUNT; i++) {
    let ret = [];
    let top = dic['@'];
    if (!top) continue;
    let w1 = choiceWord(top);
    let w2 = choiceWord(top[w1]);
    ret.push(w1);
    ret.push(w2);
    for (;;) {
      let w3 = choiceWord(dic[w1][w2]);
      ret.push(w3);
      if (w3 == '。') break;
      w1 = w2, w2 = w3;
    }

    return (ret.join(''));
  }
}

function objKeys(obj) {
  let r = [];
  for (let i in obj) {
    r.push(i);
  }

  return r;
}

function choiceWord(obj) {
  let ks = objKeys(obj);
  let i = rnd(ks.length);
  return ks[i];
}

function rnd(num) {
  return Math.floor(Math.random() * num);
}
