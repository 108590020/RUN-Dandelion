# RUN-Dandelion

RUN-Dandelion 是一個使用 Phaser 製作的 HTML5 2D 跑酷遊戲專案，玩家將操作角色在場景中奔跑，挑戰時間與速度。

---

## 專案結構

- `index.html`：主網頁，載入所有 JS 檔案與 Phaser。
- `js/const.js`：定義遊戲畫布寬高。
- `js/gameStart.js`：遊戲開始場景，顯示 Logo、開始按鈕。
- `js/gamePlay.js`：遊戲主場景，角色控制、計時、速度變化。
- `js/index.js`：Phaser 遊戲初始化與場景設定。
- `js/lib/phaser.min.js`：Phaser 框架。
- `images/`：遊戲用到的圖片資源。

---

## 主要功能

- 角色左右移動控制
- 遊戲開始與場景切換
- 倒數計時與速度變化
- 背景滾動效果
- 支援鍵盤操作

---

## 技術說明

- **Phaser**：HTML5 遊戲引擎，負責場景管理、物理運算、動畫、資源管理等。
- **JavaScript**：遊戲邏輯腳本語言，用於控制角色行為、計時、場景流程等。
- **HTML5**：網頁結構與遊戲畫布。
- **圖片資源**：角色、背景、UI 美術素材。

---

## 如何開始

1. 下載本專案並確保所有檔案結構正確。
2. 使用瀏覽器開啟 `index.html` 即可開始遊戲。
3. 遊戲邏輯可在 `js/` 目錄下編輯。

---

## 開發環境

- 任意現代瀏覽器（Chrome、Edge、Firefox 等）
- 主要依賴 Phaser、JavaScript、HTML5

---

## 版本控制

- 建議設定 `.gitignore` 排除圖片暫存檔與編譯檔

---

如需詳細說明或貢獻，請聯絡專案負責人或參考 Phaser 官方文件。
