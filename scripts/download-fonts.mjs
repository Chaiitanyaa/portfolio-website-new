import { writeFileSync, mkdirSync, existsSync } from 'fs';

const fontsDir = '../public/fonts';
if (!existsSync(fontsDir)) {
  mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
  {
    url: 'https://fonts.gstatic.com/s/instrumentserif/v4/jizBRFtNs2ka5fCjOA7mOIGSTchOSMI0.woff2',
    filename: 'InstrumentSerif-Regular.woff2',
  },
  {
    url: 'https://fonts.gstatic.com/s/instrumentserif/v4/jizHRFtNs2ka5fCjOA7mOIGSPquBRA4g6g.woff2',
    filename: 'InstrumentSerif-Italic.woff2',
  },
];

for (const font of fonts) {
  console.log(`Downloading ${font.filename}...`);
  const response = await fetch(font.url);
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(`${fontsDir}/${font.filename}`, buffer);
  console.log(`Saved ${font.filename}`);
}

console.log('All fonts downloaded successfully!');
