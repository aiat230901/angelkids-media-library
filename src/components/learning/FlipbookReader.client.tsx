"use client";

import { Maximize2, X } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = { title: string; url: string; open: boolean; onClose: () => void };

export function FlipbookReader({ title, url, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function close() {
    dialogRef.current?.close();
    onClose();
  }

  async function fullscreen() {
    if (readerRef.current?.requestFullscreen) await readerRef.current.requestFullscreen();
  }

  return (
    <dialog ref={dialogRef} className="reader-dialog" aria-label={`Trình đọc ${title}`} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div ref={readerRef} className="reader-shell">
        <div className="reader-bar">
          <strong className="reader-title">{title}</strong>
          <div className="reader-actions">
            <button className="reader-action" type="button" onClick={fullscreen} aria-label="Toàn màn hình"><Maximize2 aria-hidden="true" /><span>Toàn màn hình</span></button>
            <button className="reader-action" type="button" onClick={close} aria-label="Đóng trình đọc"><X aria-hidden="true" /><span>Đóng</span></button>
          </div>
        </div>
        <iframe className="reader-frame" src={url} title={title} allow="fullscreen" />
      </div>
    </dialog>
  );
}
