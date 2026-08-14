const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_BASE = 'C:\\Users\\HP\\Downloads\\wetransfer_certificates_2026-08-14_0800';
const TARGET_BASE = path.join(__dirname, '..', 'public', 'awards');

const trophyDir = path.join(TARGET_BASE, 'trophies');
const certDir = path.join(TARGET_BASE, 'certificates');

fs.mkdirSync(trophyDir, { recursive: true });
fs.mkdirSync(certDir, { recursive: true });

async function processFolder(subfolder, targetFolder, prefix) {
  const srcPath = path.join(SOURCE_BASE, subfolder);
  if (!fs.existsSync(srcPath)) {
    console.log('Not found:', srcPath);
    return [];
  }

  const files = fs.readdirSync(srcPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  console.log(`Found ${files.length} images in ${subfolder}`);

  const results = [];

  for (const file of files) {
    const fullSrc = path.join(srcPath, file);
    const baseName = path.parse(file).name.toLowerCase().replace(/\s+/g, '_');
    const outName = `${baseName}.webp`;
    const fullDest = path.join(targetFolder, outName);

    console.log(`Processing: ${file} -> ${outName}`);

    await sharp(fullSrc)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(fullDest);

    const stats = fs.statSync(fullDest);
    console.log(`  Saved ${outName} (${(stats.size / 1024).toFixed(1)} KB)`);

    results.push({
      originalName: file,
      slug: baseName,
      imagePath: `/awards/${prefix}/${outName}`,
      subfolder: prefix,
    });
  }

  return results;
}

async function run() {
  const trophies = await processFolder('Trophy', trophyDir, 'trophies');
  const certificates = await processFolder('Certificates', certDir, 'certificates');
  console.log('\nProcessing completed!');
  console.log('Trophies count:', trophies.length);
  console.log('Certificates count:', certificates.length);
}

run().catch(console.error);
