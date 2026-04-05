"use client";

import { useState } from "react";
import { ImageIcon, X, Check } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────
type CoverItem = { id: number; url: string; thumb: string };

/** Ảnh tĩnh – thêm/sửa link tại đây */
const STATIC_COVERS: CoverItem[] = [
  {
    id: 1,
    url: "https://cdn.dribbble.com/userupload/47280192/file/548cc14e81899799ddbf2fbc57034029.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280193/file/cdeecd0a4e86173e35656180922c3242.png?resize=1504x914&vertical=center",
  },
  {
    id: 2,
    url: "https://cdn.dribbble.com/userupload/47280175/file/6234e14d11c9d1716ae1517056a4ef55.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280190/file/ca7666abcdbbacf391d023f356209f68.png?resize=1504x914&vertical=center",
  },
  {
    id: 3,
    url: "https://cdn.dribbble.com/userupload/47280182/file/383da0a0b1b7257e25e1da1071341b97.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280179/file/28db4e8676c73b7590594bbdae1ff50a.png?resize=1504x914&vertical=center",
  },
  {
    id: 4,
    url: "https://cdn.dribbble.com/userupload/47280178/file/afacababd46836c4f1b43e276de16b9f.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280185/file/bb21f7c3ec326f28bf4c514845a5729c.png?resize=1504x914&vertical=center",
  },
  {
    id: 5,
    url: "https://cdn.dribbble.com/userupload/47280177/file/bbe03cd4c77dfd5462eef654853dc910.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280172/file/843426a6e47556ced1548f67102c3789.png?resize=1504x914&vertical=center",
  },
  {
    id: 6,
    url: "https://cdn.dribbble.com/userupload/47280187/file/63df908c001f8415db903ee56e7b871a.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280176/file/78d8fbf649de50d2b200aac74e6caa65.png?resize=1504x914&vertical=center",
  },
  {
    id: 7,
    url: "https://cdn.dribbble.com/userupload/47280180/file/9b8643fd152eda2e50f9dce2a60faedd.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280188/file/5354de8944b19d9ccac0decaaf1da2e3.png?resize=1504x914&vertical=center",
  },
  {
    id: 8,
    url: "https://cdn.dribbble.com/userupload/47280186/file/65b36e7255624e434eff5fdedd069878.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280191/file/9dc3343c044d2ee46df429d569acff5c.png?resize=1504x914&vertical=center",
  },
  {
    id: 9,
    url: "https://cdn.dribbble.com/userupload/47280174/file/a45e829ba804644de6f6573c12a06155.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280183/file/41f815816280e968290848833784562f.png?resize=1504x914&vertical=center",
  },
  {
    id: 10,
    url: "https://cdn.dribbble.com/userupload/47280184/file/df0731ae570836ed766b5cb0796f840d.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280181/file/1dadd5cf63b16ca6dcb42c9111340363.png?resize=1504x914&vertical=center",
  },
  {
    id: 11,
    url: "https://cdn.dribbble.com/userupload/47280173/file/6973cf588a8b147fb27ed64f331c42a2.png?resize=1504x352&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47280189/file/40ef144216af52a689ea0435123c21c1.png?resize=1504x914&vertical=center",
  },
  {
    id: 12,
    url: "https://cdn.dribbble.com/userupload/47279856/file/7ed0732c24465cf66134ecfa3ad1fa1c.png?resize=2048x480&vertical=center",
    thumb:
      "https://cdn.dribbble.com/userupload/47279857/file/7943614b5179cf4d4d06a348fb620554.png?resize=1504x914&vertical=center",
  },
];

