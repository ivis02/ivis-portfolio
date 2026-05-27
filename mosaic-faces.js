/**
 * 얼굴 자동 모자이크 스크립트 (sharp + @xenova/transformers)
 * 실행: node mosaic-faces.js
 */

'use strict';
const path = require('path');
const fs   = require('fs');
const sharp = require('sharp');

// 모자이크 처리할 카드뉴스 폴더
const TARGETS = [
  '주간카드뉴스_4월_3주차_이미소',
  '주간카드뉴스_4월_4주차',
  '카드뉴스_5월_1주차',
  '260408_연제고분판타지축제_카드뉴스_이미소',
];

const CARDNEWS_DIR = path.join(__dirname, 'images', 'cardnews');
const PIXEL_SIZE   = 14;   // 모자이크 블록 크기 (px)
const PADDING      = 0.28; // 얼굴 주변 여유 비율

async function detectFaces(detector, filePath, width, height) {
  const { RawImage } = await import('@xenova/transformers');
  const image = await RawImage.fromURL('file:///' + filePath.replace(/\\/g, '/'));
  const result = await detector(image, { threshold: 0.45 });
  // 각 박스는 { label, score, box: {xmin,ymin,xmax,ymax} } — 정규화된 좌표
  return result.map(r => {
    const { xmin, ymin, xmax, ymax } = r.box;
    const padX = (xmax - xmin) * PADDING;
    const padY = (ymax - ymin) * PADDING;
    return {
      left:   Math.max(0, Math.round((xmin - padX))),
      top:    Math.max(0, Math.round((ymin - padY))),
      right:  Math.min(width,  Math.round((xmax + padX))),
      bottom: Math.min(height, Math.round((ymax + padY))),
    };
  });
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

async function processImage(detector, filePath) {
  const meta = await sharp(filePath).metadata();
  const { width, height } = meta;
  const faces = await detectFaces(detector, filePath, width, height);
  if (!faces.length) return false;

  const origBuf = await sharp(filePath).png().toBuffer();
  const overlays = (await Promise.all(faces.map(f =>
    pixelateRegion(origBuf, f.left, f.top, f.right, f.bottom)
  ))).filter(Boolean);

  if (!overlays.length) return false;
  await sharp(origBuf).composite(overlays).png().toFile(filePath);
  return true;
}

async function main() {
  console.log('모델 로딩 중... (첫 실행 시 다운로드 발생)');
  const { pipeline } = await import('@xenova/transformers');
  const detector = await pipeline('object-detection', 'Xenova/yolov8n-face');
  console.log('모델 준비 완료\n');

  for (const folder of TARGETS) {
    const dir = path.join(CARDNEWS_DIR, folder);
    if (!fs.existsSync(dir)) { console.log(`폴더 없음: ${folder}`); continue; }

    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
      .sort();

    for (const file of files) {
      const fp = path.join(dir, file);
      process.stdout.write(`  ${folder}/${file} ... `);
      try {
        const done = await processImage(detector, fp);
        console.log(done ? '✓ 모자이크 적용' : '얼굴 없음');
      } catch (e) {
        console.log(`오류: ${e.message}`);
      }
    }
  }
  console.log('\n완료!');
}

main();
