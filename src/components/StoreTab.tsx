import React, { useState } from "react";
import { Search, ShoppingBag, Download, ShoppingCart, Trash2, QrCode } from "lucide-react";
import { Resource } from "../types";

interface StoreTabProps {
  resources: Resource[];
  cart: { name: string; price: number }[];
  onAddToCart: (name: string, price: number) => void;
  onRemoveFromCart: (idx: number) => void;
  onCheckout: () => void;
  showToast: (msg: string) => void;
}

export default function StoreTab({
  resources,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
  showToast
}: StoreTabProps) {
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredResources = resources.filter((res) => {
    const matchesFilter =
      filterType === "all" ||
      (filterType === "free" && res.type === "free") ||
      (filterType === "paid" && res.type === "paid");
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleDownloadFree = (title: string) => {
    showToast(`🚀 Đã bắt đầu tải tệp tài liệu: "${title}" miễn phí!`);
  };

  return (
    <div className="p-6 flex flex-col gap-6 text-left">
      
      {/* Tab Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            Kho học liệu số & Thư viện ôn thi VIP
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mở khóa trọn bộ tài liệu ôn luyện chứng chỉ MOS, IC3 GS6 cùng giáo án bồi dưỡng thuật toán nâng cao.
          </p>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2.5 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <ShoppingCart className="w-4 h-4 text-indigo-400 animate-pulse" />
          Giỏ tài liệu số (<span className="text-indigo-400 font-extrabold">{cart.length}</span>)
        </button>
      </div>

      {/* Catalog Search & Filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        
        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterType === "all"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            Tất cả tài nguyên
          </button>
          <button
            onClick={() => setFilterType("free")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterType === "free"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            Tài liệu Miễn phí
          </button>
          <button
            onClick={() => setFilterType("paid")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterType === "paid"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                : "bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            Tài liệu Trả phí / VIP
          </button>
        </div>

        {/* Local Search input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Tìm tài liệu: Excel, IC3, Python..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none transition-all text-slate-200"
          />
        </div>
      </div>

      {/* Resources catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-lg"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span
                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                    res.type === "free" 
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" 
                      : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                  }`}
                >
                  {res.type === "free" ? "Miễn phí" : "Tài liệu VIP"}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{res.category}</span>
              </div>
              <h3 className="text-xs font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {res.title}
              </h3>
              <p className="text-[11px] text-slate-450 line-clamp-2 leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black text-slate-200">
                {res.type === "free" ? "0 đ (FREE)" : `${res.price.toLocaleString()} đ`}
              </span>

              {res.type === "free" ? (
                <button
                  onClick={() => handleDownloadFree(res.title)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-750"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải ngay
                </button>
              ) : (
                <button
                  onClick={() => onAddToCart(res.title, res.price)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Thêm vào giỏ
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-10 bg-slate-900/20 border border-slate-800 rounded-2xl p-6">
            <p className="text-xs text-slate-500">Không tìm thấy tài liệu phù hợp.</p>
          </div>
        )}
      </div>

      {/* Cart drawer slide-out overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div
            className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl animate-slide-in"
          >
            {/* Drawer top bar */}
            <div>
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-indigo-400" />
                  Giỏ tài liệu học tập
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs p-1"
                  title="Đóng giỏ hàng"
                >
                  Đóng &rarr;
                </button>
              </div>

              {/* Selected document items */}
              <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
                {cart.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-500">Không có tài liệu nào trong giỏ hàng.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center gap-3 text-xs text-left"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-200 truncate">{item.name}</h4>
                        <p className="text-[10px] text-indigo-400 font-extrabold mt-0.5">
                          {item.price.toLocaleString()} đ
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(idx)}
                        className="text-rose-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Xóa tệp khỏi giỏ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom aggregate section */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0 text-left">
              <div className="flex justify-between items-center text-xs mb-4">
                <span className="text-slate-500 font-medium">Tổng chi phí:</span>
                <span className="font-black text-slate-200 text-sm">
                  {cartTotal.toLocaleString()} đ
                </span>
              </div>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onCheckout();
                }}
                disabled={cart.length === 0}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                Thanh toán chuyển khoản VietQR
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