/** Ảnh động GIF – thêm link GIF tại đây */
const GIF_COVERS: CoverItem[] = [
  {
    id: 101,
    url: "https://i.pinimg.com/originals/7a/61/67/7a6167f26c2b279f6e64b06fa762a492.gif",
    thumb:
      "https://i.pinimg.com/originals/7a/61/67/7a6167f26c2b279f6e64b06fa762a492.gif",
  },
  {
    id: 102,
    url: "https://i.pinimg.com/originals/49/cd/d8/49cdd838e8c6d7fe5e2dd55deead5567.gif",
    thumb:
      "https://i.pinimg.com/originals/49/cd/d8/49cdd838e8c6d7fe5e2dd55deead5567.gif",
  },
  {
    id: 103,
    url: "https://i.pinimg.com/originals/ed/1e/a4/ed1ea4a5312ed738cd447d2d40ef6cfb.gif",
    thumb:
      "https://i.pinimg.com/originals/ed/1e/a4/ed1ea4a5312ed738cd447d2d40ef6cfb.gif",
  },
  {
    id: 104,
    url: "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
    thumb:
      "https://i.pinimg.com/originals/3a/a4/6f/3aa46f5701fc6ed92234ea0a9f86e2cd.gif",
  },
  {
    id: 105,
    url: "https://i.pinimg.com/originals/6f/1b/f1/6f1bf1e312e5f9ab4d8b66b1b7249326.gif",
    thumb:
      "https://i.pinimg.com/originals/6f/1b/f1/6f1bf1e312e5f9ab4d8b66b1b7249326.gif",
  },
  {
    id: 106,
    url: "https://i.pinimg.com/originals/51/76/bf/5176bf4d6ce1975b9aca2b019123c9e1.gif",
    thumb:
      "https://i.pinimg.com/originals/51/76/bf/5176bf4d6ce1975b9aca2b019123c9e1.gif",
  },
];

const ALL_COVERS = [...STATIC_COVERS, ...GIF_COVERS];

// ── Thumbnail card ────────────────────────────────────────────────────────
function ThumbCard({
  item,
  selected,
  onSelect,
}: {
  item: CoverItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative group rounded-xl overflow-hidden aspect-video border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        selected
          ? "border-blue-500 ring-2 ring-blue-500/30"
          : "border-transparent hover:border-slate-300"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.thumb}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* Selected check */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shadow">
          <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
        </div>
      )}
    </button>
  );
}

// ── Cover Picker Modal ────────────────────────────────────────────────────
type TabKey = "static" | "gif";

function CoverPickerModal({
  currentId,
  onSelect,
  onClose,
}: {
  currentId: number;
  onSelect: (id: number) => void;
  onClose: () => void;
}) {
  const [pending, setPending] = useState(currentId);
  const [tab, setTab] = useState<TabKey>(
    GIF_COVERS.some((c) => c.id === currentId) ? "gif" : "static",
  );

  const list = tab === "static" ? STATIC_COVERS : GIF_COVERS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Chọn ảnh bìa"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">
              Chọn ảnh bìa
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3 pb-0 shrink-0">
          {(
            [
              { key: "static", label: "Ảnh tĩnh" },
              { key: "gif", label: "Ảnh động" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === t.key
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="p-5 grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto">
          {list.map((item) => (
            <ThumbCard
              key={item.id}
              item={item}
              selected={pending === item.id}
              onSelect={() => setPending(item.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(pending);
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HeroBanner ────────────────────────────────────────────────────────────
export function HeroBanner() {
  const [activeCoverId, setActiveCoverId] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const cover = ALL_COVERS.find((o) => o.id === activeCoverId) ?? ALL_COVERS[0];
  const isGif = GIF_COVERS.some((c) => c.id === activeCoverId);

  return (
    <>
      {/* Banner */}
      <div
        className="group relative w-full overflow-hidden rounded-xl shadow-sm"
        style={{ height: "240px" }}
      >
        {/* Background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover.url}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover ${
            isGif ? "" : "transition-transform duration-700"
          }`}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Change cover button — visible on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Đổi ảnh bìa
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <CoverPickerModal
          currentId={activeCoverId}
          onSelect={setActiveCoverId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
