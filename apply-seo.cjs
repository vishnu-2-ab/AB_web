const fs = require('fs');
const path = require('path');

const dirs = ['C:/Users/gebruiker/Desktop/vishnu-2-ab/AB_web', 'C:/Users/gebruiker/Desktop/ab_web'];

const seoData = {
  'index.html': {
    title: 'Apple and Berry | Next-Gen AI & Embedded Systems',
    description: 'Apple and Berry Technologies specializes in next-gen AI integration, embedded systems, and medical device manufacturing.',
    url: 'https://www.appleberrytech.info/'
  },
  'products.html': {
    title: 'Products | Apple and Berry',
    description: 'Explore Apple and Berry\'s clinical hardware and medical devices, including Vital Signs Monitors, SpO2 Modules, and NIBP modules.',
    url: 'https://www.appleberrytech.info/products'
  },
  'careers.html': {
    title: 'Careers | Apple and Berry',
    description: 'Join Apple and Berry Technologies. We are hiring engineers passionate about embedded systems, IoT, and AI application integration.',
    url: 'https://www.appleberrytech.info/careers'
  },
  'vsm-details.html': {
    title: 'Vital Signs Monitor | Apple and Berry',
    description: 'Comprehensive bedside monitoring platform with real-time waveform display and clinical-grade accuracy.',
    url: 'https://www.appleberrytech.info/vsm-details'
  },
  'nibp-details.html': {
    title: 'NIBP Module | Apple and Berry',
    description: 'Compact non-invasive blood pressure measurement core designed for seamless medical device integration.',
    url: 'https://www.appleberrytech.info/nibp-details'
  },
  'spo2-details.html': {
    title: 'SpO2 Module | Apple and Berry',
    description: 'High-performance OEM integration module powered by Masimo SET® technology for mission-critical monitoring.',
    url: 'https://www.appleberrytech.info/spo2-details'
  }
};

const keywords = "embedded systems, medical device manufacturing, AI integration, IoT, vital signs monitor, Apple and Berry Technologies";
const defaultImage = "https://www.appleberrytech.info/src/assets/logo.png";

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.values(seoData).map(data => `  <url>\n    <loc>${data.url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${data.url === 'https://www.appleberrytech.info/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;

const robotsTXT = `User-agent: *
Allow: /

Sitemap: https://www.appleberrytech.info/sitemap.xml`;

dirs.forEach(dir => {
  // Create sitemap and robots
  const publicDir = path.join(dir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXML);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTXT);
  console.log(`Generated sitemap.xml and robots.txt in ${publicDir}`);

  // Update HTML files
  Object.keys(seoData).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const data = seoData[file];

      const newSEO = `<title>${data.title}</title>
    <meta name="description" content="${data.description}" />
    <meta name="keywords" content="${keywords}" />
    <link rel="canonical" href="${data.url}" />
    
    <!-- Open Graph / Social Media -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${data.url}" />
    <meta property="og:title" content="${data.title}" />
    <meta property="og:description" content="${data.description}" />
    <meta property="og:image" content="${defaultImage}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${data.url}" />
    <meta name="twitter:title" content="${data.title}" />
    <meta name="twitter:description" content="${data.description}" />
    <meta name="twitter:image" content="${defaultImage}" />`;

      // Replace existing <title>...</title> with the new SEO block
      content = content.replace(/<title>.*?<\/title>/s, newSEO);
      
      fs.writeFileSync(filePath, content);
      console.log(`Injected SEO into ${filePath}`);
    }
  });
});
