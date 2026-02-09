# Grammar Defense Force (文法防衛軍)

迫りくる英単語を迎撃せよ！
8bitレトロスタイルの英語学習シューティングゲームです。単語の「品詞」を素早く判断して、基地を防衛しましょう。

## 遊び方

### 基本ルール
画面上部から英単語が降ってきます。単語が一番下のライン(基地)に到達するとダメージを受けます。
HPが0になるとゲームオーバーです。

### 操作方法
単語の**品詞**に対応するボタンを押して攻撃します。

*   **NOUN (名詞)**: 青色のボタン
*   **VERB (動詞)**: ピンク色のボタン
*   **ADJ (形容詞)**: 緑色のボタン

正解すると敵は爆発し、スコアが加算されます。
間違えると少しダメージを受けるか、ペナルティがあります。

### ゲームモード
1.  **START MISSION (通常モード)**
    *   中学生〜高校1年生レベルの基本的な英単語が出現します。
2.  **IMABARI MODE (今治モード)**
    *   今治市に関連する単語（タオル、造船、しまなみ海道など）が出現します。
    *   背景がしまなみ海道の夜景に変化します。

### 言語設定
右上の「MODE」ボタンで表示言語を切り替えられます。
*   **JP & EN**: 英語の下に日本語訳を表示
*   **ENG ONLY**: 英語のみ表示

---

## 🛠️ 開発者向けガイド（単語の追加方法）

このゲームは React + TypeScript で作られています。
単語リストは `constants.ts` ファイルで管理されています。
既存の単語の形式に合わせて記述するだけで、簡単に追加できます。

### 新しい単語を追加する手順

1.  プロジェクト内の `constants.ts` ファイルを開きます。
2.  `WORD_LIST`（通常モード用）または `IMABARI_WORD_LIST`（今治モード用）の配列を探します。
3.  以下の形式で新しい単語データを追加します。

```typescript
// 例: "Apple" (名詞) を追加する場合
{ 
  text: "Apple",      // 英単語
  jp: "りんご",       // 日本語訳
  type: WordType.NOUN // 品詞 (NOUN, VERB, ADJECTIVE のいずれか)
},
```

### 品詞のタイプ
`types.ts` で定義されている以下の `WordType` を使用してください。

*   `WordType.NOUN` : 名詞
*   `WordType.VERB` : 動詞
*   `WordType.ADJECTIVE` : 形容詞

### 技術スタック
*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **Graphics**: HTML5 Canvas API
*   **Audio**: Web Audio API (BGM/SFX), Web Speech API (単語読み上げ)
*   **Font**: DotGothic16 (Google Fonts)
