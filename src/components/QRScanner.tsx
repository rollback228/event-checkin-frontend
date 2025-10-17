'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { scanQRCode, confirmCheckIn, Guest } from '@/lib/api';

interface QRScannerProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess?: (guestData: Guest) => void;
}

export default function QRScanner({ eventId, isOpen, onClose, onCheckInSuccess }: QRScannerProps) {
  const [scanResult, setScanResult] = useState<Guest | null>(null);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setScanResult(null);
      setScannedCode('');
      setError('');
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      const element = document.getElementById('qr-reader');
      if (!element || mountedRef.current) return;

      mountedRef.current = true;

      const onScanSuccess = async (decodedText: string) => {
        setLoading(true);
        setError('');
        setScannedCode(decodedText);

        try {
          const result = await scanQRCode(eventId, decodedText);
          
          if (result.success && result.data) {
            setScanResult(result.data);
            if (scannerRef.current) {
              scannerRef.current.clear().catch(console.error);
            }
          } else {
            setError(result.message || 'Không tìm thấy khách mời');
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Lỗi khi quét mã QR');
        } finally {
          setLoading(false);
        }
      };

      const onScanError = () => {
        // Ignore
      };

      try {
        scannerRef.current = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          false
        );

        scannerRef.current.render(onScanSuccess, onScanError);
      } catch (err) {
        console.error('Scanner init error:', err);
        setError('Không thể khởi động camera');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      mountedRef.current = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isOpen, eventId]);

  const handleConfirmCheckIn = async () => {
    if (!scanResult || !scannedCode) return;

    setLoading(true);
    try {
      const result = await confirmCheckIn(eventId, scannedCode);
      
      if (result.success) {
        onCheckInSuccess?.(scanResult);
        onClose();
      } else {
        setError(result.message || 'Check-in thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quét Mã QR Check-in</DialogTitle>
          <DialogDescription>
            Quét mã QR của khách mời để check-in
          </DialogDescription>
        </DialogHeader>

        {!scanResult ? (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full"></div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-semibold text-lg">
                <CheckCircle className="h-5 w-5" />
                Tìm thấy khách mời!
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Họ tên:</strong> {scanResult.fullName}</p>
                <p><strong>Tổ chức:</strong> {scanResult.organization}</p>
                <p><strong>SĐT:</strong> {scanResult.phone}</p>
                {scanResult.checkedIn && (
                  <p className="text-orange-600 font-semibold">
                    ⚠️ Đã check-in trước đó
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              onClick={handleConfirmCheckIn}
              disabled={loading || scanResult.checkedIn}
              className="w-full"
            >
              {loading ? 'Đang xử lý...' : scanResult.checkedIn ? 'Đã Check-in' : 'Xác Nhận Check-in'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
