# 跨電腦交接

更新：2026-10-20。工作分支：codex/project-bootstrap。

## 接手順序

1. git status -sb確認本機改動。
2. git fetch --prune；首次以git switch --track origin/codex/project-bootstrap接手，已有分支則git switch後git pull --ff-only。
3. 依.node-version使用Node；npm ci --ignore-scripts。
4. npm run check；npm run dev，或建置後開啟dist/index.html。
5. 讀取STATUS.md、知識索引與本次相關來源，再修改。

## 下一個實作切片

- 將說明五門檻及解釋文字也完整資料化，新增引用驗證，避免範本與規則不同步。
- 取得考選部原始大綱，將官方搜尋片段核對升級為原檔逐項核對。
- 核對官方補充圖例、用途條件、例外及無障礙雙軌要求。
- 明確選定目標考試年度與適用法規基準。
- 在完整主題通過專業審核後，再擴充其他主題或遷移正式框架。

## 目前應保留的判斷

- 第4款不能直接視為所有住宅的預設值。
- 單一圖解的尺寸比較不是整座樓梯合規。
- 原始考綱附件仍不可用，不能宣稱完整科目核對完成。
- PostgreSQL模型尚未執行，不能當作已通過的遷移。

## 本機與遠端

使用者最後授權保留公開儲存庫並推送。不要把私人紀錄、憑證、來源資料集或電腦專屬路徑加入提交。

若分支已合併，從main開始新的codex/分支，並更新本文件中的工作分支與下一步。

## 本次驗證回執

[evidence/project-bootstrap.json](evidence/project-bootstrap.json)記錄本機及乾淨匯出檢查。程式與知識結構驗證通過；UI、專業法規與遠端CI各自保留狀態。
