'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Guest } from '@/lib/api';

interface QRModalProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRModal({ guest, isOpen, onClose }: QRModalProps) {
  if (!guest) return null;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${guest.encodedPhone}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `QR_${guest.fullName.replace(/\s/g, '_')}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-md mx-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl break-words">{guest.fullName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 py-2 sm:py-4">
          <div className="p-2 sm:p-4 bg-white rounded-lg border border-gray-200">
            <QRCodeSVG
              id={`qr-${guest.encodedPhone}`}
              value={guest.encodedPhone}
              size={Math.min(window.innerWidth - 60, 256)}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center text-xs sm:text-sm text-gray-600 w-full">
            <p className="break-words"><strong>Tổ chức:</strong> {guest.organization}</p>
            <p className="break-words"><strong>Chức vụ:</strong> {guest.position}</p>
          </div>
          <Button onClick={downloadQR} className="w-full text-sm sm:text-base" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Tải QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
