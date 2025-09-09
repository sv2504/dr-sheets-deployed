
import React, { useState } from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { XIcon } from './icons/XIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

export const ShareButtons: React.FC = () => {
    const [linkCopied, setLinkCopied] = useState(false);
    // In a real application, this URL would be dynamic.
    const shareUrl = "https://dr-sheets.com"; 
    const shareTitle = "Dr. Sheets: Your AI-Powered Google Sheets Formula Expert";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        });
    };

    return (
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center animate-fade-in">
            <h3 className="text-base font-semibold text-slate-600">Enjoy this tool? Share it!</h3>
            <div className="mt-3 flex justify-center items-center space-x-4">
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-700 transition-colors" aria-label="Share on LinkedIn">
                    <LinkedInIcon className="w-6 h-6" />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors" aria-label="Share on X">
                    <XIcon className="w-6 h-6" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors" aria-label="Share on Facebook">
                    <FacebookIcon className="w-6 h-6" />
                </a>
                <button onClick={handleCopyLink} className="relative flex items-center justify-center p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors" aria-label="Copy link">
                    {linkCopied ? (
                        <span className="text-xs font-sans px-1">Copied!</span>
                    ) : (
                        <ClipboardIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};
