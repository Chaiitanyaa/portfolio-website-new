import fs from "fs";
import path from "path";

const url = process.env.RESUME_PDF_URL; // set this in Netlify env vars
if (!url) {
  console.error("Missing RESUME_PDF_URL env var");
  process.exit(1);
}

const outPath = path.join(process.cwd(), "public", "resume.pdf");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

console.log("Downloading resume from:", url);

const res = await fetch(url);
if (!res.ok) {
  console.error("Failed to download:", res.status, res.statusText);
  process.exit(1);
}

const arrayBuffer = await res.arrayBuffer();
fs.writeFileSync(outPath, Buffer.from(arrayBuffer));

console.log("Saved:", outPath);