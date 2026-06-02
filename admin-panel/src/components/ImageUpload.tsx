import { useState, useRef, type ChangeEvent } from 'react';
import { api } from '../api';

interface Props {
  value: string | null;
  onChange: (url: string) => void;
}

const S = {
  wrap:    { border: '2px dashed #cbd5e1', borderRadius: 8, padding: '1rem', textAlign: 'center' as const },
  btn:     { padding: '0.5rem 1.2rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' },
  preview: { marginTop: '0.75rem', maxHeight: 160, maxWidth: '100%', borderRadius: 6, objectFit: 'cover' as const },
  err:     { color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem' },
  label:   { display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' },
};

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  const handle = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await api.uploadImage(file);
      onChange(url);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <span style={S.label}>Image</span>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} />
      <button type="button" style={S.btn} onClick={() => inputRef.current?.click()}>
        {uploading ? 'Uploading…' : 'Choose Image'}
      </button>
      {error && <p style={S.err}>{error}</p>}
      {value && <img src={value} alt="preview" style={S.preview} />}
    </div>
  );
}
