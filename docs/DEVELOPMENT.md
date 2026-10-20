# 開發與跨電腦Git流程

## 環境與檢查

Node版本見.node-version，npm依賴以package-lock.json為準。目前原型沒有第三方執行依賴，因此可在不安裝額外框架的情況重建。正式Next.js遷移是後續決策，尚未實作。

```sh
npm ci --ignore-scripts
npm run check
npm run dev
```

修改來源後重新整理畫面。本機服務固定綁定127.0.0.1；可透過程序環境變數PORT改埠號。.env.example是說明範本，程式不會自動讀取.env。

終端機無法啟動HTTP服務時，執行npm run build後直接開啟dist/index.html。瀏覽器收藏保存在該瀏覽器來源的localStorage；file與HTTP、不同電腦之間不會自動同步。

## 同一件工作換電腦

離開前：

```sh
git status -sb
npm run check
git diff --check
git add src lib scripts tests knowledge docs database
git diff --cached --stat
git commit -m "Describe the completed change"
git push -u origin HEAD
```

若修改了根目錄設定或工作流程，也要明確加入那些檔案。未完成的工作可提交在功能分支，並在HANDOFF寫清楚下一步，不把不能工作的內容當正式完成。

接手時：

```sh
git status -sb
git fetch --prune
git switch codex/project-bootstrap
git pull --ff-only
npm ci --ignore-scripts
npm run check
```

首次clone後，本機不存在該功能分支時使用：

```sh
git switch --track origin/codex/project-bootstrap
```

若本機有未提交改動或pull不能快轉，先保留並檢查差異，不自動reset、clean或force push。推送被拒絕時先fetch與檢視提交關係。

## 新工作

```sh
git switch main
git pull --ff-only
git switch -c codex/short-topic
```

以PR審查程式與法規內容。未指定合併策略前，不自動合併或刪分支。

## 每台電腦各自設定

Git作者姓名、公開noreply電子郵件與認證透過自己的Git環境設定，不放入儲存庫。以git config --get user.name及git config --get user.email確認。不要將PAT寫進origin網址、.env或文件。

Windows若出現dubious ownership，先確認資料夾擁有者與執行帳號，不設定全域safe.directory=*。本次專案建立時會把新資料夾擁有者交還目前使用者。

## 不使用同步磁碟搬動.git

每台電腦各自clone，以fetch、commit與push同步。資料庫及來源快照另備份；Git只同步已提交的知識編輯檔、原始碼及選定證據。
