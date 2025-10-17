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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Danh Sách Khách Mời</h2>
          <p className="text-sm text-gray-600 mt-1">
            Đã check-in: <strong>{checkedInCount}</strong> / {totalCount}
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          Làm mới
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Họ Tên</TableHead>
              <TableHead>Tổ chức</TableHead>
              <TableHead>Chức vụ</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Nhân viên phụ trách</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">QR Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{guest.index}</TableCell>
                <TableCell className="font-semibold">{guest.fullName}</TableCell>
                <TableCell>{guest.organization}</TableCell>
                <TableCell>{guest.position}</TableCell>
                <TableCell>{guest.phone}</TableCell>
                <TableCell>{guest.staffCare}</TableCell>
                <TableCell className="text-center">
                  {guest.checkedIn ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Đã check-in
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <Circle className="w-3 h-3 mr-1" />
                      Chưa check-in
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShowQR(guest)}
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
