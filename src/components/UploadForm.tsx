'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadEvent, EventData } from '@/lib/api';

interface UploadFormProps {
  onUploadSuccess?: (data: EventData) => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      setError('Vui lòng chọn file Excel');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await uploadEvent(file);
      
      if (result.success && result.data) {
        setFile(null);
        (e.target as HTMLFormElement).reset();
        onUploadSuccess?.(result.data);
      } else {
        setError(result.message || 'Upload thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-2xl">Upload Danh Sách Sự Kiện</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Chọn file Excel (.xlsx, .xls) chứa danh sách khách mời
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="flex-1 text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <Button type="submit" disabled={loading || !file} size="sm" className="w-full sm:w-auto">
              <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {loading ? 'Đang tải...' : 'Upload'}
            </Button>
          </div>

          {error && (
            <div className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg break-words">
              {error}
            </div>
          )}

          {file && (
            <div className="text-xs sm:text-sm text-gray-600 break-words">
              File đã chọn: <strong>{file.name}</strong>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
