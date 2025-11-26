export function parsePrice(text: string): number {
    const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '.');
    const value = Number(cleaned);
  
    if (Number.isNaN(value)) {
      throw new Error(`Could not parse price from: "${text}"`);
    }
  
    return value;
  }
  