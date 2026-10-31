import { setupWhisper } from '../src/local/whisper-setup';

await setupWhisper((progress, label) => {
  console.info(`${Math.round(progress * 100)}% ${label}`);
  return Promise.resolve();
});
console.info('Local Whisper is ready.');
