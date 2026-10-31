export const maskShade = (strength: number): string => {
  const level = Math.round(Math.min(1, Math.max(0, strength)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${level}${level}${level}`;
};

export const maskIdFrom = (prefix: string, reactId: string): string =>
  `${prefix}-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
