'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GuestTable from '@/components/GuestTable';
import QRScanner from '@/components/QRScanner';
import { getEventGuests, Guest } from '@/lib/api';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState('');

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

  const eventName = eventId?.split('_')[0] || 'Sự kiện';

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{eventName}</h1>
              <p className="text-sm text-gray-600 mt-1">Mã sự kiện: {eventId}</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowScanner(true)}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <Camera className="w-5 h-5 mr-2" />
            Quét QR Check-in
          </Button>
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
