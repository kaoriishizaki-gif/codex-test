# おうちシェフAI

材料を入力すると、レシピ候補と料理画像を表示するシンプルなWebアプリです。

## 機能
- 材料入力から3つのレシピ候補を提案
- OpenAI画像API（既定モデル: `images-2.0`）で料理写真を生成
- APIキー未入力時はフォールバック画像を表示
- お気に入り保存（LocalStorage）

## すぐ使う（あなた一人で使う用）
毎回さっと開きたい場合は、以下だけでOKです。

```bash
cd /workspace/codex-test
./run_chrome.sh
```

- 自動でローカルサーバーを起動
- 自動でGoogle Chrome（またはChromium）を開く
- ターミナルで `Ctrl + C` を押すと終了

> ポートを変えたい場合: `./run_chrome.sh 9000`

## 従来の手動起動
1. プロジェクトディレクトリへ移動
   ```bash
   cd /workspace/codex-test
   ```
2. ローカルサーバーを起動
   ```bash
   python3 -m http.server 8000
   ```
3. Google Chromeで以下を開く
   ```
   http://localhost:8000
   ```

## 使い方
1. 材料をカンマ区切りで入力
2. （任意）OpenAI APIキーとモデル名（`images-2.0` 既定）を設定
3. 「レシピを提案する」をクリック
4. 気に入ったレシピを「お気に入りに追加」
