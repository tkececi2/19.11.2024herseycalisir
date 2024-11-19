import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AlertTriangle, Clock, CheckCircle, Image as ImageIcon, MapPin, Building, User, Calendar } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect, useState } from 'react';
import type { Ariza } from '../types';

interface Props {
  ariza: Ariza;
  sahaAdi: string;
  kullaniciAdi?: string;
  onClick: () => void;
  compact?: boolean;
}

export const ArizaKart: React.FC<Props> = ({ ariza, sahaAdi, kullaniciAdi, onClick, compact = false }) => {
  const [olusturanKisiAdi, setOlusturanKisiAdi] = useState<string>('');

  useEffect(() => {
    const getOlusturanKisi = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'kullanicilar', ariza.olusturanKisi));
        if (userDoc.exists()) {
          setOlusturanKisiAdi(userDoc.data().ad);
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
        setOlusturanKisiAdi('Bilinmeyen Kullanıcı');
      }
    };

    getOlusturanKisi();
  }, [ariza.olusturanKisi]);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.01] ${
        compact ? 'scale-95' : ''
      }`}
      onClick={onClick}
    >
      <div className={`relative ${compact ? 'aspect-[3/2] sm:aspect-[4/3]' : 'aspect-[3/2] sm:aspect-video'}`}>
        {ariza.fotograflar?.[0] ? (
          <img
            src={ariza.fotograflar[0]}
            alt="Arıza fotoğrafı"
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiLz48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIi8+PC9zdmc+';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        {ariza.fotograflar && ariza.fotograflar.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded-full">
            +{ariza.fotograflar.length - 1}
          </div>
        )}
      </div>
      
      <div className={`p-3 sm:p-4 ${compact ? 'space-y-2' : 'space-y-3'}`}>
        <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
          {ariza.baslik}
        </h3>
        
        <div className={`space-y-1.5 ${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
          <div className="flex items-center">
            <Building className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-1.5 text-gray-400`} />
            <span className="truncate">{sahaAdi}</span>
          </div>
          <div className="flex items-center">
            <MapPin className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-1.5 text-gray-400`} />
            <span className="truncate">{ariza.konum}</span>
          </div>
          <div className="flex items-center">
            <User className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-1.5 text-gray-400`} />
            <span className="truncate">{olusturanKisiAdi || 'Yükleniyor...'}</span>
          </div>
        </div>

        <div className={`flex items-center justify-between ${compact ? 'text-xs' : 'text-sm'} text-gray-500 pt-2 border-t`}>
          <div className="flex items-center">
            <Calendar className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-1.5 text-gray-400`} />
            {format(ariza.olusturmaTarihi.toDate(), 'dd MMM yyyy', { locale: tr })}
          </div>
          {ariza.cozum && (
            <div className="flex items-center text-green-600">
              <Clock className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-1.5`} />
              {formatDistanceToNow(ariza.olusturmaTarihi.toDate(), { locale: tr })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};