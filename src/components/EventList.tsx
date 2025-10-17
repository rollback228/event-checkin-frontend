'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEvents, EventData } from '@/lib/api';

interface EventListProps {
  refreshTrigger?: number;
}

export default function EventList({ refreshTrigger }: EventListProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadEvents = async () => {
    try {
      const result = await getEvents();
      if (result.success && result.data) {
        setEvents(result.data);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [refreshTrigger]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-3 sm:p-6">
          <p className="text-center text-gray-500 text-sm sm:text-base">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-3 sm:p-6">
          <p className="text-center text-gray-500 text-sm sm:text-base">
            Chưa có sự kiện nào. Hãy upload file Excel để bắt đầu!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-2xl">Danh Sách Sự Kiện</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Chọn sự kiện để quản lý danh sách khách mời
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg break-words">{event.eventName}</h3>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1 break-words">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  {formatDate(event.uploadDate)}
                </p>
              </div>
              <Button
                onClick={() => router.push(`/events/${event.eventId}`)}
                variant="default"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Users className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Xem Chi Tiết</span>
                <span className="sm:hidden">Xem</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
