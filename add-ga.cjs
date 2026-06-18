const fs = require('fs');
const path = require('path');
const dirs = ['C:/Users/gebruiker/Desktop/vishnu-2-ab/AB_web', 'C:/Users/gebruiker/Desktop/ab_web'];
const htmlFiles = ['index.html', 'products.html', 'careers.html', 'vsm-details.html', 'nibp-details.html', 'spo2-details.html'];

const gaScript = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-TNNCNFFV6K"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-TNNCNFFV6K');
    </script>
</head>`;

dirs.forEach(dir => {
  htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes('G-TNNCNFFV6K')) {
        content = content.replace('</head>', gaScript);
        fs.writeFileSync(filePath, content);
        console.log('Added GA to', filePath);
      } else {
        console.log('GA already in', filePath);
      }
    }
  });
});
