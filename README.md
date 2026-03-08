# 時計アナログ (Tokei Anarogu)

モダンな技術で作られた多プラットフォーム対応アナログ時計アプリ。

## プラットフォーム

| プラットフォーム | 技術 | コマンド |
|---|---|---|
| ブラウザ (Web) | React + Vite | `npm run web` |
| デスクトップ | Electron | `npm run desktop` |
| Android / iOS | Expo (React Native) | `npm run mobile` |

## 時計スタイル

1. **クラシック** - 伝統的なローマ数字、木目調デザイン
2. **モダン** - ミニマリスト、細いハンド、シンプルデザイン
3. **ネオン** - ダーク背景、グローイングネオン効果
4. **スイス** - スイス鉄道時計スタイル (SBBインスパイア)
5. **スケルトン** - メカニカル歯車風デザイン

## セットアップ

```bash
# 依存関係インストール
npm install

# Web アプリ起動
npm run web

# デスクトップアプリ起動
npm run desktop

# モバイルアプリ起動 (Expo Go または実機)
npm run mobile
```

## ビルド・リリース

```bash
# Web ビルド
npm run build:web

# デスクトップアプリ パッケージング
npm run build:desktop

# Android APK / AAB
npm run build:android

# iOS IPA
npm run build:ios
```

## 技術スタック

- **Web**: React 18, TypeScript, Vite, CSS Modules
- **Desktop**: Electron 28, electron-builder
- **Mobile**: Expo 50, React Native, react-native-svg
- **共通**: TypeScript, npm workspaces (monorepo)
