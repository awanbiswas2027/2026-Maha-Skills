import { describe, expect, it } from 'vitest';
import { parseCsvChunks, parseCsvSync } from '../csv';

describe('CSV Parser (RFC 4180 Compliance)', () => {
  it('handles empty input gracefully', () => {
    expect(parseCsvSync('')).toEqual([]);
    expect(parseCsvSync('   ')).toEqual([['   ']]);
  });

  it('strips UTF-8 BOM character', () => {
    const withBom = '\uFEFFcol1,col2\r\nval1,val2';
    const result = parseCsvSync(withBom);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(['col1', 'col2']);
    expect(result[1]).toEqual(['val1', 'val2']);
  });

  it('parses standard unquoted CSV with CRLF and LF', () => {
    const crlf = 'a,b,c\r\n1,2,3\r\n4,5,6';
    expect(parseCsvSync(crlf)).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]);

    const lf = 'a,b,c\n1,2,3\n4,5,6';
    expect(parseCsvSync(lf)).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]);
  });

  it('handles trailing newlines without phantom empty rows', () => {
    const csvWithTrailingCrlf = 'colA,colB\r\nvalA,valB\r\n';
    expect(parseCsvSync(csvWithTrailingCrlf)).toEqual([
      ['colA', 'colB'],
      ['valA', 'valB'],
    ]);

    const csvWithTrailingLf = 'colA,colB\nvalA,valB\n';
    expect(parseCsvSync(csvWithTrailingLf)).toEqual([
      ['colA', 'colB'],
      ['valA', 'valB'],
    ]);
  });

  it('parses quoted fields containing commas', () => {
    const csv = 'id,name,address\r\n101,"Doe, John","123 Main St, Apt 4"';
    const result = parseCsvSync(csv);
    expect(result).toHaveLength(2);
    expect(result[1][1]).toBe('Doe, John');
    expect(result[1][2]).toBe('123 Main St, Apt 4');
  });

  it('parses quoted fields containing escaped double quotes', () => {
    const csv = 'id,quote\r\n1,"He said, ""Hello World!"""';
    const result = parseCsvSync(csv);
    expect(result[1][1]).toBe('He said, "Hello World!"');
  });

  it('parses quoted fields with embedded newlines', () => {
    const csv = 'id,notes\r\n1,"Line 1\r\nLine 2\nLine 3"';
    const result = parseCsvSync(csv);
    expect(result).toHaveLength(2);
    expect(result[1][1]).toBe('Line 1\r\nLine 2\nLine 3');
  });

  it('handles empty fields and trailing commas', () => {
    const csv = 'a,,c,\r\n1,,3,';
    const result = parseCsvSync(csv);
    expect(result).toEqual([
      ['a', '', 'c', ''],
      ['1', '', '3', ''],
    ]);
  });

  it('handles empty quotes correctly', () => {
    const csv = 'col1,col2,col3\r\n"",value,""';
    const result = parseCsvSync(csv);
    expect(result[1]).toEqual(['', 'value', '']);
  });

  it('supports asynchronous chunk streaming with progress callbacks', async () => {
    const rows: string[] = ['h1,h2'];
    for (let i = 0; i < 500; i++) {
      rows.push(`val_${i},data_${i}`);
    }
    const csv = rows.join('\r\n');

    const progressUpdates: number[] = [];
    const parsed = await parseCsvChunks(csv, {
      chunkSize: 100,
      onProgress: (pct) => progressUpdates.push(pct),
    });

    expect(parsed).toHaveLength(501);
    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
  });

  it('satisfies performance requirement: parses 50,000 rows × 10 columns in < 2 seconds', () => {
    const rowCount = 50000;
    const colCount = 10;

    // Construct a synthetic 50,000 row CSV in memory
    const header = Array.from({ length: colCount }, (_, idx) => `col_${idx + 1}`).join(',');
    const sampleRow =
      '64charhexhash1234567890abcdef1234567890abcdef1234567890abcdef12,CTS-ELE-01,2026,Y,"Tata Motors, Ltd","Junior Technician, Maintenance",35000.00,4,Pune,Active';

    // Fast array join
    const lines = new Array(rowCount + 1);
    lines[0] = header;
    for (let i = 1; i <= rowCount; i++) {
      lines[i] = sampleRow;
    }
    const fullCsv = lines.join('\r\n');

    const startTime = performance.now();
    const parsed = parseCsvSync(fullCsv);
    const durationMs = performance.now() - startTime;

    console.log(`[50k Benchmark] Parsed 50,000 rows x 10 columns in ${durationMs.toFixed(2)} ms`);

    // Verify row and column counts
    expect(parsed).toHaveLength(50001);
    expect(parsed[0]).toHaveLength(colCount);
    expect(parsed[1]).toHaveLength(colCount);
    expect(parsed[50000][4]).toBe('Tata Motors, Ltd');

    // Vitest SLA verification
    expect(durationMs).toBeLessThan(2000);
  });
});
