import { parse } from 'vue-docgen-api';
import fs from 'fs';
import path from 'path';

const componentsDir = './src/components';
const outputDir = './docs/components';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function generate() {
  const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.vue'));

  for (const file of files) {
    try {
      const doc = await parse(path.join(componentsDir, file));
      const content = `
# ${doc.displayName || file.replace('.vue', '')}

${doc.description || 'No description provided.'}

## Component Info
- **File:** \`${file}\`
- **Author:** ${doc.tags?.author?.[0]?.description || 'Christopher Herlitz'}
- **Version:** ${doc.tags?.version?.[0]?.description || '1.0.0'}

## Source Code
<<< @/../src/components/${file}
      `;
      fs.writeFileSync(path.join(outputDir, file.replace('.vue', '.md')), content);
      console.log(`Generated docs for ${file}`);
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }
}

generate();
