import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Key,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Database,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';

const QUICK_PROMPTS = [
  {
    icon: '📊',
    label: 'Analyze Workforce',
    prompt: 'Analyze our current workforce numbers, department balance, and workload. Provide executive insights and recommendations.'
  },
  {
    icon: '📋',
    label: 'Suggest Sprint Tasks',
    prompt: 'Suggest 3 high-impact, realistic tasks for our Engineering & Design teams, complete with priority and acceptance criteria.'
  },
  {
    icon: '📢',
    label: 'Draft Announcement',
    prompt: 'Draft an engaging company-wide announcement about our upcoming product milestone and celebrating the team.'
  },
  {
    icon: '🎯',
    label: 'Performance Review',
    prompt: 'Provide a structured performance review template for a Senior Full Stack Developer, highlighting key OKRs and metrics.'
  }
];

export const AiAssistantModal = ({
  isOpen,
  onClose,
  portalContext = {}
}) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 Hi! I'm **EMS Copilot**, powered by **Google Gemini**.\n\nI can analyze your workforce stats, draft announcements, recommend task allocations, and answer any organizational queries with live data from your portal.\n\nHow can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Settings & API Key state
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasServerKey, setHasServerKey] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [includeLiveContext, setIncludeLiveContext] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check key status on mount & open
  useEffect(() => {
    if (isOpen) {
      const customKey = aiService.getClientKey();
      setHasCustomKey(!!customKey);
      setApiKeyInput(customKey ? '••••••••••••••••••••••••' : '');

      aiService.getStatus().then((data) => {
        setHasServerKey(!!data?.hasServerKey);
      });

      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (apiKeyInput.startsWith('•••')) {
      setShowSettings(false);
      return;
    }
    const trimmed = apiKeyInput.trim();
    aiService.setClientKey(trimmed);
    setHasCustomKey(!!trimmed);
    showToast(trimmed ? 'Gemini API Key saved securely! 🚀' : 'Custom API Key removed.', 'success');
    setShowSettings(false);
  };

  const handleClearKey = () => {
    aiService.setClientKey('');
    setApiKeyInput('');
    setHasCustomKey(false);
    showToast('Custom API Key removed.', 'info');
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history (excluding welcome message)
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const contextData = includeLiveContext ? portalContext : {};

      const response = await aiService.sendMessage({
        prompt: promptText,
        conversationHistory: history,
        contextData
      });

      const modelMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.reply,
        modelUsed: response.modelUsed,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to contact Gemini AI. Please check your API key.';

      const isKeyMissing =
        err.response?.data?.code === 'MISSING_API_KEY' ||
        errorMsg.toLowerCase().includes('api key');

      if (isKeyMissing) {
        setShowSettings(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          isError: true,
          text: `⚠️ **Error**: ${errorMsg}\n\n*Click "API Key Settings" below to configure your Google Gemini API Key.*`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      showToast('Gemini AI request failed. Check API Key settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isConfigured = hasServerKey || hasCustomKey;

  // Simple Markdown renderer for clean styling
  const renderFormattedText = (raw) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      let parsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Inline code
      parsed = parsed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/40 text-violet-300 font-mono text-xs">$1</code>');

      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-violet-300 mt-2 mb-1" dangerouslySetInnerHTML={{ __html: parsed.replace('### ', '') }} />;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-white mt-2.5 mb-1" dangerouslySetInnerHTML={{ __html: parsed.replace('## ', '') }} />;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed.substring(2) }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-300 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed.replace(/^\d+\.\s/, '') }} />
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-200 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[780px] flex flex-col rounded-3xl bg-[#0c0c1e] border border-white/10 shadow-2xl overflow-hidden shadow-violet-950/40">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#0c0c1e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  EMS Copilot
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                  <Bot className="w-3 h-3 text-violet-400" />
                  Gemini 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI Workforce Intelligence & HR Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Key configuration toggle */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isConfigured
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
              }`}
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isConfigured ? 'API Key Active' : 'Set Gemini Key'}
              </span>
              {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Clear conversation */}
            <button
              type="button"
              onClick={() => {
                setMessages([messages[0]]);
                showToast('Chat history cleared', 'info');
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title="Close Copilot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Settings Accordion (Gemini API Key configuration) ── */}
        {showSettings && (
          <div className="p-4 bg-violet-950/20 border-b border-violet-500/20 shrink-0 animate-fade-in">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Google Gemini API Key Setup
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 hover:underline"
              >
                Get Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Enter your Google AI Studio Gemini API key below. Keys are stored locally in your browser session and transmitted directly to the secure Gemini backend endpoint.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="password"
                placeholder="Paste AIzaSy... API key here"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveKey}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md transition-all shrink-0"
                >
                  Save Key
                </button>
                {hasCustomKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3 text-[11px] text-slate-400 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>
                  {hasCustomKey
                    ? 'Using custom browser API key'
                    : hasServerKey
                    ? 'Using backend server GEMINI_API_KEY'
                    : 'No API key set yet (Required for answers)'}
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={includeLiveContext}
                  onChange={(e) => setIncludeLiveContext(e.target.checked)}
                  className="rounded border-white/20 text-violet-600 focus:ring-violet-500"
                />
                <Database className="w-3 h-3 text-cyan-400" />
                <span>Inject live EMS portal stats</span>
              </label>
            </div>
          </div>
        )}

        {/* ── Context pill banner ── */}
        {includeLiveContext && (portalContext.totalEmployees !== undefined || portalContext.totalTasks !== undefined) && (
          <div className="px-4 py-1.5 bg-white/2 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>
                Live context active: <strong className="text-white">{portalContext.totalEmployees ?? 0} Employees</strong> · <strong className="text-white">{portalContext.totalTasks ?? 0} Tasks</strong>
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          </div>
        )}

        {/* ── Chat Messages Scroll Area ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${
                    isUser
                      ? 'bg-gradient-to-tr from-violet-600 to-indigo-600'
                      : msg.isError
                      ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                      : 'bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 glow-purple'
                  }`}
                >
                  {isUser ? (
                    <span className="text-xs font-bold">You</span>
                  ) : msg.isError ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-950/30 border border-rose-500/30 text-rose-200 rounded-tl-none'
                      : 'bg-white/5 border border-white/8 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <div className="space-y-1">
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Message Footer */}
                  <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/5 text-[10px] text-slate-400">
                    <span>{msg.time}</span>
                    {!isUser && !msg.isError && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className="hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing shimmer animation */}
          {isLoading && (
            <div className="flex gap-3 items-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shrink-0 text-white shadow-md animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-white/5 border border-white/8 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                <span>Gemini is generating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick Prompts Chips ── */}
        <div className="px-4 py-2 bg-white/2 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider shrink-0">
            Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp.prompt)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/4 hover:bg-violet-600/20 text-slate-300 hover:text-violet-200 border border-white/8 hover:border-violet-500/30 whitespace-nowrap transition-all duration-150 disabled:opacity-50"
            >
              <span>{qp.icon}</span>
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* ── Input Bar ── */}
        <div className="p-3 sm:p-4 bg-[#0a0a18] border-t border-white/8 shrink-0">
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3 py-1.5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isConfigured
                  ? 'Ask Gemini anything about your workforce, tasks, or strategy... (Press Enter)'
                  : 'Configure Gemini API Key in settings above to start chatting...'
              }
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 resize-none outline-none max-h-24 py-1.5"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-500 hover:to-purple-500 transition-all shadow-md shadow-violet-600/30 shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 mt-1.5">
            <span>Powered by Google Gemini 2.5 Flash</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>

      </div>
    </div>
  );
};
