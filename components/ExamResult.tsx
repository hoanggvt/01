import React, { useEffect, useRef, useState, useMemo } from 'react';

interface ExamResultProps {
  content: string;
  topic: string;
  generatedAt: string | null;
}

const ExamResult: React.FC<ExamResultProps> = ({ content, topic, generatedAt }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Parse the content into 5 parts
  const parts = useMemo(() => {
    if (!content) return [];
    
    // Split by "**PHẦN X" or similar markers
    // We use a regex that matches "**PHẦN" followed by a number
    const splitRegex = /(?=\*\*PHẦN\s+\d+)/i;
    const rawSegments = content.split(splitRegex);
    
    // Filter and map segments to clean them
    return rawSegments
      .filter(seg => seg.trim().length > 10) // Filter out small noise
      .map(seg => {
        // Remove the header line (e.g. "**PHẦN 1 - ...") to get clean content
        // Also remove markdown code blocks if present
        let cleanSeg = seg.replace(/^\*\*PHẦN\s+\d+.*$/m, "").trim();
        
        // Remove markdown fences like ```html or ```csv or ```
        cleanSeg = cleanSeg.replace(/^```[a-z]*\s*/i, "").replace(/```$/g, "").trim();
        
        // Remove leading title if it was duplicated inside the block
        return cleanSeg;
      });
  }, [content]);

  // Trigger MathJax typeset when active tab or content changes
  useEffect(() => {
    if (window.MathJax && contentRef.current && (activeTab === 0 || activeTab === 1)) {
      // Small timeout to allow render
      setTimeout(() => {
        window.MathJax.typesetPromise().catch((err: any) => console.log('MathJax typeset failed: ', err));
      }, 100);
    }
  }, [parts, activeTab]);

  const handleDownloadTxt = () => {
    const filename = `De_Thi_${topic.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyPart = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép nội dung vào bộ nhớ tạm!");
  };

  if (!content) return null;

  const tabNames = [
    "Đề Thi (HTML)",
    "Lời Giải Chi Tiết (HTML)",
    "Trắc Nghiệm (CSV)",
    "Đúng/Sai (CSV)",
    "Trả Lời Ngắn (CSV)"
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Kết quả đề thi
        </h3>
        
        <div className="flex gap-2">
           <button
            onClick={handleDownloadTxt}
            className="bg-secondary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Tải File Gốc (.txt)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-2">
        {tabNames.map((name, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === index
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
        {/* Paper Header Effect */}
        <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600"></div>

        {/* Copy Button for current tab */}
        {parts[activeTab] && (
            <div className="absolute top-4 right-4 z-10">
                 <button 
                    onClick={() => handleCopyPart(parts[activeTab])}
                    className="bg-white/90 backdrop-blur border border-slate-200 text-slate-600 hover:text-primary p-2 rounded-md shadow-sm text-xs flex items-center gap-1"
                    title="Sao chép nội dung"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                    </svg>
                    Copy
                </button>
            </div>
        )}
        
        <div className="p-6 md:p-8 min-h-[500px] overflow-auto max-h-[80vh]">
          {parts[activeTab] ? (
            activeTab < 2 ? (
                // Render HTML for Parts 1 & 2
                <div 
                    ref={contentRef}
                    className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-primary prose-p:text-slate-800 prose-b:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: parts[activeTab] }}
                />
            ) : (
                // Render Text/CSV for Parts 3, 4, 5
                <pre className="font-mono text-sm bg-slate-50 p-4 rounded border border-slate-100 whitespace-pre-wrap overflow-x-auto text-slate-800">
                    {parts[activeTab]}
                </pre>
            )
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p>Không tìm thấy nội dung phần này. Hãy kiểm tra lại file gốc.</p>
             </div>
          )}
        </div>
        
        {/* Paper Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-xs text-slate-400 font-mono">
          Thầy Hoàng - Chuyên Toán AI Generated • {generatedAt}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;