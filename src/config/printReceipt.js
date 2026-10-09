// src/utils/printReceipt.js
const PAPER_MM = 80;      // roll width
const PRINTABLE_MM = 72;  // usable print width (576 dots @ 203dpi). Try 76 if your printer prints edge to edge.
const TAIL_MM = 6;        // blank paper at the bottom so the cutter doesn't slice the last line

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; color: #000 !important; }
  html, body { width: ${PAPER_MM}mm; background: #fff; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.3; }
  .receipt { width: ${PRINTABLE_MM}mm; margin: 0 auto; padding: 3mm 0 0; }
  .receipt-store { text-align: center; font-weight: 800; font-size: 20px; }
  .receipt-sub { text-align: center; font-size: 11px; margin-bottom: 4px; }
  .receipt-meta { display: grid; grid-template-columns: 1fr auto; gap: 2px 8px; font-size: 10px; }
  .receipt-meta span:nth-child(even) { text-align: right; }
  .receipt-divider { border: 0; border-top: 1px dashed #000; margin: 5px 0; }
  .receipt-item { margin: 3px 0; }
  .receipt-item-main, .receipt-item-sub { display: grid; grid-template-columns: minmax(0,1fr) auto; column-gap: 8px; align-items: baseline; }
  .receipt-item-main { font-size: 12px; font-weight: 700; }
  .receipt-item-sub { font-size: 10px; }
  .receipt-item-name, .receipt-item-unit { min-width: 0; overflow-wrap: anywhere; }
  .receipt-item-amount { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .receipt-row { display: grid; grid-template-columns: 1fr auto; column-gap: 10px; font-size: 12px; margin: 2px 0; }
  .receipt-row span:last-child { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .receipt-row.bold { font-weight: 700; }
  .receipt-row.total { font-weight: 800; font-size: 16px; margin-top: 4px; }
  .receipt-footer { text-align: center; font-size: 11px; margin-top: 6px; line-height: 1.4; }
`;

export function printReceiptElement(receiptEl) {
  const iframe = document.createElement("iframe");
  // Same width as the paper so layout is measured correctly; kept off-screen
  iframe.style.cssText = `position:fixed;left:-9999px;top:0;width:${PAPER_MM}mm;height:100px;border:0;`;
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  doc.open();
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title>` +
    `<style>${CSS}</style></head><body>${receiptEl.outerHTML}</body></html>`
  );
  doc.close();

  const run = () => {
    const win = iframe.contentWindow;
    const px = doc.querySelector(".receipt").getBoundingClientRect().height;
    const heightMm = Math.ceil((px * 25.4) / 96) + TAIL_MM;

    const style = doc.createElement("style");
    style.textContent =
      `@page { size: ${PAPER_MM}mm ${heightMm}mm; margin: 0; }` +
      `html, body { height: ${heightMm}mm; overflow: hidden; }`;
    doc.head.appendChild(style);

    win.focus();
    win.print();
    setTimeout(() => iframe.remove(), 1500);
  };

  setTimeout(run, 250); // let layout settle
}