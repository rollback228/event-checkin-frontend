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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{guest.fullName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="p-4 bg-white rounded-lg">
            <QRCodeSVG
              id={`qr-${guest.encodedPhone}`}
              value={guest.encodedPhone}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            <p><strong>Tổ chức:</strong> {guest.organization}</p>
            <p><strong>Chức vụ:</strong> {guest.position}</p>
          </div>
          <Button onClick={downloadQR} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Tải QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
