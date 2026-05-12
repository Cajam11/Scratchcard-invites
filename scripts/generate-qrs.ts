import fs from 'fs'
import QRCode from 'qrcode'

async function main() {
  const outDir = './qrs'
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  // Example slugs; in real usage read from DB or CSV
  const slugs = ['teacher-jan', 'teacher-maria']
  for (const s of slugs) {
    const url = `${process.env.BASE_URL || 'http://localhost:3000'}/invite/${s}`
    const out = `${outDir}/${s}.png`
    await QRCode.toFile(out, url)
    console.log('Wrote', out)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
