import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2, QrCode } from "lucide-react";

interface VietQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  syntax: string;
  onSuccess: () => void;
}

export default function VietQrModal({ isOpen, onClose, price, syntax, onSuccess }: VietQrModalProps) {
  const [dots, setDots] = useState("");
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm text-center flex flex-col gap-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 animate-bounce" />
          <span>Thanh toán tự động VietQR</span>
        </div>

        <p className="text-xs text-slate-400">
          Quét mã VietQR dưới đây để hệ thống tự động nhận diện giao dịch MB Bank trong vài giây.
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-3 rounded-xl inline-block mx-auto border border-slate-700 shadow-sm relative group">
          <div className="w-44 h-44 mx-auto flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2">
            <QrCode className="w-32 h-32 text-slate-900" />
            <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase mt-1">VietQR Auto Check</span>
          </div>
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl pointer-events-none"></div>
        </div>

        {/* Transfer details */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left flex flex-col gap-1.5 text-xs text-slate-300">
          <p className="flex justify-between">
            <span className="text-slate-500">Ngân hàng:</span>
            <strong className="text-slate-200">MB Bank (Quân Đội)</strong>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Chủ tài khoản:</span>
            <strong className="text-slate-200">HOC VIEN KY NANG SO</strong>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Số tiền:</span>
            <strong className="text-emerald-400 font-extrabold">{price.toLocaleString()} đ</strong>
          </p>
          <p className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 p-1 px-2 rounded mt-1">
            <span className="text-emerald-400 font-semibold">Cú pháp chuyển:</span>
            <strong className="text-slate-100 font-mono font-black select-all tracking-wider">{syntax}</strong>
          </p>
        </div>

        {/* Polling simulation indicator */}
        <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span className="font-medium">Hệ thống đang kiểm tra cổng ngân hàng{dots}</span>
        </div>

        {/* Fast Simulate Success Option */}
        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {simulating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Mô phỏng Giao dịch thành công (Test)
        </button>
      </div>
    </div>
  );
}
