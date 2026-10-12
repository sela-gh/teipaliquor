// src/utils/printReceipt.js
//
// Prints a receipt to an 80mm thermal printer by rendering it as an IMAGE
// (pure black & white, 576 dots wide) and printing that image.
// Why: with some thermal drivers, printing HTML text makes the driver swap the
// web font for the printer's own font and place it a few characters at a time.
// An image can't be substituted or repositioned, and its height is exact, so
// no paper is wasted.
//
// Requires:  npm install html2canvas

import html2canvas from "html2canvas";

const PAPER_MM = 80;       // roll width
const PRINTABLE_MM = 78;   // usable print width (576 dots @ 203dpi). Try 70 or 76 if the print is cut off or too small.
const DOTS = 576;          // print width in dots (72mm * 8 dots/mm)
const TAIL_MM = 6;         // blank paper at the bottom so the cutter doesn't slice the last line
const THRESHOLD = 170;     // 0-255. Lower = lighter print, higher = darker print.

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; color: #000 !important; }
  html, body { width: ${PAPER_MM}mm; background: #fff; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.3; }
  .receipt { width: ${PRINTABLE_MM}mm; margin: 0 auto; padding: 3mm 0 0; background: #fff; }
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

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function printReceiptElement(receiptEl) {
  // Hidden iframe, same width as the paper, so the layout is measured correctly
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    `position:fixed;left:-9999px;top:0;width:${PAPER_MM}mm;height:100px;border:0;`;
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title>` +
      `<style>${CSS}</style></head><body>${receiptEl.outerHTML}</body></html>`
    );
    doc.close();
    await wait(250); // let layout settle

    // 1. Draw the receipt to a canvas exactly DOTS pixels wide
    const node = doc.querySelector(".receipt");
    const canvas = await html2canvas(node, {
      scale: DOTS / node.offsetWidth,
      backgroundColor: "#ffffff",
    });

    // 2. Force pure black/white so the text prints crisp instead of grey and fuzzy
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const v = lum < THRESHOLD ? 0 : 255;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Page height comes from the image itself, so no paper is wasted
    const heightMm = Math.ceil((canvas.height / canvas.width) * PRINTABLE_MM) + TAIL_MM;

    // 4. Replace the iframe content with just the image and print it
    doc.open();
    doc.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title><style>
        @page { size: ${PAPER_MM}mm ${heightMm}mm; margin: 0; }
        html, body { margin: 0; padding: 0; width: ${PAPER_MM}mm; height: ${heightMm}mm; overflow: hidden; background: #fff; }
        img { display: block; width: ${PRINTABLE_MM}mm; margin: 0 auto; }
      </style></head><body><img id="r" src="${canvas.toDataURL("image/png")}"></body></html>`
    );
    doc.close();

    const img = doc.getElementById("r");
    if (!img.complete) await new Promise((resolve) => { img.onload = resolve; });
    await wait(100);

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  } catch (err) {
    console.error("Receipt print failed:", err);
    alert("Could not print the receipt: " + (err?.message || err));
  } finally {
    setTimeout(() => iframe.remove(), 1500);
  }
}