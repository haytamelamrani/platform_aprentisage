import React, { useState } from 'react';

function HtmlRunner() {
  const [code, setCode] = useState('<h1>Hello World!</h1>');

  const runHtml = `
    <html>
      <head><style>body { font-family: sans-serif; padding: 20px; }</style></head>
      <body>${code}</body>
    </html>
  `;

  return (
    <div>
      <h2>Codez votre page HTML ici :</h2>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        cols={60}
      />
      <h2>Résultat :</h2>
      <iframe
        title="Preview"
        srcDoc={runHtml}
        sandbox="allow-scripts"
        style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
      />
    </div>
  );
}

export default HtmlRunner;
