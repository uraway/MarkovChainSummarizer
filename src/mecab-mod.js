// MeCabを利用するためのモジュール
module.exports = function() {
  // 外部モジュールの取り込み
  let exec = require('child_process').exec;
  let iconv = require('iconv-lite');
  let fs = require('fs');
  let platform = require('os').platform();

  // モジュール変数の定義
  // 一時ファイル
  //
  this.TMP_FILE = __dirname + '/__mecab_tmpfile';

  // MeCabのコマンドライン
  this.MECAB = 'mecab';
  this.ENCODING = (platform.substr(0, 3) == 'win')
                ? 'SHIFT_JIS' : 'UTF-8';

  // 形態素解析を実行する関数
  this.parse = function(text, callback) {
    let encoding = this.ENCODING;
    text += '\n';

    // 変換元テキストを一時ファイルに保存
    if (encoding != 'UTF-8') {
      let buf = iconv.encode(text, encoding);
      fs.writeFileSync(this.TMP_FILE, buf, 'binary');
    } else {
      fs.writeFileSync(this.TMP_FILE, text, 'UTF-8');
    }

    // コマンドを組み立てる
    let cmd = [
      this.MECAB,
      "'" + this.TMP_FILE + "'",
    ].join(' ');

    // コマンドを実行
    let opt = { encoding: 'UTF-8' };
    if (encoding != 'UTF-8') opt.encoding = 'binary';
    exec(cmd, opt,
      function(err, stdout, stderr) {
        if (err) return callback(err);
        let inp;

        // 結果出力ファイルを元に戻す
        if (encoding != 'UTF-8') {
          iconv.skipDecodeWarning = true;
          inp = iconv.decode(stdout, encoding);
        } else {
          inp = stdout;
        }

        // 結果をパースする
        inp = inp.replace(/\r/g, '');
        inp = inp.replace(/\s+$/, '');
        let lines = inp.split('\n');
        let res = lines.map(function(line) {
          return line.replace('\t', ',').split(',');
        });

        callback(err, res);
      });
  };
};
