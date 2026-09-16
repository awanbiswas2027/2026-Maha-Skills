const fs = require('fs');
const path = require('path');
const base = path.join(process.cwd(), 'frontend', 'src', 'components', 'data');

let dt = fs.readFileSync(path.join(base, 'DataTable.tsx'), 'utf8');
dt = dt.replace(/error\?: any;/g, 'error?: unknown;');
dt = dt.replace(/const meta = header\.column\.columnDef\.meta as any;/g, 'const meta = header.column.columnDef.meta as Record<string, unknown>;');
dt = dt.replace(/const meta = cell\.column\.columnDef\.meta as any;/g, 'const meta = cell.column.columnDef.meta as Record<string, unknown>;');
dt = dt.replace(/columns\.map\(\(c, j\)/g, 'columns.map((_, j)');
dt = dt.replace(/const \{ t \} = useTranslation\('data'\);\n/g, '');
dt = dt.replace(/import \{ useTranslation \} from 'react-i18next';\n/g, '');
fs.writeFileSync(path.join(base, 'DataTable.tsx'), dt);

let bb = fs.readFileSync(path.join(base, 'BarChartCard.tsx'), 'utf8');
bb = bb.replace(/data: any\[\];/g, 'data: Record<string, unknown>[];');
fs.writeFileSync(path.join(base, 'BarChartCard.tsx'), bb);

let ll = fs.readFileSync(path.join(base, 'LineChartCard.tsx'), 'utf8');
ll = ll.replace(/data: any\[\];/g, 'data: Record<string, unknown>[];');
ll = ll.replace(/, ReferenceLine, Area/g, '');
ll = ll.replace(/, splitPartialSegments, forecastBands, MAX_SERIES/g, ', forecastBands');
ll = ll.replace(/const \{ t \} = useTranslation\('data'\);\n/g, '');
ll = ll.replace(/import \{ useTranslation \} from 'react-i18next';\n/g, '');
fs.writeFileSync(path.join(base, 'LineChartCard.tsx'), ll);

let fb = fs.readFileSync(path.join(base, 'FilterBar.tsx'), 'utf8');
fb = fb.replace(/ side="right"/g, '');
fs.writeFileSync(path.join(base, 'FilterBar.tsx'), fb);

let fc = fs.readFileSync(path.join(base, 'FilterChips.tsx'), 'utf8');
fc = fc.replace(/variant="secondary"/g, 'variant="neutral"');
fs.writeFileSync(path.join(base, 'FilterChips.tsx'), fc);

let pag = fs.readFileSync(path.join(base, 'Pagination.tsx'), 'utf8');
pag = pag.replace(/, type PageSize /g, ' ');
fs.writeFileSync(path.join(base, 'Pagination.tsx'), pag);

let ptt = fs.readFileSync(path.join(base, 'ProgressToTarget.tsx'), 'utf8');
ptt = ptt.replace(/const fillClass[\s\S]*?'bg-success';\n/g, '');
fs.writeFileSync(path.join(base, 'ProgressToTarget.tsx'), ptt);

console.log('Fixed types');
