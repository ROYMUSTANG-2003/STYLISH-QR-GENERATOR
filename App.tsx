import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Github, Share2, Download, Link2 } from 'lucide-react';

// Updated background options with anime-style images
const backgrounds = {
  anime: [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560972550-aba3456b5564?auto=format&fit=crop&w=800&q=80',
  ],
  cartoon: [
    'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550747545-c896b5f89ff7?auto=format&fit=crop&w=800&q=80',
  ]
};

// Updated QR code styles for artistic integration
const qrStyles = {
  anime: {
    fgColor: '#000000',
    bgColor: 'rgba(255, 255, 255, 0)',
  },
  cartoon: {
    fgColor: '#000000',
    bgColor: 'rgba(255, 255, 255, 0)',
  }
};

function App() {
  const [input, setInput] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedStyle, setSelectedStyle] = useState('anime');
  const [selectedBackground, setSelectedBackground] = useState(backgrounds.anime[0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGenerate = () => {
    if (input.trim()) {
      setQrValue(input);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const handleShare = async () => {
    if (!qrValue) return;

    try {
      const svgElement = document.querySelector('.qr-code-container');
      if (!svgElement) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = svgElement.clientWidth;
        canvas.height = svgElement.clientHeight;
        
        // Draw background
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw QR code
        const qrElement = document.querySelector('.qr-code-svg');
        if (qrElement) {
          const qrData = new XMLSerializer().serializeToString(qrElement as Node);
          const qrImg = new Image();
          qrImg.src = 'data:image/svg+xml;base64,' + btoa(qrData);
          
          await new Promise((resolve) => {
            qrImg.onload = resolve;
          });
          
          ctx?.drawImage(qrImg, (canvas.width - 200) / 2, (canvas.height - 200) / 2);
        }

        if (navigator.share) {
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
          const file = new File([blob], 'qr-code.png', { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'QR Code',
            text: `QR Code for: ${qrValue}`,
          });
        } else {
          await navigator.clipboard.writeText(qrValue);
          alert('Link copied to clipboard!');
        }
      };
      
      img.src = selectedBackground;
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    const container = document.querySelector('.qr-code-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Draw background
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      const qrElement = document.querySelector('.qr-code-svg');
      if (qrElement) {
        const qrData = new XMLSerializer().serializeToString(qrElement as Node);
        const qrImg = new Image();
        qrImg.src = 'data:image/svg+xml;base64,' + btoa(qrData);
        
        qrImg.onload = () => {
          ctx?.drawImage(qrImg, (canvas.width - 200) / 2, (canvas.height - 200) / 2);
          
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'styled-qrcode.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
      }
    };
    
    img.src = selectedBackground;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleStyleChange = (style: 'anime' | 'cartoon') => {
    setSelectedStyle(style);
    setSelectedBackground(backgrounds[style][0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Glowing cursor effect */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          backgroundImage: `radial-gradient(2px 2px at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.5), transparent)`,
          backgroundSize: '4px 4px',
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
            Stylish QR Code Generator
          </h1>
          <p className="text-blue-200 text-lg">
            Generate beautiful QR codes with anime and cartoon backgrounds
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-2xl">
          <div className="space-y-4">
            {/* Style selector */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => handleStyleChange('anime')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStyle === 'anime'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-blue-200 hover:bg-white/10'
                }`}
              >
                Anime Style
              </button>
              <button
                onClick={() => handleStyleChange('cartoon')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStyle === 'cartoon'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-blue-200 hover:bg-white/10'
                }`}
              >
                Cartoon Style
              </button>
            </div>

            {/* Background selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {backgrounds[selectedStyle].map((bg, index) => (
                <button
                  key={bg}
                  onClick={() => setSelectedBackground(bg)}
                  className={`relative rounded-lg overflow-hidden h-20 ${
                    selectedBackground === bg ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={bg}
                    alt={`Background ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="input" className="block text-sm font-medium text-blue-200">
                Enter text or URL
              </label>
              <input
                id="input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a name, place, or web link..."
                className="w-full px-4 py-2 bg-white/5 border border-blue-400/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-blue-200/50"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Generate QR Code</span>
            </button>

            {qrValue && (
              <div className="mt-8 flex flex-col items-center space-y-4">
                <div 
                  className="qr-code-container relative w-[400px] h-[400px] rounded-xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105"
                  style={{
                    backgroundImage: `url(${selectedBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Artistic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30" />
                  
                  {/* Decorative elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-30" />
                    <div className="absolute -left-12 -top-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
                  </div>

                  {/* QR Code wrapper */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* QR Code with enhanced styling */}
                      <div className="relative z-10">
                        <QRCodeSVG
                          value={qrValue}
                          size={280}
                          level="H"
                          includeMargin={true}
                          className="qr-code-svg mix-blend-multiply"
                          fgColor={qrStyles[selectedStyle].fgColor}
                          bgColor={qrStyles[selectedStyle].bgColor}
                        />
                      </div>
                      
                      {/* Decorative frame */}
                      <div className="absolute inset-0 border-8 border-white/10 rounded-lg backdrop-blur-sm" />
                    </div>
                  </div>

                  {/* Artistic elements overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 w-24 h-24 border-t-2 border-l-2 border-white/20" />
                    <div className="absolute bottom-4 right-4 w-24 h-24 border-b-2 border-r-2 border-white/20" />
                  </div>
                </div>

                <p className="text-sm text-blue-200">Scan this QR code to access: {qrValue}</p>
                
                {/* Share buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-blue-200/60">
          <div className="flex items-center justify-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
          <p className="mt-2 text-sm">
            Built with React and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;