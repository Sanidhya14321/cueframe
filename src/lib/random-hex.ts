export const randomHex = (length: number): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2))), (byte) =>
    byte.toString(16).padStart(2, '0'),
  )
    .join('')
    .slice(0, length);
