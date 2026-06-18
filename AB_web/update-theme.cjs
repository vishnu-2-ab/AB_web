const fs = require('fs');
const path = require('path');
const dirs = ['C:/Users/gebruiker/Desktop/vishnu-2-ab/AB_web', 'C:/Users/gebruiker/Desktop/ab_web'];
const htmlFiles = ['index.html', 'products.html', 'careers.html', 'vsm-details.html', 'nibp-details.html', 'spo2-details.html'];
const newScript = `<script>
    (function () {
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', savedTheme || (systemDark ? 'dark' : 'light'));
    })();
  </script>`;

dirs.forEach(dir => {
  htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/<script>[\s\S]*?localStorage\.getItem\('theme'\)[\s\S]*?<\/script>/, newScript);
      fs.writeFileSync(filePath, content);
      console.log('Updated', filePath);
    }
  });
});
