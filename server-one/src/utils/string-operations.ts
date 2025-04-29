

export const cleanDoubleQuotes = (char: string): string => {
  return char.replace(/"/g, "'");
};
