const NARROW = new Set([...'iljtfrI.,:;!| ']);
const WIDE = new Set([...'WMmw@']);

export const textWidth = (label: string, fontSize: number): number =>
  [...label].reduce((sum, char) => {
    if (NARROW.has(char)) {
      return sum + 0.32;
    }
    if (WIDE.has(char)) {
      return sum + 0.95;
    }
    return sum + (char === char.toUpperCase() && char !== char.toLowerCase() ? 0.72 : 0.6);
  }, 0) * fontSize;
