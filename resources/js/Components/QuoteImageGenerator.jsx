import { useState, useRef, useEffect } from 'react';
import { Download, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';

const templates = [
    {
        id: 'modern',
        name: 'Modern',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
    },
    {
        id: 'sunset',
        name: 'Sunset',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        textColor: '#ffffff',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        textColor: '#ffffff',
    },
    {
        id: 'forest',
        name: 'Forest',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        textColor: '#1a202c',
    },
    {
        id: 'fire',
        name: 'Fire',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        textColor: '#1a202c',
    },
    {
        id: 'midnight',
        name: 'Midnight',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
        textColor: '#ffffff',
    },
    {
        id: 'peach',
        name: 'Peach',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        textColor: '#1a202c',
    },
    {
        id: 'lavender',
        name: 'Lavender',
        gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        textColor: '#1a202c',
    },
];

export default function QuoteImageGenerator({ quote, colorScheme, onDownload }) {
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showWatermark, setShowWatermark] = useState(true);
    const canvasRef = useRef(null);

    const handleDownload = async () => {
        if (!canvasRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(canvasRef.current, {
                scale: 2,
                backgroundColor: null,
                logging: false,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.download = `quote-${quote.id}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Track successful download/share
            if (onDownload) onDownload();
        } catch (error) {
            console.error('Error generating image:', error);
            // Show error message in UI instead of alert
            if (onError) {
                onError('Failed to generate image. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Template Selection */}
            <div>
                <div className="flex items-center gap-1.5 mb-2">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Choose Template
                    </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template)}
                            className={`relative h-12 sm:h-14 rounded-lg overflow-hidden transition-all ${selectedTemplate.id === template.id
                                ? 'ring-2 sm:ring-3 ring-[#5D41E6] ring-offset-1 sm:ring-offset-2 dark:ring-offset-gray-800'
                                : 'hover:scale-105'
                                }`}
                            style={{ background: template.gradient }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span
                                    className="text-[10px] sm:text-xs font-semibold"
                                    style={{ color: template.textColor }}
                                >
                                    {template.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Watermark Toggle */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Include Watermark
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Help others discover quotes
                    </p>
                </div>
                <button
                    onClick={() => setShowWatermark(!showWatermark)}
                    className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${showWatermark ? 'bg-[#5D41E6]' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                >
                    <span
                        className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${showWatermark ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            {/* Preview */}
            <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                </label>
                <div className="relative">
                    <div
                        ref={canvasRef}
                        className="w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl flex items-center justify-center p-6 sm:p-8 md:p-12"
                        style={{ background: selectedTemplate.gradient }}
                    >
                        <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
                            {/* Quote Mark */}
                            <div
                                className="text-4xl sm:text-5xl md:text-6xl font-serif opacity-30"
                                style={{ color: selectedTemplate.textColor }}
                            >
                                "
                            </div>

                            {/* Quote Content */}
                            <p
                                className="text-base sm:text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed"
                                style={{ color: selectedTemplate.textColor }}
                            >
                                {quote.content}
                            </p>

                            {/* Author */}
                            {quote.author && (
                                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
                                    <div
                                        className="h-0.5 w-8 sm:w-10 md:w-12"
                                        style={{ backgroundColor: selectedTemplate.textColor }}
                                    />
                                    <p
                                        className="text-sm sm:text-base md:text-xl font-semibold"
                                        style={{ color: selectedTemplate.textColor }}
                                    >
                                        {quote.author}
                                    </p>
                                    <div
                                        className="h-0.5 w-8 sm:w-10 md:w-12"
                                        style={{ backgroundColor: selectedTemplate.textColor }}
                                    />
                                </div>
                            )}

                            {/* Watermark */}
                            {showWatermark && (
                                <div className="mt-6 sm:mt-8 md:mt-12">
                                    <p
                                        className="text-xs sm:text-sm font-semibold opacity-60"
                                        style={{ color: selectedTemplate.textColor }}
                                    >
                                        QuotesHub.info
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5D41E6] hover:bg-[#4b33c2] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        Download Image
                    </>
                )}
            </button>

            {/* Info */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Downloaded as high-quality PNG, perfect for sharing!
                </p>
            </div>
        </div>
    );
}
