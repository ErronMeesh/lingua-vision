import { useCamera } from '../hooks/useCamera';
import { Camera, RefreshCw, Eye, Globe, Check, X, Plus } from 'lucide-react';

interface DetectedObject {
  label_en: string;
  label_ru: string;
  box: [number, number, number, number];
}

export const CameraUpload = () => {
  const {
    loading, result, preview, isPublic, imgDimensions, savedWords,
    setIsPublic, handleFileChange, handleImageLoad, handleSaveCard, handleReset
  } = useCamera();

  return (
    <div className="p-5 flex flex-col gap-8 max-w-5xl mx-auto min-h-[85vh]">
      
      <div className="text-center w-full mt-4">
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase mb-2">
          ADD NEW WORDS MODULE
        </h1>
        <p className="text-gray-400 text-sm tracking-wide">
          Upload an image to identify objects for your library.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full">

        <div className="w-full lg:w-1/2 flex flex-col h-[500px]">
          {!preview ? (
            <div className="dark-matte-glass rounded-3xl p-10 flex flex-col items-center justify-center text-center h-full border border-white/5 relative group cursor-pointer overflow-hidden transition-all hover:border-white/20">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] group-hover:scale-110 transition-transform duration-500">
                <Camera size={64} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-serif text-white mb-2 tracking-widest uppercase">
                UPLOAD IMAGE
              </h2>
              <p className="text-gray-400 text-sm">Drop or click to select a photo.</p>
              
              {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="animate-spin text-white" size={32} />
                    <span className="text-white font-serif tracking-widest uppercase text-sm">Processing...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="dark-matte-glass rounded-3xl p-5 border border-white/5 relative flex flex-col h-full">
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-black/20 rounded-2xl">
                <div className="relative inline-block max-h-full max-w-full">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    onLoad={handleImageLoad}
                    className="max-h-[390px] max-w-full block object-contain rounded-xl"
                  />

                  {result && imgDimensions.width > 0 && result.objects?.map((obj: DetectedObject, index: number) => {
                    const [xmin, ymin, xmax, ymax] = obj.box;
                    const left = (xmin / imgDimensions.width) * 100;
                    const top = (ymin / imgDimensions.height) * 100;
                    const width = ((xmax - xmin) / imgDimensions.width) * 100;
                    const height = ((ymax - ymin) / imgDimensions.height) * 100;

                    return (
                      <div
                        key={index}
                        className="absolute border-2 border-emerald-400 bg-emerald-400/10 pointer-events-none shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all"
                        style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                      >
                        <div className="absolute -top-7 -left-[2px] bg-emerald-400/90 backdrop-blur-md text-black px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-t-lg whitespace-nowrap border-b border-emerald-500">
                          {obj.label_en}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="mt-5 w-full py-3 flex items-center justify-center gap-2 text-red-400 font-bold uppercase tracking-widest text-sm bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20"
              >
                <X size={16} /> Закрыть фото
              </button>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col h-[500px]">
          <div className="dark-matte-glass rounded-3xl p-6 md:p-8 border border-white/5 h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
              <h2 className="text-2xl font-serif text-white tracking-widest uppercase">
                IDENTIFIED WORDS
              </h2>
              <div className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                <Eye size={28} />
              </div>
            </div>

            {!result ? (
              <div className="flex-1 flex items-center justify-center text-white/20 font-serif tracking-widest uppercase text-sm">
                Waiting for image...
              </div>
            ) : (
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {result.objects?.length === 0 && (
                  <p className="text-center text-white/40 mt-10">Объекты не найдены.</p>
                )}

                {result.objects?.map((obj: DetectedObject, index: number) => {
                  const isSaved = savedWords?.has(obj.label_en);

                  return (
                    <div key={index} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-xl transition-colors shrink-0">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-white/60 text-lg font-serif w-6 text-center">{index + 1}</span>
                        <div className="flex items-center w-full max-w-[200px]">
                          <span className="text-white text-base tracking-wide flex-1">{obj.label_en}</span>
                          <span className="text-white/20 mx-3">|</span>
                          <span className="text-white/60 text-sm flex-1">{obj.label_ru}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleSaveCard(obj)}
                        disabled={isSaved}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border shrink-0 ${
                          isSaved 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default' 
                            : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
                        }`}
                        title={isSaved ? "Уже в словаре" : "Добавить в словарь"}
                      >
                        {isSaved ? <Check size={18} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="w-full flex justify-center mt-2 mb-10">
          <label className="flex items-center gap-6 px-8 py-4 rounded-full dark-matte-glass border border-white/10 cursor-pointer hover:bg-white/5 transition-colors shadow-lg">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              <span className="text-white/90 text-sm font-bold tracking-widest uppercase">Publish to Global Feed</span>
            </div>
            
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/80 after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
            </div>
          </label>
        </div>
      )}

    </div>
  );
};