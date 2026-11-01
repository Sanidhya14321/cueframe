export const wrapLine = (
  line: string,
  limit: number,
  measure: (text: string) => number,
): string[] => {
  const rows: string[] = [];
  let row = '';
  for (const word of line.split(' ')) {
    const candidate = row === '' ? word : `${row} ${word}`;
    if (row !== '' && measure(candidate) > limit) {
      rows.push(row);
      row = word;
    } else {
      row = candidate;
    }
  }
  return [...rows, row];
};
