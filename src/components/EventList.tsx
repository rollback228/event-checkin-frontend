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
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Đang tải...</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Chưa có sự kiện nào. Hãy upload file Excel để bắt đầu!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh Sách Sự Kiện</CardTitle>
        <CardDescription>
          Chọn sự kiện để quản lý danh sách khách mời
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{event.eventName}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.uploadDate)}
                </p>
              </div>
              <Button
                onClick={() => router.push(`/events/${event.eventId}`)}
                variant="default"
              >
                <Users className="mr-2 h-4 w-4" />
                Xem Chi Tiết
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
