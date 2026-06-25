const fs = require('fs');
const pdf = require('pdf-parse');

const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 67 >>
stream
BT
/F1 12 Tf
72 712 Td
(React Node.js Python Docker SQL AWS candidate resume) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000252 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
370
%%EOF`;

fs.writeFileSync('test_resume.pdf', pdfContent);
console.log('PDF written. Parsing...');

const { PDFParse } = require('pdf-parse');

const parser = new PDFParse({ data: fs.readFileSync('test_resume.pdf') });
parser.getText().then(data => {
  console.log('Extracted text:', JSON.stringify(data.text));
}).catch(err => {
  console.error('Error parsing:', err);
});
