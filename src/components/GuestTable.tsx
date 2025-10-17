'use client';

import { useState } from 'react';
import { QrCode, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import QRModal from './QRModal';
import { Guest } from '@/lib/api';

interface GuestTableProps {
  guests: Guest[];
  onRefresh: () => void;
}

export default function GuestTable({ guests, onRefresh }: GuestTableProps) {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleShowQR = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowQRModal(true);
  };

  const checkedInCount = guests.filter(g => g.checkedIn).length;
  const totalCount = guests.length;

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Danh Sách Khách Mời</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Đã check-in: <strong>{checkedInCount}</strong> / {totalCount}
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm" className="w-full sm:w-auto">
          Làm mới
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto bg-white">
        <Table className="w-full text-xs sm:text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 sm:w-12 px-2 sm:px-4">#</TableHead>
              <TableHead className="px-2 sm:px-4 min-w-[100px]">Họ Tên</TableHead>
              <TableHead className="hidden md:table-cell px-2 sm:px-4">Tổ chức</TableHead>
              <TableHead className="hidden lg:table-cell px-2 sm:px-4">Chức vụ</TableHead>
              <TableHead className="hidden sm:table-cell px-2 sm:px-4">SĐT</TableHead>
              <TableHead className="hidden xl:table-cell px-2 sm:px-4">Nhân viên</TableHead>
              <TableHead className="text-center px-2 sm:px-4">Trạng thái</TableHead>
              <TableHead className="hidden sm:table-cell px-2 sm:px-4">Check-in</TableHead>
              <TableHead className="text-center px-2 sm:px-4">QR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest, idx) => (
              <TableRow key={idx} className="hover:bg-gray-50">
                <TableCell className="font-medium px-2 sm:px-4 text-xs">{guest.index}</TableCell>
                <TableCell className="font-semibold px-2 sm:px-4 max-w-[120px] truncate">{guest.fullName}</TableCell>
                <TableCell className="hidden md:table-cell px-2 sm:px-4 max-w-[100px] truncate">{guest.organization}</TableCell>
                <TableCell className="hidden lg:table-cell px-2 sm:px-4 max-w-[80px] truncate">{guest.position}</TableCell>
                <TableCell className="hidden sm:table-cell px-2 sm:px-4 text-xs">{guest.phone}</TableCell>
                <TableCell className="hidden xl:table-cell px-2 sm:px-4 max-w-[80px] truncate">{guest.staffCare}</TableCell>
                <TableCell className="text-center px-2 sm:px-4">
                  {guest.checkedIn ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                      <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      <span className="hidden sm:inline">Đã check-in</span>
                      <span className="sm:hidden">✓</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 text-xs">
                      <Circle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      <span className="hidden sm:inline">Chưa check-in</span>
                      <span className="sm:hidden">○</span>
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell px-2 sm:px-4 text-xs">
                  {guest.checkInTime ? (
                    <span className="text-green-600 font-medium">{guest.checkInTime}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center px-2 sm:px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShowQR(guest)}
                    className="h-8 w-8 p-0"
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showQRModal && (
        <QRModal
          guest={selectedGuest}
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}
