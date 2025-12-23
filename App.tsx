
import React, { useState, useEffect, useRef } from 'react';
import { Search, History, FileText, Download, AlertCircle, Loader2, CheckCircle2, Upload, Table, ShieldCheck, ClipboardCheck } from 'lucide-react';
import Papa from 'papaparse';
import { NCRRecord, RecentSearch } from './types';
import { dataService } from './services/DataService';
import { generateRedTag } from './services/PDFGenerator';

const App: React.FC = () => {
  const [ncmrInput, setNcmrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<NCRRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [dataSourceInfo, setDataSourceInfo] = useState({ 
    isCustom: false, 
    count: dataService.getRecordCount() 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('agse_recent_searches');
    if (saved) {
      setRecent(JSON.parse(saved));
    }
  }, []);

  const saveRecent = (ncmr: string) => {
    const newSearch: RecentSearch = { ncmr, timestamp: Date.now() };
    const updated = [newSearch, ...recent.filter(r => r.ncmr !== ncmr)].slice(0, 10);
    setRecent(updated);
    localStorage.setItem('agse_recent_searches', JSON.stringify(updated));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ncmrInput.trim()) return;

    setLoading(true);
    setError(null);
    setRecord(null);

    try {
      const result = await dataService.findRecord(ncmrInput.trim());
      if (result) {
        setRecord(result);
        saveRecent(result.NCMR);
      } else {
        setError(`NCMR "${ncmrInput}" not found. Verify your CSV data or try without leading zeros.`);
      }
    } catch (err) {
      setError('An error occurred while fetching the record.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as NCRRecord[];
        if (data.length > 0) {
          dataService.setCustomData(data);
          setDataSourceInfo({ 
            isCustom: true, 
            count: data.length 
          });
          setError(null);
          alert(`Success: Loaded ${data.length} records.`);
        } else {
          setError("Empty or invalid CSV file.");
        }
      },
      error: (err) => setError(`Parse Error: ${err.message}`)
    });
  };

  const handleDownload = async () => {
    if (!record) return;
    setGeneratingPdf(true);
    try {
      await generateRedTag(record);
    } catch (err) {
      alert('PDF Generation Failed');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AGSE Red Tag</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Quality Operations v1.3</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
               <Table className="w-3.5 h-3.5" />
               {dataSourceInfo.count} NCR Records
             </div>
             <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
               <ShieldCheck className="w-3.5 h-3.5" />
               {dataSourceInfo.isCustom ? 'Active Data: Master Log' : 'Demo Environment'}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Upload className="w-4 h-4 text-slate-400" />
              1. Import Log
            </h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all group"
            >
              <Upload className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
              <span className="text-sm font-medium text-slate-600">Sync Master CSV</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleCsvUpload} accept=".csv" className="hidden" />
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Search className="w-4 h-4 text-slate-400" />
              2. Identify NCMR
            </h2>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="NCMR # (e.g. 14962)"
                value={ncmrInput}
                onChange={(e) => setNcmrInput(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono"
              />
              <button type="submit" className="absolute right-2 top-2 p-2 bg-red-600 text-white rounded-lg">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
              <History className="w-4 h-4 text-slate-400" />
              Recent History
            </h2>
            {recent.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">Queue is empty</p>
            ) : (
              <div className="space-y-1">
                {recent.map((item) => (
                  <button
                    key={item.timestamp}
                    onClick={() => { setNcmrInput(item.ncmr); setTimeout(() => handleSearch(), 0); }}
                    className="w-full flex justify-between px-3 py-2 text-xs hover:bg-slate-50 rounded-lg group transition-colors"
                  >
                    <span className="font-mono font-bold text-slate-600 group-hover:text-red-600">{item.ncmr}</span>
                    <span className="text-slate-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">NCMR Search Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {!record && !loading && !error && (
            <div className="h-[500px] bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardCheck className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">System Idle</h3>
              <p className="text-slate-500 text-sm max-w-xs mt-2 italic">Select a record to preview the automated Red Tag layout prior to physical printing.</p>
            </div>
          )}

          {loading && (
            <div className="h-[500px] bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
              <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Scanning Quality Log...</p>
            </div>
          )}

          {record && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Visual Header */}
                <div className="bg-red-600 px-8 py-6 flex justify-between items-end text-white relative">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <ShieldCheck className="w-24 h-24" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold tracking-widest uppercase">ISO Traceable</span>
                      {record['Priority Status']?.toLowerCase() === 'urgent' && (
                        <span className="px-2 py-0.5 bg-black text-white rounded text-[10px] font-bold tracking-widest uppercase">Priority</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Rejected / Hold</h3>
                  </div>
                  <div className="text-right z-10">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">NCMR Number</p>
                    <p className="text-4xl font-mono font-black leading-none tracking-tight">{record.NCMR}</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12 mb-10">
                    <DetailItem label="Status" value={record['Priority Status']} isHighlight={record['Priority Status']?.toLowerCase() === 'urgent'} />
                    <DetailItem label="Discovery" value={record['Discovery Area']} />
                    <DetailItem label="Flagged" value={`${record['Date NC was Flagged']} ${record['Time NC was Flagged'] || ''}`} />
                    <DetailItem label="Part Number" value={record['Part No.']} />
                    <DetailItem label="Quantity" value={record['QTY of Defected Parts']} />
                    <DetailItem label="Inspector" value={record['Issuing Inspector Stamp No.']} />
                    <DetailItem label="PO Ref" value={record['Purchase Order No.']} />
                    <DetailItem label="Job No" value={record['Job No. or GL No.']} />
                    <DetailItem label="Defect" value={record['Type of Defect']} />
                  </div>

                  <div className="space-y-6 border-t border-slate-100 pt-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Part Description</span>
                          <p className="text-sm text-slate-700 font-bold leading-relaxed">{record['Part Description']}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Disposition Path</span>
                          <div className="flex items-center gap-2 text-green-700 font-black text-lg">
                            <CheckCircle2 className="w-5 h-5" />
                            {record.Disposition || 'PENDING DISPO'}
                          </div>
                          {record['Rework WOR No.'] && <span className="text-[10px] font-mono text-slate-500 mt-1 block">WOR: {record['Rework WOR No.']}</span>}
                       </div>
                    </div>

                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50">
                       <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-2">Inspector Actions / Logic</span>
                       <p className="text-xs text-red-900 leading-relaxed italic">{record['Actions / Comments'] || 'No additional comments provided in log.'}</p>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleDownload}
                      disabled={generatingPdf}
                      className="flex-[2] bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-200 active:scale-[0.97] disabled:bg-slate-300"
                    >
                      {generatingPdf ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                      Generate 4x6 Label
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 px-8 py-5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs"
                    >
                      Audit View
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 p-4 bg-slate-900 rounded-2xl text-white shadow-2xl">
                 <div className="p-2 bg-red-600 rounded-xl">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
                 <p className="text-[11px] font-medium text-slate-300">
                    Industrial standard 2025: All tags include a **Digital Twin QR** and a unique timestamp. Optimized for high-contrast thermal printing.
                 </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 pb-16 pt-8 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          AGSE Quality Assurance Infrastructure • Secure Tool v1.3.0
        </p>
      </footer>
    </div>
  );
};

const DetailItem: React.FC<{ label: string, value: string, isHighlight?: boolean }> = ({ label, value, isHighlight }) => (
  <div className="flex flex-col border-l-2 border-slate-100 pl-4">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-sm font-bold truncate leading-none ${isHighlight ? 'text-red-600 underline decoration-red-200 underline-offset-4' : 'text-slate-900'}`}>
      {value || '--'}
    </span>
  </div>
);

export default App;
