import React, { useRef } from 'react';
import { Play, RotateCcw, Copy, Check, Code2 } from 'lucide-react';
import { Language } from '../types/dsa';

interface CodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onResetBoilerplate: () => void;
  onRunTests: () => void;
  isRunning: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChangeCode,
  language,
  onChangeLanguage,
  onResetBoilerplate,
  onRunTests,
  isRunning
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  // Handle Tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 2 spaces
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChangeCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">Interactive Code Studio</span>
          </div>

          {/* Language Selector: ( CPP , java , Python , Javascript ) only */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onChangeLanguage('cpp')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                language === 'cpp' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CPP
            </button>
            <button
              onClick={() => onChangeLanguage('java')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                language === 'java' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Java
            </button>
            <button
              onClick={() => onChangeLanguage('python')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                language === 'python' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => onChangeLanguage('javascript')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                language === 'javascript' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Javascript
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onResetBoilerplate}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset to starter boilerplate"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Boilerplate</span>
          </button>
          <button
            onClick={onRunTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running Tests...' : 'Run Test Suite'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex flex-1 min-h-[360px] font-mono text-xs leading-5 overflow-hidden">
        {/* Line Numbers Gutter */}
        <div className="select-none py-3 px-3 bg-slate-900/60 text-slate-600 text-right font-mono border-r border-slate-800/80 w-12 shrink-0">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 w-full p-3 bg-transparent text-slate-100 font-mono resize-none focus:outline-none focus:ring-0 selection:bg-sky-500/30 overflow-auto"
          style={{ tabSize: 2 }}
        />
      </div>

      {language === 'java' && (
        <div className="px-4 py-2 bg-sky-950/40 border-t border-sky-900/40 text-[11px] text-sky-300 flex items-center justify-between">
          <span>
            Java Mode: Real Java syntax (`public class Solution`). In-browser execution engine evaluates your Java methods against unit tests.
          </span>
          <span className="font-mono text-emerald-400 font-semibold">Active JDK Engine</span>
        </div>
      )}

      {language === 'python' && (
        <div className="px-4 py-2 bg-amber-950/40 border-t border-amber-900/40 text-[11px] text-amber-300/90 flex items-center justify-between">
          <span>
            Python Mode: Code editor provides full syntax reference. In-browser automated evaluation runs via the JavaScript engine.
          </span>
          <button
            onClick={() => onChangeLanguage('java')}
            className="underline hover:text-white"
          >
            Switch to Java
          </button>
        </div>
      )}
    </div>
  );
};
