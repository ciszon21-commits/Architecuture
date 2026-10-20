# 築法學習室｜Architecuture

臺灣建築師考試法規視覺學習平台。現階段為可操作原型，正式應用框架與專業教材審核尚未完成。

遠端儲存庫：https://github.com/ciszon21-commits/Architecuture 。名稱保留原拼字；依使用者最新指示採公開儲存庫。

## 在另一台電腦開始

準備 Git、Node.js 22.20.0（含 npm），再執行：

```sh
git clone --branch codex/project-bootstrap https://github.com/ciszon21-commits/Architecuture.git
cd Architecuture
npm ci --ignore-scripts
npm run check
npm run dev
```

開啟終端機顯示的本機網址。只閱讀原型也可執行 `npm run build`，直接用瀏覽器開啟 `dist/index.html`。

若工作尚在功能分支，依 [交接文件](docs/HANDOFF.md) 切換到該分支。不要以聊天紀錄或舊的暫存HTML作為最新來源。

## 目錄

| 目錄 | 內容 |
|---|---|
| src/ | 網頁範本；不手改建置輸出 |
| lib/、scripts/ | 幾何運算、可重現建置、檢查與本機預覽 |
| knowledge/ | 考綱、候選主題、規則與查證來源 |
| database/ | 尚未執行的PostgreSQL模型草稿 |
| docs/ | 規劃、決策、交接、來源政策與選定證據 |
| tests/ | 可在不同電腦執行的Node測試 |
| dist/ | 產生的自足式網頁，不進Git |
| local-data/ | 本機快照或個人資料，不進Git |

## 每次開發

- 先讀 [交接](docs/HANDOFF.md)、[狀態](docs/STATUS.md) 與 [Agent規則](AGENTS.md)。
- 以 `knowledge/` 為主題及四款樓梯表列規則的來源，透過建置注入畫面。
- 修改後執行 `npm run check` 與 `git diff --check`，再提交及推送。
- 換電腦前更新交接文件；未提交的改動不會由Git同步。

## 知識狀態

已映射營建法規與實務八項，但原始考綱附件讀取、其餘科目對照及專業審核仍未完成。第33條的表列尺寸及說明五已記錄來源查閱範圍；這不代表完整法規合規判定。歷屆試題尚未匯入，畫面題目為自編練習。

更多內容見 [文件索引](docs/index.md)、[知識索引](knowledge/index.md) 與 [跨電腦Git流程](docs/DEVELOPMENT.md)。

## 授權狀態

本專案尚未選定對外授權，`package.json` 標為 `UNLICENSED`。公開儲存庫不等於授予任意再利用授權。官方來源、既有知識庫與未來引入資料應依 [來源與授權紀錄](docs/PROVENANCE.md) 分別管理。
