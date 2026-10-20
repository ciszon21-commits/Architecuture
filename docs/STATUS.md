# 專案狀態

更新：2026-10-20。

## 已具備

- 獨立專案目錄，origin指向使用者指定的Architecuture儲存庫。
- 可操作原型：扶手淨寬、級高級深、款別比較、自編題、搜尋與收藏。
- 考綱八項映射與候選主題缺口。
- 相對路徑、固定Node版本、鎖檔、建置腳本、知識檢查及測試。
- Windows／Linux的CI工作流程已實際執行通過；測試提交與回執見下方。

## 尚未完成

- 目標考試年度、完整考綱原檔及其餘科目對照。
- 歷史條文、官方補充圖例、完整例外與專業審核。
- 說明五門檻完整資料化及來源變動影響追蹤。
- 正式Next.js應用、帳號同步、正式題庫、AI與資料庫遷移。
- 正式部署與可用性、學習成效研究。

## 證據範圍

docs/evidence/prototype-v0.2.json保存遷移前原型70項操作檢查紀錄；這不是目前CI測試數量。本次獨立專案的驗證結果在提交交接時記錄，不自動把歷史通過數據延用為新測試結果。

## 本次本機驗證

Node.js 22.20.0下，離線npm ci、知識驗證、6項Node測試及建置通過；以Git暫存內容匯出至另一位置後再次通過相同檢查。忽略規則及git diff --cached --check通過。這是乾淨來源的可重建測試，尚未在真實第二台電腦執行。瀏覽器對新檔案的file協定存取受到政策阻擋，未宣稱重新通過UI驗證；見[evidence/project-bootstrap.json](evidence/project-bootstrap.json)。

## 遠端驗證

提交f792a9464eb77f79194cdab2f36090606dc17a29的[GitHub Actions](https://github.com/ciszon21-commits/Architecuture/actions/runs/39354169157)已完成，Windows與Linux兩個工作皆成功。詳見[evidence/ci-bootstrap.json](evidence/ci-bootstrap.json)。此結果不等同UI、學習成效或法規專業審核。
