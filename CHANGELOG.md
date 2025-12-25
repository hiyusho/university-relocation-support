# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2025-12-25

### Added
- 5つのストーリーページを完全リニューアル
  - `urban-nature-story.html` - 都市機能とのどかさの両立（Emily さんのストーリー）
  - `cost-living-story.html` - 生活コストの安さ（佐藤家のストーリー）
  - `transport-access-story.html` - 交通アクセスの良さ（田中家のストーリー）
  - `childcare-education-story.html` - 子育て・教育環境（山田家のストーリー）
  - `food-culture-story.html` - 独自の食文化（高橋家のストーリー）

### Changed
- `css/nagoya-city.css` のデザイン改善
  - 人口・面積・アクセスカードの横並び表示
  - 5つの魅力カードのデザイン統一
  - レスポンシブ対応の強化

### Fixed
- 音声読み上げ機能の完全動作確認（全ストーリーページで正常動作）
- レスポンシブデザインの最適化（PC・タブレット・スマホ対応）

---

## [1.3.0] - 2025-12-23

### Added
- サブメニュークリック展開機能の実装（`js/main.js`）

### Changed
- 登録者情報管理画面のフィールド名修正（`admin-registrations.html`）
- データベース連携の最適化（RESTful Table API対応）

### Fixed
- 音声読み上げ機能の修正（`js/speech-reader.js`）

---

## [1.2.0] - 2025-12-22

### Added
- 地域選択モーダル機能の追加
  - 4つの地域から選択可能（名古屋市、尾張地区、西三河地区、東三河地区）
  - モダンなUIデザイン（グラデーション、カードデザイン、アニメーション）
- 音声読み上げ機能の完全実装
  - 5つのストーリーページすべてで利用可能
  - 再生・一時停止・再開・停止の完全制御
  - 読み上げ速度の調整（0.5x - 2.0x）
- 登録者情報管理画面の新設（`admin-registrations.html`）

### Changed
- レスポンシブデザインの改善（PC・タブレット・スマホ対応）

---

## [1.1.0] - 2025-12-21

### Added
- セキュリティ対策の実装
  - HTTPS通信の強制
  - XSS対策
  - CSRF対策
- データ管理機能の追加
  - RESTful Table API対応

---

## [1.0.0] - 2025-12-20

### Added
- 初版リリース
- トップページ（`index.html`）
- 名古屋市ページ（`nagoya-city.html`）
- プライバシーポリシーページ（`privacy-policy.html`）
- 登録フォーム（`registration.html`）
- 基本的なスタイルシート（`css/style.css`）
- 基本的なJavaScript（`js/main.js`）

---

## リンク

- [GitHub Repository](https://github.com/hiyusho/university-relocation-support)
- [公開サイト](https://hiyusho.github.io/university-relocation-support/)
