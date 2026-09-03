import * as esbuild from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function build() {
  console.log('Building BluePrint server for production...');
  
  // Clean dist folder
  const distDir = path.join(__dirname, 'dist');
  await fs.remove(distDir);
  await fs.ensureDir(distDir);
  
  // Copy public assets
  const publicDir = path.join(__dirname, 'public');
  if (await fs.pathExists(publicDir)) {
    await fs.copy(publicDir, distDir);
  }
  
  // Build server
  try {
    await esbuild.build({
      entryPoints: [path.join(__dirname, 'src/server.ts')],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: path.join(distDir, 'server.js'),
      external: [
        'express', 'cors', 'dotenv', 'uuid', 'crypto', 'fs-extra', 'path', 
        'react', 'react-dom', 'react-router-dom', 'lucide-react', 'framer-motion',
        'clsx'
      ],
      loader: { '.ts': 'ts' },
      tsconfig: path.join(__dirname, 'tsconfig.json'),
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      sourcemap: true,
      minify: true
    });
    
    console.log('✅ Server build completed successfully');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }
}

build().catch(console.error);