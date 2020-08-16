# UTAOS_Slack_viewer

UTokyo AOS Slack 過去ログ

## セットアップ

### Groonga

-   `npm i`で node に必要なパッケージをインストール
-   エクスポートした zip を解凍したものを exported/ に置く
-   `./setup.sh`を実行

### Node.js

-   ログインユーザの設定。users/users.json を作成し以下のようにしてユーザーを設定
    ```json
    [{ "username": "username", "password": "password" }]
    ```

## リンク

-   [Slack のアーカイブ - Scrapbox](https://scrapbox.io/ytakano-open/Slack%E3%81%AE%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96)
