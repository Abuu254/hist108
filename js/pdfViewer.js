// js/pdfViewer.js

// Point this at whatever PDF you want to show by default:
const url = 'assets/pdfs/agreement1.pdf';

// PDF.js worker (you already loaded pdf.min.js earlier)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

let pdfDoc = null,
    pageNum = 1,
    scale = 1.0,
    canvas = document.getElementById('pdf-render'),
    ctx = canvas.getContext('2d');

// Render a page into the <canvas>
function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width  = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };
    page.render(renderCtx).promise.then(() => {
      document.getElementById('page-num').textContent = pageNum;
    });
  });
}

// Load the PDF document
pdfjsLib.getDocument(url).promise.then(doc => {
  pdfDoc = doc;
  document.getElementById('page-count').textContent = pdfDoc.numPages;
  renderPage(pageNum);
});

// Previous page button
document.getElementById('prev-page').addEventListener('click', () => {
  if (pageNum <= 1) return;
  pageNum--;
  renderPage(pageNum);
});

// Next page button
document.getElementById('next-page').addEventListener('click', () => {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  renderPage(pageNum);
});

// Zoom slider
document.getElementById('zoom-range').addEventListener('input', e => {
  scale = parseFloat(e.target.value);
  renderPage(pageNum);
});
