import { build } from '../lib/build.mjs';
const files = await build();
console.log('建置完成：dist/，共 ' + files.size + ' 個檔案。');
