// src/components/Pagination.jsx
import React from "react";

function getPageNumbers(current, total, delta = 1) {
  // Tạo mảng số trang có ... rút gọn: 1 ... c-1 c c+1 ... total
  const range = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  if (total > 1) range.push(total);

  // Loại trùng trong trường hợp total nhỏ
  return Array.from(new Set(range));
}

export default function Pagination({
  page,                 // số trang hiện tại (1-based)
  pageSize,             // 12 | 24 | 48
  totalItems,           // tổng số item (client: = products.length, server: = total từ API)
  onPageChange,         // (newPage) => void
  onPageSizeChange,     // (newSize) => void
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / pageSize));
  const disabledPrev = page <= 1;
  const disabledNext = page >= totalPages;

  const pages = getPageNumbers(page, totalPages, 1);

  const btnBase =
    "h-10 w-10 flex items-center justify-center rounded-full transition text-sm";
  const btnGhost = "hover:bg-slate-100 text-slate-600";
  const btnActive =
    "border border-indigo-200 text-indigo-600";

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full ${className}`}>
      {/* Page size */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Hiển thị</span>
        <select
          aria-label="page size"
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
        <span>sản phẩm/trang</span>
      </div>

      {/* Page numbers */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <button
          type="button"
          aria-label="prev"
          disabled={disabledPrev}
          onClick={() => !disabledPrev && onPageChange?.(page - 1)}
          className={`rounded-full bg-slate-200/50 disabled:opacity-60 disabled:cursor-not-allowed`}
          title="Trang trước"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
          </svg>
        </button>

        <div className="flex items-center gap-1.5 text-sm font-medium">
          {pages.map((p, idx) =>
            p === "…" ? (
              <span key={`dots-${idx}`} className="px-2 text-slate-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange?.(p)}
                className={`${btnBase} ${page === p ? btnActive : btnGhost}`}
                aria-current={page === p ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          aria-label="next"
          disabled={disabledNext}
          onClick={() => !disabledNext && onPageChange?.(page + 1)}
          className={`rounded-full bg-slate-200/50 disabled:opacity-60 disabled:cursor-not-allowed`}
          title="Trang sau"
        >
          <svg className="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
