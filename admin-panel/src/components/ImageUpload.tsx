import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { api } from '../api';

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef                  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState('');
  const [dragging, setDragging]   = useState(false);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File exceeds 5 MB limit.');
      return;
    }
    setUploading(true);
    setError('');
    setProgress(10);
    try {
      // Simulate progress ticks while upload runs
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
    border: `2px dashed ${dragging ? '#b8960c' : value ? '#10b981' : '#cbd5e1'}`,
    borderRadius: 10,
    background: dragging ? '#fffbeb' : value ? '#f0fdf4' : '#f8fafc',
    transition: 'all .2s',
    overflow: 'hidden',
  };

  return (
    <div style={dropZone}
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

      {/* Upload progress bar */}
      {uploading && (
        <div style={{ height: 4, background: '#e2e8f0' }}>
          <div style={{
            height: '100%', background: '#b8960c',
            width: `${progress}%`, transition: 'width .3s',
          }} />
        </div>
      )}

      {/* Drop zone CTA */}
      <div style={{ padding: '1.25rem', textAlign: 'center' }}>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />

        {uploading ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Uploading… {progress}%</p>
        ) : (
          <>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
              {value ? 'Drag a new image to replace, or' : 'Drag & drop an image here, or'}
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                padding: '0.5rem 1.4rem', background: '#0f172a', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              }}
            >
              {value ? 'Choose Different Image' : 'Browse Files'}
            </button>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              JPEG · PNG · WebP · GIF · max 5 MB
            </p>
          </>
        )}

        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: 0 }}>{error}</p>
        )}
      </div>
    </div>
  );
}
