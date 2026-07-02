import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { api } from '../api';

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
}

// Convert base64 + mime → File object (used for Electron native dialog result)
function base64ToFile(b64: string, mimeType: string, fileName: string): File {
  const byteString = atob(b64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return new File([ab], fileName, { type: mimeType });
}

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef                  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState('');
  const [dragging, setDragging]   = useState(false);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files allowed.'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('File exceeds 5 MB limit.'); return; }
    setUploading(true);
    setError('');
    setProgress(10);
    try {
      const ticker = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 300);
      const url = await api.uploadImage(file);
      clearInterval(ticker);
      setProgress(100);
      onChange(url);
      setTimeout(() => setProgress(0), 600);
    } catch {
      setError('Upload failed. Try again.');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  // Electron: use native file dialog
  const openNativeDialog = async () => {
    const result = await window.electronAPI!.openImageDialog();
    if (!result) return;
    const file = base64ToFile(result.fileBuffer, result.mimeType, result.fileName);
    upload(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const dropZone: React.CSSProperties = {
    border: `2px dashed ${dragging ? '#B8944A' : value ? '#10b981' : '#D1D5DB'}`,
    borderRadius: 10,
    background: dragging ? '#FFFBEB' : value ? '#F0FDF4' : '#FAFAFA',
    transition: 'all .2s',
    overflow: 'hidden',
  };

  const isElectron = !!window.electronAPI?.isElectron;

  return (
    <div
      style={dropZone}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      {/* Preview */}
      {value && (
        <div style={{ position: 'relative' }}>
          <img
            src={value}
            alt="preview"
            style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'rgba(0,0,0,.55)', color: '#fff', border: 'none',
              borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600,
            }}
          >
            ✕ Remove
          </button>
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div style={{ height: 4, background: '#E5E7EB' }}>
          <div style={{ height: '100%', background: '#B8944A', width: `${progress}%`, transition: 'width .3s' }} />
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: '1.25rem', textAlign: 'center' }}>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />

        {uploading ? (
          <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>Uploading… {progress}%</p>
        ) : (
          <>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
              {value ? 'Drag a new image to replace, or' : 'Drag & drop an image here, or'}
            </p>
            <button
              type="button"
              onClick={isElectron ? openNativeDialog : () => inputRef.current?.click()}
              style={{
                padding: '0.5rem 1.4rem', background: '#1A2335', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              }}
            >
              {isElectron
                ? (value ? '📁 Replace Image' : '📁 Browse Files')
                : (value ? 'Choose Different Image' : 'Browse Files')}
            </button>
            <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              JPEG · PNG · WebP · GIF · max 5 MB
            </p>
          </>
        )}

        {error && (
          <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: 0 }}>{error}</p>
        )}
      </div>
    </div>
  );
}
