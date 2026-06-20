export function joinBlockTexts(blocks: {text: string}[]): string {
  return blocks
    .map(block => block.text.trim())
    .filter(Boolean)
    .join('\n');
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
