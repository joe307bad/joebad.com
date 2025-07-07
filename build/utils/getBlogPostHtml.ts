import { BlogPostSEO } from "../types";

export function getBlogPostHtml(css: string, content: string, seo: BlogPostSEO) {
  const fullTitle = `${seo.title} - Joe Badaczewski`;
  const canonicalUrl = `https://joebad.com/post/${seo.slug}`;
  const author = seo.author || 'Joe Badaczewski';
  
  return `
<!DOCTYPE html>
<html lang="en" class="h-full w-full p-2 bg-[#FFECD1]">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style>${css}</style>
    
  <!-- Primary SEO Tags -->
  <title>${fullTitle}</title>
  <meta name="description" content="${seo.description}">
  <meta name="author" content="${author}">
  ${seo.tags ? `<meta name="keywords" content="${seo.tags.join(', ')}">` : ''}
  
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Article Meta Tags -->
  <meta property="article:published_time" content="${seo.publishedAt}">
  ${seo.modifiedDate ? `<meta property="article:modified_time" content="${seo.modifiedDate}">` : ''}
  <meta property="article:author" content="${author}">
  ${seo.tags ? seo.tags.map(tag => `<meta property="article:tag" content="${tag}">`).join('\n  ') : ''}
  
  <!-- Open Graph Meta Tags (Social Media) -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${seo.description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Joe Badaczewski - Senior Software Engineer">
  <meta property="og:locale" content="en_US">
  ${seo.imageUrl ? `<meta property="og:image" content="${seo.imageUrl}">` : ''}
  ${seo.imageAlt ? `<meta property="og:image:alt" content="${seo.imageAlt}">` : ''}
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${seo.description}">
  <meta name="twitter:creator" content="@joe307bad">
  ${seo.imageUrl ? `<meta name="twitter:image" content="${seo.imageUrl}">` : ''}
  ${seo.imageAlt ? `<meta name="twitter:image:alt" content="${seo.imageAlt}">` : ''}
  
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${seo.title}",
    "description": "${seo.description}",
    "author": {
      "@type": "Person",
      "name": "${author}"
    },
    "datePublished": "${seo.publishedAt}",
    ${seo.modifiedDate ? `"dateModified": "${seo.modifiedDate}",` : ''}
    "url": "${canonicalUrl}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonicalUrl}"
    }${seo.imageUrl ? `,
    "image": {
      "@type": "ImageObject",
      "url": "${seo.imageUrl}"${seo.imageAlt ? `,
      "caption": "${seo.imageAlt}"` : ''}
    }` : ''}
  }
  </script>
</head>
<body class="h-full w-full">
    <main id="root" class="flex justify-center">${content}</main>
</body>
</html>
`;
}