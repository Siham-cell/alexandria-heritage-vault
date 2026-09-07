/**
 * AI enrichment service for heritage items.
 *
 * MOCK IMPLEMENTATION — Replace with a real AI vision/language model
 * integration. The real implementation should:
 *   1. Send the file (or its preview) to a vision model
 *   2. Receive suggested tags, estimated era, and a description
 *   3. Return the results for the user to accept, edit, or reject
 *
 * IMPORTANT PRINCIPLE:
 * "AI can interpret heritage. AI must never silently rewrite the original."
 * AI suggestions are NEVER automatically treated as historical facts.
 * The user must explicitly accept, edit, or reject every suggestion.
 */

export interface AiEnrichmentResult {
  estimatedEra: string;
  suggestedTags: string[];
  description: string;
  note: string;
}

/**
 * Generates AI enrichment suggestions for a heritage item.
 * In production: call a vision model with the file preview.
 */
export async function generateAiEnrichment(params: {
  fileName: string;
  heritageType: string;
  title: string;
  year?: number;
}): Promise<AiEnrichmentResult> {
  await simulateAsyncDelay(1000);

  const eraGuess = guessEra(params.year);
  const tags = generateTags(params.heritageType, params.title);
  const description = generateDescription(params.heritageType, params.title, eraGuess);

  return {
    estimatedEra: eraGuess,
    suggestedTags: tags,
    description,
    note: 'AI suggestions are never automatically treated as historical facts.',
  };
}

function guessEra(year?: number): string {
  if (!year) return 'Unknown era';
  if (year < 1960) return '1940s–1950s';
  if (year < 1970) return '1960s–1970s';
  if (year < 1980) return '1970s–1980s';
  if (year < 1990) return '1980s–1990s';
  if (year < 2000) return '1990s–2000s';
  return '2000s–2010s';
}

function generateTags(type: string, title: string): string[] {
  const baseTags: Record<string, string[]> = {
    Photograph: ['Photograph', 'Family', 'Heritage'],
    Audio: ['Voice Recording', 'Audio', 'Memory'],
    Document: ['Document', 'Handwritten', 'Personal'],
    Video: ['Video', 'Family', 'Memory'],
    Letter: ['Letter', 'Handwritten', 'Correspondence'],
  };
  const titleTag = title.split(' ')[0];
  const tags = baseTags[type] || ['Heritage', 'Family'];
  return [titleTag, ...tags].slice(0, 4);
}

function generateDescription(type: string, title: string, era: string): string {
  const typeLabels: Record<string, string> = {
    Photograph: 'A family photograph',
    Audio: 'An audio recording',
    Document: 'A document',
    Video: 'A video recording',
    Letter: 'A handwritten letter',
  };
  const label = typeLabels[type] || 'A heritage item';
  return `${label} titled "${title}". Based on visual analysis, the content appears to originate from the ${era} period. The item shows characteristics consistent with family heritage preservation.`;
}

function simulateAsyncDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
