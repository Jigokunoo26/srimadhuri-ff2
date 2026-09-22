import React, { useState, useRef } from 'react';
import { Upload, Link, X, Image as ImageIcon, Loader } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BUCKET = 'salon-images';

const ImageUploader = ({ currentUrl = '', onUpload, label = 'Image', compact = false }) => {
  const [mode, setMode] = useState('url'); // 'url' | 'upload'
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleUrlSubmit = () => {
    setPreview(urlInput);
    onUpload(urlInput);
    setError('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5MB.'); return; }

    setError('');
    setUploading(true);

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    if (isSupabaseConfigured && supabase) {
      try {
        const ext = file.name.split('.').pop();
        const filename = `salon_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(filename, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);
        setPreview(publicUrl);
        setUrlInput(publicUrl);
        onUpload(publicUrl);
      } catch (err) {
        console.error('Storage upload error:', err);
        // Fall back to local object URL
        onUpload(localUrl);
        setError('Uploaded locally (Storage bucket may need setup). URL saved for session.');
      }
    } else {
      // No Supabase — use object URL (dev mode)
      onUpload(localUrl);
      setError('Using local preview (configure Supabase Storage for permanent upload).');
    }
    setUploading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {label && (
        <label style={{ fontSize: '0.83rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </label>
      )}

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[{ key: 'url', icon: Link, text: 'URL' }, { key: 'upload', icon: Upload, text: 'Upload File' }].map(({ key, icon: Icon, text }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
              border: '1px solid',
              background: mode === key ? 'rgba(212,175,55,0.15)' : 'transparent',
              borderColor: mode === key ? 'var(--gold-primary)' : 'var(--border-subtle)',
              color: mode === key ? 'var(--gold-light)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            }}
          >
            <Icon size={13} /> {text}
          </button>
        ))}
      </div>

      {mode === 'url' ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="url"
            className="input"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-outline btn-sm" onClick={handleUrlSubmit}>Apply</button>
        </div>
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              width: '100%', padding: '20px',
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--text-muted)', cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              transition: 'var(--transition)'
            }}
          >
            {uploading ? <Loader size={22} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={22} />}
            <span style={{ fontSize: '0.85rem' }}>{uploading ? 'Uploading...' : 'Click to select image (max 5MB)'}</span>
          </button>
        </div>
      )}

      {error && <p style={{ fontSize: '0.78rem', color: '#f87171', margin: 0 }}>{error}</p>}

      {/* Preview */}
      {preview && (
        <div style={{ position: 'relative', width: compact ? '80px' : '100%', height: compact ? '80px' : '160px' }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)'
            }}
            onError={() => setPreview('')}
          />
          <button
            type="button"
            onClick={() => { setPreview(''); setUrlInput(''); onUpload(''); }}
            style={{
              position: 'absolute', top: '4px', right: '4px',
              background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
              color: '#fff', width: '22px', height: '22px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
