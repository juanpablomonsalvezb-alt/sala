import { GeneratedContent, CSVExportOptions } from './types';

function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function formatDate(date: Date, format: 'ISO' | 'locale'): string {
  return format === 'ISO' ? date.toISOString() : date.toLocaleDateString();
}

export function generateCSV(
  contents: GeneratedContent[],
  options: CSVExportOptions = {
    includeMetadata: true,
    dateFormat: 'ISO',
    delimiter: ',',
  }
): string {
  const delimiter = options.delimiter;
  
  const headers = [
    'ID',
    'Title',
    'Body',
    ...(options.includeMetadata ? ['Meta Description', 'Hashtags', 'Word Count', 'Reading Time (min)', 'SEO Score', 'Created At'] : []),
  ];

  const rows = contents.map((content) => {
    const baseRow = [
      escapeCSVField(content.id),
      escapeCSVField(content.title),
      escapeCSVField(content.body.replace(/\n/g, ' ').substring(0, 500)),
    ];

    if (options.includeMetadata) {
      return [
        ...baseRow,
        escapeCSVField(content.metaDescription || ''),
        escapeCSVField(content.hashtags?.join('; ') || ''),
        content.wordCount.toString(),
        content.readingTime.toString(),
        content.seoScore.toString(),
        formatDate(content.createdAt, options.dateFormat),
      ].join(delimiter);
    }

    return baseRow.join(delimiter);
  });

  return [headers.join(delimiter), ...rows].join('\n');
}

export function downloadCSV(
  contents: GeneratedContent[],
  filename: string = 'content-export.csv',
  options?: CSVExportOptions
): void {
  const csv = generateCSV(contents, options);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}