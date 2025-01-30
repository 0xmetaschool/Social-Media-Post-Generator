'use client';

import { useState } from 'react';

const TONE_OPTIONS = [
  'Professional',
  'Casual',
  'Friendly',
  'Humorous',
  'Formal',
  'Informative',
  'Persuasive',
  'Enthusiastic'
];

export default function GeneratorPage() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('Professional');
  const [wordLimit, setWordLimit] = useState(250);
  const [makeThread, setMakeThread] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [postsToGenerate, setPostsToGenerate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          platform,
          tone,
          wordLimit,
          makeThread,
          includeHashtags,
          includeEmoji,
          postsToGenerate,
        }),
      });

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#17179' }}>
      <div className="py-20 px-4" style={{ backgroundColor: '#17179' }}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: '#17179', borderColor: '#4cb4b' }}>
            <div>
              <label htmlFor="description" className="block text-lg font-medium mb-3 text-black" style={{ color: '#000000' }}>
                What would you like to post about?
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 text-black"
                style={{ 
                  backgroundColor: '#17179', 
                  color: '#000000', 
                  borderColor: '#4cb4b', 
                  caretColor: '#000000'
                }}
                rows={4}
                placeholder="Enter your post topic or description..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="platform" className="block text-lg font-medium mb-3 text-black">
                  Platform
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 text-black"
                  style={{ backgroundColor: '#ffffff', borderColor: '#4cb4b' }}
                >
                  <option value="twitter">X (Twitter)</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-lg font-medium mb-3 text-black">
                  Tone of Voice
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 text-black"
                  style={{ backgroundColor: '#ffffff', borderColor: '#4cb4b' }}
                >
                  {TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platform === 'linkedin' && (
                <div>
                  <label htmlFor="wordLimit" className="block text-lg font-medium mb-3 text-black">
                    Approximate Words
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      id="wordLimit"
                      min="10"
                      max="2500"
                      value={wordLimit}
                      onChange={(e) => setWordLimit(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{ 
                        backgroundColor: '#17179',
                        background: 'linear-gradient(to right, #4cb4b 0%, #4cb4b ' + (wordLimit/2500*100) + '%, #b5b5b3 ' + (wordLimit/2500*100) + '%, #b5b5b3 100%)',
                        height: '4px',
                        border: '1px solid #4cb4b'
                      }}
                    />
                    <span className="font-medium min-w-[3rem]" style={{ color: '#000000' }}>{wordLimit}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="postsToGenerate" className="block text-lg font-medium mb-3 text-black">
                  Number of Variations
                </label>
                <select
                  id="postsToGenerate"
                  value={postsToGenerate}
                  onChange={(e) => setPostsToGenerate(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 text-black"
                  style={{ backgroundColor: '#ffffff', borderColor: '#4cb4b' }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} post{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {platform === 'twitter' && (
                <div className="flex items-center space-x-3">
                  <label htmlFor="makeThread" className="text-lg font-medium text-black">
                    Create Thread?
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="makeThread"
                      checked={makeThread}
                      onChange={(e) => setMakeThread(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" 
                      style={{ 
                        backgroundColor: makeThread ? '#4cb4b' : '#b5b5b3',
                        borderColor: '#000000',
                        border: '1px solid #000000'
                      }}></div>
                  </label>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <label htmlFor="includeHashtags" className="text-lg font-medium text-black">
                  Add Hashtags
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="includeHashtags"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" 
                    style={{ 
                      backgroundColor: includeHashtags ? '#4cb4b' : '#b5b5b3',
                      borderColor: '#000000',
                      border: '1px solid #000000'
                    }}></div>
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <label htmlFor="includeEmoji" className="text-lg font-medium text-black">
                  Add Emojis
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="includeEmoji"
                    checked={includeEmoji}
                    onChange={(e) => setIncludeEmoji(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" 
                    style={{ 
                      backgroundColor: includeEmoji ? '#4cb4b' : '#b5b5b3',
                      borderColor: '#000000',
                      border: '1px solid #000000'
                    }}></div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-black"
              style={{ backgroundColor: '#4cb4b', color: '#000000' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                  Generating...
                </div>
              ) : (
                'Generate Posts'
              )}
            </button>
          </form>

          {generatedContent && (
            <div className="mt-8 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: '#17179', borderColor: '#4cb4b' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-black">
                  Generated Post{postsToGenerate > 1 ? 's' : ''}
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-black"
                  style={{ backgroundColor: '#4cb4b', color: '#000000' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-6 rounded-xl" style={{ backgroundColor: '#17179', borderColor: '#4cb4b' }}>
                <p className="whitespace-pre-wrap leading-relaxed select-all text-black">
                  {generatedContent}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
