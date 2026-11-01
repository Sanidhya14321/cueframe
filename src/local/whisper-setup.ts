/* biome-ignore-all lint/performance/noAwaitInLoops: local actions, leases and media steps must execute in order */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runProcess } from './audio';
import { ensureDirectory, serial } from './files';
import { readSettings } from './settings';

const whisperTools = async () => {
  const folder = join((await readSettings()).dataFolder, 'tools');
  await ensureDirectory(folder);
  return {
    folder,
    source: join(folder, 'whisper-v1.9.5'),
    model: join(folder, 'ggml-tiny.en.bin'),
  };
};
const fetchFile = async (url: string, path: string, checksum?: string) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(300000) });
  if (!response.ok) {
    throw new Error('Could not download a required local transcription file.');
  }
  const data = Buffer.from(await response.arrayBuffer());
  if (checksum && createHash('sha256').update(data).digest('hex') !== checksum) {
    throw new Error('Download checksum mismatch.');
  }
  await writeFile(path, data, { mode: 0o600 });
};
const ensureCMake = async (folder: string) => {
  let cmake = 'cmake';
  try {
    await runProcess(cmake, ['--version']);
  } catch {
    if (!['darwin', 'linux'].includes(process.platform)) {
      throw new Error('Install CMake and a C++ compiler, then retry local transcription.');
    }
    const response = await fetch('https://pypi.org/pypi/cmake/4.4.4/json', {
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      throw new Error('Could not find the local build tool.');
    }
    const metadata = (await response.json()) as {
      urls: { filename: string; url: string; digests: { sha256: string } }[];
    };
    const wheel = metadata.urls.find((file) =>
      process.platform === 'darwin'
        ? file.filename.includes('macosx') && file.filename.includes('universal2')
        : file.filename.includes('manylinux') &&
          file.filename.includes(process.arch === 'arm64' ? 'aarch64' : 'x86_64'),
    );
    if (!wheel) {
      throw new Error('Install CMake for this platform, then retry.');
    }
    const archive = join(folder, 'cmake.whl');
    await fetchFile(wheel.url, archive, wheel.digests.sha256);
    await runProcess('unzip', ['-q', '-o', archive, '-d', join(folder, 'cmake')]);
    cmake = join(folder, 'cmake', 'cmake', 'data', 'bin', 'cmake');
  }
  return cmake;
};
export const setupWhisper = (update: (progress: number, label: string) => Promise<void>) =>
  serial('whisper-install', async () => {
    const paths = await whisperTools();
    const binary = join(
      paths.source,
      'build',
      'bin',
      process.platform === 'win32' ? 'whisper-cli.exe' : 'whisper-cli',
    );
    if (!existsSync(binary)) {
      await update(0.05, 'Preparing the MIT-licensed local Whisper engine');
      const cmake = await ensureCMake(paths.folder);
      if (!existsSync(paths.source)) {
        await runProcess(
          'git',
          [
            'clone',
            '--depth',
            '1',
            '--branch',
            'v1.9.5',
            'https://github.com/ggml-org/whisper.cpp.git',
            paths.source,
          ],
          300000,
        );
      }
      const revision = (await runProcess('git', ['-C', paths.source, 'rev-parse', 'HEAD']))
        .toString()
        .trim();
      // biome-ignore lint/security/noSecrets: public pinned Whisper Git commit
      if (revision !== 'd1be6fde11ac6e0407606b4e42fe72d34add8037') {
        throw new Error('The Whisper source revision does not match its pinned release.');
      }
      const sourceLicense = await readFile(join(paths.source, 'LICENSE'), 'utf8');
      if (!sourceLicense.includes('MIT License')) {
        throw new Error('Whisper engine license check failed.');
      }
      await update(0.15, 'Building the local Whisper engine');
      await runProcess(
        cmake,
        [
          '-S',
          paths.source,
          '-B',
          join(paths.source, 'build'),
          '-DGGML_METAL=OFF',
          '-DWHISPER_BUILD_TESTS=OFF',
          '-DWHISPER_BUILD_EXAMPLES=ON',
          '-DCMAKE_BUILD_TYPE=Release',
        ],
        300000,
      );
      await runProcess(
        cmake,
        [
          '--build',
          join(paths.source, 'build'),
          '--config',
          'Release',
          '--target',
          'whisper-cli',
          '-j',
          '4',
        ],
        600000,
      );
    }
    if (!existsSync(paths.model)) {
      await update(0.4, 'Downloading the English tiny model (about 75 MB)');
      await fetchFile(
        'https://huggingface.co/ggerganov/whisper.cpp/resolve/5359861c739e955e79d9a303bcbc70fb988958b1/ggml-tiny.en.bin',
        paths.model,
      );
    }
    const license = await readFile(join(paths.source, 'LICENSE'), 'utf8');
    if (!license.includes('MIT License')) {
      throw new Error('Whisper engine license check failed.');
    }
    return { ...paths, binary };
  });
