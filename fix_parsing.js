const fs = require('fs');

const files = [
  'src/app/chat/page.tsx',
  'src/app/volunteer/page.tsx',
  'src/app/donate/page.tsx',
  'src/app/planner/page.tsx',
  'src/app/studio/page.tsx',
  'src/app/admin/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/split\('\\\\n\\\\n'\)/g, "split('\\n\\n')");
    content = content.replace(/split\('\\\\n'\)/g, "split('\\n')");
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
