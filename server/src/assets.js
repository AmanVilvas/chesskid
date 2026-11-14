import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { resolvePrivateAsset } from './security.js';
import { config } from './config.js';
import { HttpError } from './http.js';

const ALLOWED_MEDIA = new Set(['video/mp4', 'video/webm', 'application/pdf']);

function pipePrivateFile(res, fullPath, range = undefined) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(fullPath, range);
    stream.once('error', (error) => {
      if (res.headersSent) {
        res.destroy();
        resolve();
      } else reject(error);
    });
    res.once('finish', resolve);
    res.once('close', resolve);
    stream.pipe(res);
  });
}

export async function streamPrivateAsset(req, res, key, mimeType) {
  if (!ALLOWED_MEDIA.has(mimeType)) throw new HttpError(415, 'unsupported_media', 'This media type is not supported.');
  let fullPath;
  try { fullPath = resolvePrivateAsset(key); } catch { throw new HttpError(404, 'asset_not_found', 'The requested file is unavailable.'); }
  let info;
  try {
    const root = await realpath(config.assetRoot);
    const actual = await realpath(fullPath);
    const relative = path.relative(root, actual);
    if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('Asset path escapes private storage');
    fullPath = actual;
    info = await stat(actual);
  } catch { throw new HttpError(404, 'asset_not_found', 'The requested file is unavailable.'); }
  if (!info.isFile()) throw new HttpError(404, 'asset_not_found', 'The requested file is unavailable.');
  res.set({ 'Content-Type': mimeType, 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' });
  const range = req.headers.range;
  if (!range) {
    res.set('Content-Length', String(info.size));
    return pipePrivateFile(res, fullPath);
  }
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) {
    res.set('Content-Range', `bytes */${info.size}`).status(416).end();
    return;
  }
  let start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
  let end = match[2] && match[1] ? Number(match[2]) : info.size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= info.size) {
    res.set('Content-Range', `bytes */${info.size}`).status(416).end();
    return;
  }
  end = Math.min(end, info.size - 1);
  res.status(206).set({ 'Content-Length': String(end - start + 1), 'Content-Range': `bytes ${start}-${end}/${info.size}` });
  return pipePrivateFile(res, fullPath, { start, end });
}
