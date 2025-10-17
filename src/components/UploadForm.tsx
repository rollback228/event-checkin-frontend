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
      <CardHeader>
        <CardTitle>Upload Danh Sách Sự Kiện</CardTitle>
        <CardDescription>
          Chọn file Excel (.xlsx, .xls) chứa danh sách khách mời
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <Button type="submit" disabled={loading || !file}>
              <Upload className="mr-2 h-4 w-4" />
              {loading ? 'Đang tải...' : 'Upload'}
            </Button>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          {file && (
            <div className="text-sm text-gray-600">
              File đã chọn: <strong>{file.name}</strong>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
