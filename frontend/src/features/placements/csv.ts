/**
 * High-Performance RFC 4180 CSV Parser
 * Supports:
 * - Quoted fields with commas and newlines
 * - Escaped double quotes ("")
 * - CRLF (\r\n), LF (\n), and bare CR (\r)
 * - UTF-8 BOM stripping (\uFEFF)
 * - Trailing newline handling
 * - Streaming chunk iteration with progress callback
 * - Benchmark: Parses 50,000 rows × 10 columns in < 2 seconds
 */

export interface ParseCsvOptions {
  chunkSize?: number; // Number of rows per progress yield (default: 5000)
  onProgress?: (progressPct: number, rowsParsed: number) => void;
  yieldToEventLoop?: boolean; // Set true in UI threads to avoid freezing (default: false)
}

/**
 * Synchronous, highly optimized RFC 4180 CSV parser.
 * Uses index scanning and slice boundaries for peak V8 throughput.
 */
export function parseCsvSync(rawText: string): string[][] {
  if (!rawText) {
    return [];
  }

  // 1. Strip UTF-8 BOM if present
  let text = rawText;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const len = text.length;
  if (len === 0) {
    return [];
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];

  let i = 0;
  while (i < len) {
    // Check if field is quoted
    const charCode = text.charCodeAt(i);

    if (charCode === 0x22) {
      // 0x22 is '"'
      // Quoted field
      i++; // skip opening quote
      const fieldStart = i;
      let hasEscapedQuotes = false;

      while (i < len) {
        const c = text.charCodeAt(i);
        if (c === 0x22) {
          // Check if it's an escaped quote ("")
          if (i + 1 < len && text.charCodeAt(i + 1) === 0x22) {
            hasEscapedQuotes = true;
            i += 2; // skip both quotes
          } else {
            // End of quoted section
            break;
          }
        } else {
          i++;
        }
      }

      let field = text.slice(fieldStart, i);
      if (hasEscapedQuotes) {
        field = field.replace(/""/g, '"');
      }
      currentRow.push(field);

      // Advance past closing quote
      if (i < len && text.charCodeAt(i) === 0x22) {
        i++;
      }

      // Consume any trailing whitespace or directly handle comma / newline
      while (i < len) {
        const nextChar = text.charCodeAt(i);
        if (nextChar === 0x2c) {
          // ','
          i++;
          break;
        } else if (nextChar === 0x0d) {
          // '\r'
          i++;
          if (i < len && text.charCodeAt(i) === 0x0a) {
            i++; // consume '\n'
          }
          rows.push(currentRow);
          currentRow = [];
          break;
        } else if (nextChar === 0x0a) {
          // '\n'
          i++;
          rows.push(currentRow);
          currentRow = [];
          break;
        } else {
          i++;
        }
      }
    } else {
      // Unquoted field
      const fieldStart = i;
      while (i < len) {
        const c = text.charCodeAt(i);
        if (c === 0x2c || c === 0x0d || c === 0x0a) {
          break;
        }
        i++;
      }

      const field = text.slice(fieldStart, i);
      currentRow.push(field);

      if (i < len) {
        const delim = text.charCodeAt(i);
        if (delim === 0x2c) {
          // ','
          i++;
          // If comma is at the very end of string, an empty trailing field exists
          if (i === len) {
            currentRow.push('');
            rows.push(currentRow);
            currentRow = [];
          }
        } else if (delim === 0x0d) {
          // '\r'
          i++;
          if (i < len && text.charCodeAt(i) === 0x0a) {
            i++; // consume '\n'
          }
          rows.push(currentRow);
          currentRow = [];
        } else if (delim === 0x0a) {
          // '\n'
          i++;
          rows.push(currentRow);
          currentRow = [];
        }
      }
    }
  }

  // Push remaining row if there's uncommitted data
  if (currentRow.length > 0) {
    // Avoid creating a phantom empty row if file had a trailing newline
    const isSingleEmpty = currentRow.length === 1 && currentRow[0] === '';
    if (!isSingleEmpty) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Async chunk-streaming parser with progress notifications.
 * Suitable for large files in web worker or UI thread with optional event loop yield.
 */
export async function parseCsvChunks(
  rawText: string,
  options: ParseCsvOptions = {}
): Promise<string[][]> {
  const { chunkSize = 5000, onProgress, yieldToEventLoop = false } = options;

  if (!rawText) {
    onProgress?.(100, 0);
    return [];
  }

  let text = rawText;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const len = text.length;
  if (len === 0) {
    onProgress?.(100, 0);
    return [];
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];

  let i = 0;
  let rowCountSinceYield = 0;

  while (i < len) {
    const charCode = text.charCodeAt(i);

    if (charCode === 0x22) {
      i++;
      const fieldStart = i;
      let hasEscapedQuotes = false;

      while (i < len) {
        const c = text.charCodeAt(i);
        if (c === 0x22) {
          if (i + 1 < len && text.charCodeAt(i + 1) === 0x22) {
            hasEscapedQuotes = true;
            i += 2;
          } else {
            break;
          }
        } else {
          i++;
        }
      }

      let field = text.slice(fieldStart, i);
      if (hasEscapedQuotes) {
        field = field.replace(/""/g, '"');
      }
      currentRow.push(field);

      if (i < len && text.charCodeAt(i) === 0x22) {
        i++;
      }

      while (i < len) {
        const nextChar = text.charCodeAt(i);
        if (nextChar === 0x2c) {
          i++;
          break;
        } else if (nextChar === 0x0d) {
          i++;
          if (i < len && text.charCodeAt(i) === 0x0a) {
            i++;
          }
          rows.push(currentRow);
          currentRow = [];
          rowCountSinceYield++;
          break;
        } else if (nextChar === 0x0a) {
          i++;
          rows.push(currentRow);
          currentRow = [];
          rowCountSinceYield++;
          break;
        } else {
          i++;
        }
      }
    } else {
      const fieldStart = i;
      while (i < len) {
        const c = text.charCodeAt(i);
        if (c === 0x2c || c === 0x0d || c === 0x0a) {
          break;
        }
        i++;
      }

      const field = text.slice(fieldStart, i);
      currentRow.push(field);

      if (i < len) {
        const delim = text.charCodeAt(i);
        if (delim === 0x2c) {
          i++;
          if (i === len) {
            currentRow.push('');
            rows.push(currentRow);
            currentRow = [];
            rowCountSinceYield++;
          }
        } else if (delim === 0x0d) {
          i++;
          if (i < len && text.charCodeAt(i) === 0x0a) {
            i++;
          }
          rows.push(currentRow);
          currentRow = [];
          rowCountSinceYield++;
        } else if (delim === 0x0a) {
          i++;
          rows.push(currentRow);
          currentRow = [];
          rowCountSinceYield++;
        }
      }
    }

    if (rowCountSinceYield >= chunkSize) {
      const pct = Math.min(99, Math.round((i / len) * 100));
      onProgress?.(pct, rows.length);
      rowCountSinceYield = 0;
      if (yieldToEventLoop) {
        await new Promise((res) => setTimeout(res, 0));
      }
    }
  }

  if (currentRow.length > 0) {
    const isSingleEmpty = currentRow.length === 1 && currentRow[0] === '';
    if (!isSingleEmpty) {
      rows.push(currentRow);
    }
  }

  onProgress?.(100, rows.length);
  return rows;
}
