import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { type ImportResult, downloadImportTemplate, useImportEmployees } from "../api";

interface ImportEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportEmployeesDialog({ open, onOpenChange }: ImportEmployeesDialogProps) {
  const importMutation = useImportEmployees();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setImportResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetState();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetState],
  );

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return "Chỉ hỗ trợ file Excel (.xlsx, .xls)";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File quá lớn (tối đa 5MB)";
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setErrorMessage(null);
    setImportResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadImportTemplate();
      toast.success("Đã tải file mẫu");
    } catch {
      toast.error("Không thể tải file mẫu");
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setErrorMessage(null);
    setImportResult(null);

    try {
      const result = await importMutation.mutateAsync(selectedFile);
      setImportResult(result);

      if (result.errors.length === 0) {
        toast.success(`Đã import thành công ${result.imported} hồ sơ`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Import thất bại";
      setErrorMessage(message);
    }
  };

  const isPending = importMutation.isPending;
  const hasRowErrors = importResult && importResult.errors.length > 0;
  const isSuccess = importResult && importResult.errors.length === 0 && importResult.imported > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <div className="rounded-md bg-[#CAD6ED] p-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            Thêm mới từ Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <Download className="h-4 w-4" />
            Tải về file mẫu theo định dạng quy định
          </button>

          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors",
              dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400",
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-8 w-8 text-slate-400" />
            {selectedFile ? (
              <div className="flex items-center gap-2 text-sm">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span className="font-medium text-slate-700">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetState();
                  }}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Kéo thả file vào đây hoặc{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    chọn file
                  </button>
                </p>
                <p className="mt-1 text-xs text-slate-400">Chỉ hỗ trợ .xlsx, .xls (tối đa 5MB)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {isSuccess && (
            <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <p className="text-sm text-green-700">
                Import thành công {importResult.imported} hồ sơ nhân sự.
              </p>
            </div>
          )}

          {hasRowErrors && (
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <p className="text-sm text-red-700">
                  Dữ liệu không hợp lệ. Vui lòng kiểm tra lại file.
                </p>
              </div>
              <div className="max-h-48 overflow-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">Dòng</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-600">Lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.errors.map((rowErr) => (
                      <tr key={rowErr.row} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono text-slate-700">{rowErr.row}</td>
                        <td className="px-3 py-2 text-red-600">
                          {rowErr.errors.map((msg) => (
                            <div key={msg}>{msg}</div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4" showCloseButton={false}>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            {isSuccess ? "Đóng" : "Hủy"}
          </Button>
          {!isSuccess && (
            <Button
              type="button"
              onClick={handleImport}
              disabled={!selectedFile || isPending}
              className="bg-[#3B5CCC] text-white hover:bg-[#2F4FB8]"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isPending ? "Đang import..." : "Import"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
