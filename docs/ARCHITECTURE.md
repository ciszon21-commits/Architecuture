# 架構與資料流

目前為零第三方依賴的可重建原型；Next.js、帳號同步與正式資料庫仍在規劃中。

## 建置

knowledge/exam/scope.json → 主題導覽及考綱映射資料

knowledge/rules/stairs.json → 四款表列規則

src/index.template.html＋lib/geometry.mjs → scripts/build.mjs → dist/index.html

scripts/serve.mjs只提供已知建置檔案，不接受任意檔案路徑。修改來源後，重新整理即可讀取新建置內容。輸出可以直接以file方式開啟，不依賴外部CDN。

## 知識發布

官方來源 → 查證登錄 → 教學草稿 → 專業審核 → 發布。現階段專業審核尚未完成，畫面持續標示原型。

說明五的文字與部分門檻目前仍在HTML範本內，並不是所有法規規則都已完全資料化。修法時需連同範本核對；後續完整資料化列入交接。

## 正式應用的預留邊界

- 前端與服務：預計Next.js＋TypeScript；待正式切換時建立新的鎖檔與測試。
- 法規與教材：不可變條文版本、教材修訂版與引用依賴。
- 個人資料：帳號授權、作答與收藏獨立於公共知識。
- 持久化：database/model.sql是PostgreSQL結構草稿，不能視為已驗證遷移。
- 來源附件：受授權與存取條件管理，未納入Git。

## 驗證

npm run validate檢查來源引用、考綱關聯、可攜路徑及建置連結。npm test檢查幾何邊界、資料注入、待核對狀態與建置一致性。GitHub Actions設有Windows與Linux矩陣；遠端執行結果以實際工作流程為準。
