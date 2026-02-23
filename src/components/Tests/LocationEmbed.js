import React, { useState } from 'react';
import { MapPin, Code, Copy, CheckCircle2, Search } from 'lucide-react';

export default function MapsEmbedGenerator() {
  const [input, setInput] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [inputType, setInputType] = useState('name'); // 'name' or 'link'

  const generateEmbedFromName = (locationName) => {
    // Google Maps allows embedding with q parameter (no API key needed!)
    const encodedLocation = encodeURIComponent(locationName);
    const embedUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    
    const iframeCode = `<iframe src="${embedUrl}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    
    return iframeCode;
  };

  const generateEmbedFromLink = async (link) => {
    let urlToProcess = link.trim();
    
    // If it's a shortened link, try to resolve it
    if (urlToProcess.includes('goo.gl') || urlToProcess.includes('maps.app.goo.gl')) {
      try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(urlToProcess)}`);
        const data = await response.json();
        
        // Try to find the redirect URL
        const match = data.contents.match(/https:\/\/www\.google\.com\/maps[^"'\s<>]*/);
        if (match) {
          urlToProcess = match[0];
        }
      } catch (err) {
        console.log('Could not resolve shortened URL');
      }
    }

    let query = '';
    
    // Extract place name from URL
    const placeMatch = urlToProcess.match(/\/place\/([^\/\?]+)/);
    if (placeMatch) {
      query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    } else {
      // Extract coordinates
      const coordMatch = urlToProcess.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        query = `${coordMatch[1]},${coordMatch[2]}`;
      } else {
        throw new Error('Could not extract location from URL');
      }
    }

    return generateEmbedFromName(query);
  };

  const generateEmbed = async () => {
    setError('');
    setEmbedCode('');
    setLoading(true);

    try {
      const trimmedInput = input.trim();
      
      if (!trimmedInput) {
        throw new Error('Please enter a location name or URL');
      }

      let code = '';
      
      // Check if input is a URL
      if (trimmedInput.startsWith('http://') || trimmedInput.startsWith('https://') || trimmedInput.includes('goo.gl')) {
        code = await generateEmbedFromLink(trimmedInput);
      } else {
        // Treat as location name
        code = generateEmbedFromName(trimmedInput);
      }
      
      setEmbedCode(code);
    } catch (err) {
      setError(err.message || 'Failed to generate embed code. Please check your input and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateEmbed();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <MapPin className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Google Maps Embed Generator</h1>
              <p className="text-gray-600">No API key needed - 100% free!</p>
            </div>
          </div>

          {/* Input Type Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputType('name')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                inputType === 'name'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Search className="inline mr-2" size={16} />
              Location Name
            </button>
            <button
              onClick={() => setInputType('link')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                inputType === 'link'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Code className="inline mr-2" size={16} />
              Share Link
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputType === 'name' ? 'Location Name or Address' : 'Google Maps Share Link'}
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  inputType === 'name'
                    ? 'e.g., 37 Military Hospital, Accra or Eiffel Tower, Paris'
                    : 'https://maps.app.goo.gl/...'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                {inputType === 'name'
                  ? 'Enter any place name, address, or landmark'
                  : 'Paste a Google Maps share link (short or full URL)'}
              </p>
            </div>

            <button
              onClick={generateEmbed}
              disabled={!input || loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Code size={20} />
              {loading ? 'Generating...' : 'Generate Embed Code'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Output Section */}
          {embedCode && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Embed Code
                </label>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium text-sm transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <code className="text-sm text-gray-800 break-all">
                  {embedCode}
                </code>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div 
                  className="bg-gray-100 rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: embedCode }}
                />
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">✨ Features:</h3>
            <ul className="space-y-1 text-sm text-green-800">
              <li>✓ No API key required - completely free!</li>
              <li>✓ Works with location names, addresses, and landmarks</li>
              <li>✓ Supports Google Maps share links</li>
              <li>✓ Instant preview of the embedded map</li>
              <li>✓ One-click copy to clipboard</li>
            </ul>
          </div>

          {/* Examples */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Example Inputs:</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <strong>Location names:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• "37 Military Hospital, Accra"</li>
                  <li>• "Times Square, New York"</li>
                  <li>• "Eiffel Tower"</li>
                </ul>
              </div>
              <div className="mt-2">
                <strong>Share links:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• https://maps.app.goo.gl/...</li>
                  <li>• https://www.google.com/maps/place/...</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}