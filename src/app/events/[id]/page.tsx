'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Camera, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GuestTable from '@/components/GuestTable';
import QRScanner from '@/components/QRScanner';
import { getEventGuests, Guest, downloadEventFile } from '@/lib/api';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const loadGuests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getEventGuests(eventId);
      if (result.success && result.data) {
        setGuests(result.data);
      } else {
        setError('Không thể tải danh sách khách mời');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadGuests();
    }
  }, [eventId]);

  const handleCheckInSuccess = (guestData: Guest) => {
    loadGuests();
    alert(`Check-in thành công cho ${guestData.fullName}!`);
  };

  const handleDownloadFile = async (format: 'csv' | 'xlsx') => {
    setDownloading(true);
    try {
      const blob = await downloadEventFile(eventId, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${eventName}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Lỗi khi tải file: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloading(false);
    }
  };

  const eventName = eventId?.split('_')[0] || 'Sự kiện';

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl w-full">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex-1 sm:flex-none">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 break-words">{eventName}</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">Mã sự kiện: {eventId}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setShowScanner(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              <Camera className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Quét QR Check-in</span>
              <span className="sm:hidden">Quét QR</span>
            </Button>
            <Button
              onClick={() => handleDownloadFile('xlsx')}
              disabled={downloading}
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{downloading ? 'Đang tải...' : 'Tải Excel'}</span>
              <span className="sm:hidden">{downloading ? 'Tải...' : 'Excel'}</span>
            </Button>
            <Button
              onClick={() => handleDownloadFile('csv')}
              disabled={downloading}
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{downloading ? 'Đang tải...' : 'Tải CSV'}</span>
              <span className="sm:hidden">{downloading ? 'Tải...' : 'CSV'}</span>
            </Button>
          </div>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {loading ? (
          <Card className="p-8">
            <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
          </Card>
        ) : (
          <Card className="p-6">
            <GuestTable guests={guests} onRefresh={loadGuests} />
          </Card>
        )}

        <QRScanner
          eventId={eventId}
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onCheckInSuccess={handleCheckInSuccess}
        />
      </div>
    </main>
  );
}
