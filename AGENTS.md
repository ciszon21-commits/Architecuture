# Architecuture 專案規則

## 開始工作

先讀 README.md、docs/STATUS.md、docs/HANDOFF.md 及本次相關知識來源。只修改本專案；原HJPLUS知識庫不是執行依賴，不把本專案放回其raw/或以子模組綁定。

## 跨電腦與Git

- 所有程式及文件使用專案相對路徑，不寫入帳號專屬路徑、磁碟代號、暫存聊天目錄或憑證。
- 使用.node-version及package-lock.json；依賴有變更才更新鎖檔。
- main維持可驗證狀態，功能分支使用codex/前綴。換電腦前commit、push並更新HANDOFF。
- 不覆寫他人的未提交修改，不使用force push、hard reset或自動清除檔案。
- 只用本儲存庫的origin；不得繼承HJPLUS知識庫的遠端。
- 不提交.env、local-data、來源資料集、資料庫、node_modules、dist、完整個人測試日誌或密鑰。
- 每次交付先執行npm run check與git diff --check。CI成功、來源查證與專業審核是不同狀態。
- 本機服務僅綁定127.0.0.1。外部發布及Notion同步需有該次授權。

## 知識管理

knowledge/exam/scope.json管理主題與考綱映射；knowledge/rules/stairs.json管理四款表列尺寸；knowledge/sources/registry.json管理核對紀錄。不要直接手改dist/或建立第二份同名規則。

每個規範數值要有條號、來源與查證日期；查過來源不等於專業人員核准。保留unverified、pending與原始附件不可用狀態，不能為通過檢查而升級查證狀態。

圖解標示假設與範圍。中央／地方、一般建築／無障礙／消防須分別核對；條件不足時不輸出整體合規結論。舊法與歷屆答案不能被現行法覆蓋。

頁面中說明五的敘述及判斷仍有範本內固定文字；修法時須連同範本、規則、來源紀錄及測試一起檢查。後續應將說明五也完整資料化，不能只更新四款尺寸JSON。

## 文件與交接

使用繁體中文。重大架構選擇寫入docs/decisions/，進度更新docs/STATUS.md，未完成項目與接手指令寫入docs/HANDOFF.md。法規來源或開放授權變動要更新docs/PROVENANCE.md。

只保存有判讀價值的自製圖或真實畫面；截圖不能當法規合規或學習成效證據。證據需記錄日期、版本、目的及驗證範圍，不捏造通過結果。
