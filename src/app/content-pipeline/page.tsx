'use client';

import { useState } from 'react';
import { ContentRequest, GeneratedContent } from '@/lib/content-pipeline/types';
import { generateCSV, downloadCSV } from '@/lib/content-pipeline/csv-export';

const TONES = ['professional', 'casual', 'expert', 'friendly'] as const;
const FORMATS = ['article', 'social-post', 'email', 'linkedin', 'twitter'] as const;
const LENGTHS = ['short', 'medium', 'long'] as const;

type ContentFormState = Omit<ContentRequest, 'keywords'> & { keywords: string };

export default function ContentPipelinePage() {
  const [formData, setFormData] = useState<ContentFormState>({
    topic: '',
    targetAudience: '',
    tone: 'professional',
    format: 'article',
    length: 'medium',
    keywords: '',
    cta: '',
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : undefined,
      };

      const response = await fetch('/api/content-pipeline/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      const content = result.data;
      setGeneratedContent(content);
      setHistory(prev => [content, ...prev].slice(0, 50));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (history.length === 0) return;
    downloadCSV(history, `content-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-bold">Content Pipeline</h1>
        <p className="text-muted-foreground mt-1">Generate SEO-optimized content with AI</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Topic *</label>
            <input
              type="text"
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="e.g., AI in Healthcare"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience *</label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="e.g., Healthcare executives"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tone *</label>
            <select
              value={formData.tone}
              onChange={e => setFormData({ ...formData, tone: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Format *</label>
            <select
              value={formData.format}
              onChange={e => setFormData({ ...formData, format: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Length *</label>
            <select
              value={formData.length}
              onChange={e => setFormData({ ...formData, length: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="SEO, keywords, here"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Call to Action</label>
            <input
              type="text"
              value={formData.cta}
              onChange={e => setFormData({ ...formData, cta: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Sign up for our newsletter"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>

      {generatedContent && (
        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{generatedContent.title}</h2>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span>{generatedContent.wordCount} words</span>
                <span>{generatedContent.readingTime} min read</span>
                <span>SEO: {generatedContent.seoScore}/100</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(generatedContent.body)}
              className="px-4 py-2 border rounded"
            >
              Copy
            </button>
          </div>
          <div className="prose max-w-none whitespace-pre-wrap">{generatedContent.body}</div>
          {generatedContent.metaDescription && (
            <div className="text-sm text-muted-foreground border-t pt-4">
              <strong>Meta Description:</strong> {generatedContent.metaDescription}
            </div>
          )}
          {generatedContent.hashtags?.length && (
            <div className="flex gap-2 flex-wrap">
              {generatedContent.hashtags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-muted rounded text-sm">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">History ({history.length})</h2>
            <button onClick={handleExport} className="px-4 py-2 border rounded">
              Export CSV
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.map(item => (
              <div key={item.id} className="p-4 border rounded hover:shadow-md cursor-pointer">
                <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                  <span>{item.format}</span>
                  <span>{item.tone}</span>
                  <span>{item.length}</span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                  <span>{item.wordCount}w</span>
                  <span>{item.readingTime}min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}