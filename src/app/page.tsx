'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import EventList from '@/components/EventList';
import { EventData } from '@/lib/api';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = (data: EventData) => {
    setRefreshTrigger(prev => prev + 1);
    alert(`Sự kiện "${data.eventName}" đã được tạo thành công với ${data.guestCount} khách mời!`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-5xl w-full">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
            Hệ Thống Check-in Sự Kiện
          </h1>
          <p className="text-xs sm:text-base text-gray-600 break-words">
            Quản lý danh sách khách mời và check-in thông minh
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <UploadForm onUploadSuccess={handleUploadSuccess} />
          <EventList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </main>
  );
}
