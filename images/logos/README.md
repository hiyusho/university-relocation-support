# images/logos フォルダ作成ガイド

## 📂 フォルダ構造

作成するフォルダ構造:
```
university-relocation-support/
├── images/
│   └── logos/
│       ├── .gitkeep (空フォルダ保持用)
│       ├── nagoya-university.png (例)
│       ├── nagoya-institute-of-technology.png (例)
│       ├── aichi-medical-university.png (例)
│       └── (その他の大学ロゴ)
```

## 🎯 対象大学リスト

### 名古屋市内
- 名古屋大学 (Nagoya University)
- 名古屋工業大学 (Nagoya Institute of Technology)
- 名古屋市立大学 (Nagoya City University)

### 尾張地域
- 愛知教育大学 (Aichi University of Education) - 刈谷市
- 愛知県立大学 (Aichi Prefectural University) - 長久手市
- 愛知県立芸術大学 (Aichi University of the Arts) - 長久手市

### 西三河地域
- 豊橋技術科学大学 (Toyohashi University of Technology)

### 東三河地域
- 愛知医科大学 (Aichi Medical University) - 長久手市

## 📝 ロゴ画像の推奨仕様

- **形式**: PNG (透過背景推奨) または SVG
- **サイズ**: 横幅 200-400px 推奨
- **命名規則**: `大学名-英語-小文字-ハイフン区切り.png`
  - 例: `nagoya-university.png`
  - 例: `aichi-medical-university.png`

## 🔧 HTMLでの使用方法

```html
<!-- index.html での使用例 -->
<div class="university-card">
    <img src="images/logos/nagoya-university.png" 
         alt="名古屋大学ロゴ" 
         class="university-logo">
    <h3>名古屋大学</h3>
</div>
```

## 🎨 CSS での調整

```css
/* style.css での調整例 */
.university-logo {
    width: 200px;
    height: auto;
    object-fit: contain;
    margin-bottom: 1rem;
}
```

## ⚠️ 注意事項

1. **著作権**: 各大学の公式ロゴは著作権保護されています
2. **使用許諾**: 使用前に各大学から許諾を得る必要があります
3. **代替案**: 許諾が得られない場合は、大学名のテキスト表示のみにする

## 📋 実装ステップ

1. ✅ `images/logos/` フォルダを作成
2. ⬜ 各大学から公式ロゴを取得
3. ⬜ 使用許諾を確認
4. ⬜ ロゴ画像をアップロード
5. ⬜ `index.html` にロゴ表示コードを追加
6. ⬜ `style.css` でレイアウト調整
