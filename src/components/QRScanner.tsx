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
      <DialogContent className="w-full max-w-lg sm:max-w-lg mx-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Quét Mã QR Check-in</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Quét mã QR của khách mời để check-in
          </DialogDescription>
        </DialogHeader>

        {!scanResult ? (
          <div className="space-y-3 sm:space-y-4">
            <div id="qr-reader" className="w-full max-h-[300px] sm:max-h-[400px]"></div>
            {error && (
              <div className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <div className={`border-2 rounded-lg p-3 sm:p-6 space-y-2 sm:space-y-3 ${scanResult.checkedIn ? 'bg-orange-50 border-orange-500' : 'bg-green-50 border-green-500'}`}>
              <div className={`flex items-center gap-2 font-semibold text-base sm:text-lg ${scanResult.checkedIn ? 'text-orange-700' : 'text-green-700'}`}>
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="break-words">{scanResult.checkedIn ? 'Đã check-in trước đó' : 'Tìm thấy khách mời!'}</span>
              </div>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <p className="break-words"><strong>Họ tên:</strong> {scanResult.fullName}</p>
                <p className="break-words"><strong>Tổ chức:</strong> {scanResult.organization}</p>
                <p className="break-words"><strong>SĐT:</strong> {scanResult.phone}</p>
                {scanResult.checkInTime && (
                  <p className="text-orange-600 font-semibold break-words">
                    ⏰ Thời gian check-in: {scanResult.checkInTime}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              onClick={handleConfirmCheckIn}
              disabled={loading || scanResult.checkedIn}
              className="w-full text-sm sm:text-base"
              size="sm"
            >
              {loading ? 'Đang xử lý...' : scanResult.checkedIn ? 'Đã Check-in' : 'Xác Nhận Check-in'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
