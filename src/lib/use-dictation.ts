'use client';
import { useRef, useState } from 'react';

export const useDictation = (onText: (text: string) => void, onMessage: (text: string) => void) => {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const transcribe = async (audio: Blob) => {
    setBusy(true);
    onMessage('Transcribing on this computer. First use also sets up Whisper.');
    try {
      const response = await fetch('/api/voice-input', { method: 'POST', body: audio });
      const result = (await response.json()) as { text?: string; problem?: string };
      if (!response.ok) {
        throw new Error(result.problem);
      }
      if (result.text) {
        onText(result.text);
      }
      onMessage(result.text ? 'Check the text, then send it.' : 'No speech was heard.');
    } catch (error) {
      onMessage(error instanceof Error ? error.message : 'Could not transcribe that recording.');
    } finally {
      setBusy(false);
    }
  };
  const toggle = async () => {
    if (recorder.current) {
      recorder.current.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const next = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      next.ondataavailable = (event) => chunks.push(event.data);
      next.onstop = () => {
        recorder.current = null;
        setRecording(false);
        for (const track of stream.getTracks()) {
          track.stop();
        }
        transcribe(new Blob(chunks, { type: next.mimeType })).catch(() => undefined);
      };
      recorder.current = next;
      next.start();
      setRecording(true);
      onMessage('Listening. Press stop when you finish.');
    } catch {
      onMessage('Allow microphone access in your browser, or type your request.');
    }
  };
  return { recording, busy, toggle };
};
