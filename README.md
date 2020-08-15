# UTAOS_Slack_viewer

UTokyo AOS Slack 過去ログ

## ディレクトリ構成

-   exported/ エクスポートした zip を解凍したもの
-   intermediate/ 過去ログを Groonga にロードするための中間ファイル(JSON)
-   database/ Groonga の DB

## Groonga の DB 初期化

```bash
# DB作成
$ groonga -n database/slack.db

# テーブル作成(主キーは時刻)
table_create messages TABLE_HASH_KEY Time

# カラム作成
column_create --table messages --name text --type Text
column_create --table messages --name user --type ShortText
column_create --table messages --name channel --type ShortText
column_create --table messages --name thread_ts --type Time

# 中間ファイル生成
node json2json.js

# HTTPサーバー起動
$ groonga -p 10041 -d --protocol http database/slack.db

# DBにJSONを読み込む
node load_json.js

# 管理画面 http://127.0.0.1:10041/
# 終了 http://127.0.0.1:10041/d/shutdown
```
