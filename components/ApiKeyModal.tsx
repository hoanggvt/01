import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [keyInput, setKeyInput] = useState('');

  // Check if env var exists implicitly (though per prompt guidelines we use user input mainly)
  // The prompt guidelines say "users MUST select their own API key... using window.aistudio...".
  // However, for standard text generation, we usually just need a key. 
  // Given the "Gemini API guidance" section on "API Key Selection" specifically mentions Veo/Imagen requires specific flow.
  // For standard generation, passing the key via a secure input is standard for these demos if env is not set.
  // We will provide a UI for it.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim().length > 0) {
      onSave(keyInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-primary p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Xin chào!</h2>
          <p className="text-blue-100">Vui lòng nhập Gemini API Key để bắt đầu.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
              placeholder="AIzaSy..."
              required
            />
            <p className="mt-2 text-xs text-slate-500">
              API Key của bạn được lưu cục bộ trong phiên làm việc này và không bao giờ được gửi đi đâu khác ngoài Google.
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>Bắt đầu làm việc với Thầy Hoàng</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          
          <div className="mt-4 text-center">
             <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline">
               Chưa có key? Lấy tại Google AI Studio
             </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;