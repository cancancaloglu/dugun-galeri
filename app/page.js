'use client';
import { useState, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);

  // Sayfa açıldığında önceden kaydedilmiş fotoğrafları yükle
  useEffect(() => {
    const savedPhotos = localStorage.getItem('dugun_photos');
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error('Kayıtlı fotoğraflar okunamadı:', e);
      }
    }
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'dugun_preset');

      try {
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/rb7os5iv/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) {
          newUrls.push(data.secure_url);
        }
      } catch (err) {
        console.error('Yükleme hatası:', err);
      }
    }

    if (newUrls.length > 0) {
      setPhotos((prev) => {
        const updated = [...newUrls, ...prev];
        localStorage.setItem('dugun_photos', JSON.stringify(updated));
        return updated;
      });
    }

    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 max-w-md mx-auto pb-20">
      {/* Başlık Kartı */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Düğün Anıları 💍</h1>
        <p className="text-xs text-slate-500">
          Çektiğiniz tüm fotoğrafları yükleyin, anıları birlikte toplayalım!
        </p>
      </div>

      {/* Fotoğraf Yükleme Butonu */}
      <div className="mb-8">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 transition p-6 rounded-2xl cursor-pointer text-center">
          <Upload className="w-8 h-8 text-blue-600 mb-2" />
          <span className="font-semibold text-blue-900 text-sm mb-1">
            {uploading ? 'Fotoğraflar Yükleniyor...' : 'Fotoğraf Seç / Çek'}
          </span>
          <span className="text-xs text-blue-500">
            Birden fazla fotoğraf seçebilirsiniz
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Yüklenen Fotoğraflar Galerisi */}
      <div>
        <h2 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" /> Yüklenen Fotoğraflar ({photos.length})
        </h2>

        {photos.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 text-slate-400 text-xs">
            Henüz fotoğraf yüklenmedi. İlk fotoğrafı sen ekle!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((url, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm bg-slate-200">
                <img
                  src={url}
                  alt="Düğün karesi"
                  className="w-full h-44 object-cover"
                />
                <a
                  href={url}
                  target="_blank"
                  download
                  className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-md transition flex items-center justify-center"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
