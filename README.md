# UTAOS_Slack_viewer

UTokyo AOS Slack 過去ログ

## セットアップ

-   エクスポートした zip を解凍したものを exported/ に置く
-   `./setup.sh`を実行

## Groonga メモ

-   HTTP サーバー起動 `groonga -p 10041 -d --protocol http database/slack.db`
-   管理画面 http://127.0.0.1:10041/
-   終了 http://127.0.0.1:10041/d/shutdown
