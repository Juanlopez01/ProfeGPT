export interface Section {
  title: string;
  content: string;
  isMermaid?: boolean;
}

export function parseResponse(response: string): Section[] {
  const lines = response.split('\n');
  const sections: Section[] = [];

  let currentTitle = '';
  let currentContent: string[] = [];
  let isMermaid = false;

  const flush = () => {
    if (!currentTitle) return;
    sections.push({
      title: currentTitle,
      content: isMermaid
        ? currentContent
            .filter(line =>
                !line.trim().startsWith('```') &&
                line.trim() !== 'mermaid' &&
                line.trim() !== ''
            )
            .join('\n')
            .trim()
        : currentContent.join('\n').trim(),

      ...(isMermaid ? { isMermaid: true } : {})
    });
    currentContent = [];
    currentTitle = '';
    isMermaid = false;
  };

  for (const line of lines) {
    const sectionTitleMatch = line.match(/^\d+\.\s+(.*)/);
    if (sectionTitleMatch) {
      flush();
      currentTitle = sectionTitleMatch[1].trim();
      continue;
    }
    if (currentTitle.toLowerCase().includes('mapa conceptual') && line.trim().startsWith('graph')) {
      isMermaid = true;
    }
    currentContent.push(line);
  }

  flush();
  return sections;
}
