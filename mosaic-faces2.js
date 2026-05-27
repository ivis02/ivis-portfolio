/**
 * 얼굴 자동 모자이크 스크립트 (opencv-wasm + sharp)
 * 실행: node mosaic-faces2.js
 */
'use strict';
const path  = require('path');
const fs    = require('fs');
const https = require('https');
const sharp = require('sharp');
const { cv } = require('opencv-wasm');

const TARGETS = [
  '주간카드뉴스_4월_3주차_이미소',
  '주간카드뉴스_4월_4주차',
  '카드뉴스_5월_1주차',
  '260408_연제고분판타지축제_카드뉴스_이미소',
];
const CARDNEWS_DIR = path.join(__dirname, 'images', 'cardnews');
const CASCADE_PATH = path.join(__dirname, 'haarcascade_frontalface_default.xml');
const CASCADE_URL  = 'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml';
const PIXEL_SIZE   = 14;
const PADDING      = 0.30;

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(); return; }
    console.log('  cascade XML 다운로드 중...');
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function loadCascade() {
  const xmlData = fs.readFileSync(CASCADE_PATH, 'utf8');
  cv.FS_createDataFile('/', 'face.xml', xmlData, true, false, false);
  const cascade = new cv.CascadeClassifier();
  cascade.load('face.xml');
  return cascade;
}

async function detectFaces(cascade, origBuf, width, height) {
  const { data } = await sharp(origBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const imgData = { data: new Uint8ClampedArray(data.buffer), width, height };
  const src  = cv.matFromImageData(imgData);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.equalizeHist(gray, gray);

  const faces   = new cv.RectVector();
  const minSize = new cv.Size(30, 30);
  const maxSize = new cv.Size(0, 0);
  cascade.detectMultiScale(gray, faces, 1.1, 4,
    cv.CASCADE_SCALE_IMAGE, minSize, maxSize);

  const result = [];
  for (let i = 0; i < faces.size(); i++) {
    const r = faces.get(i);
    const padX = r.width  * PADDING;
    const padY = r.height * PADDING;
    result.push({
      left:   Math.max(0,      Math.round(r.x              - padX)),
      top:    Math.max(0,      Math.round(r.y              - padY)),
      right:  Math.min(width,  Math.round(r.x + r.width  + padX)),
      bottom: Math.min(height, Math.round(r.y + r.height + padY)),
    });
  }

  src.delete(); gray.delete(); faces.delete();
  return result;
}

async function pixelateRegion(origBuf, left, top, right, bottom) {
  const w = right - left;
  const h = bottom - top;
  if (w < 4 || h < 4) return null;
  const pixW = Math.max(1, Math.round(w / PIXEL_SIZE));
  const pixH = Math.max(1, Math.round(h / PIXEL_SIZE));
  const buf = await sharp(origBuf)
    .extract({ left, top, width: w, height: h })
    .resize(pixW, pixH, { kernel: 'nearest' })
    .resize(w, h, { kernel: 'nearest' })
    .png()
    .toBuffer();
  return { input: buf, left, top };
}

async function processImage(cascade, filePath) {
  const meta = await sharp(filePath).metadata();
  const { width, height } = meta;
  const origBuf = await sharp(filePath).png().toBuffer();
  const faces = await detectFaces(cascade, origBuf, width, height);
  if (!faces.length) return 0;

  const overlays = (await Promise.all(
    faces.map(f => pixelateRegion(origBuf, f.left, f.top, f.right, f.bottom))
  )).filter(Boolean);
  if (!overlays.length) return 0;

  await sharp(origBuf).composite(overlays).png().toFile(filePath);
  return faces.length;
}

async function main() {
  await downloadFile(CASCADE_URL, CASCADE_PATH);
  console.log('cascade 로드 중...');
  const cascade = await loadCascade();
  console.log('준비 완료\n');

  for (const folder of TARGETS) {
    const dir = path.join(CARDNEWS_DIR, folder);
    if (!fs.existsSync(dir)) { console.log(`폴더 없음: ${folder}`); continue; }
    console.log(`[${folder}]`);
    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
      .sort();
    for (const file of files) {
      const fp = path.join(dir, file);
      process.stdout.write(`  ${file} ... `);
      try {
        const n = await processImage(cascade, fp);
        console.log(n ? `✓ 얼굴 ${n}개 모자이크` : '얼굴 없음');
      } catch (e) {
        console.log(`오류: ${e.message}`);
      }
    }
  }
  cascade.delete();
  console.log('\n완료!');
}

main();
