"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (audioBlob: Blob, duration: number) => void;
}

export default function VoiceRecorderModal({ isOpen, onClose, onSend }: VoiceRecorderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      cleanup();
    }
    
    return () => cleanup();
  }, [isOpen]);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {
        // Ignore errors if already closed
      });
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioLevel(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000));
      }, 100);

      // Start visualization
      visualize();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      onClose();
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Calculate average audio level
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      setAudioLevel(average / 255);

      // Clear canvas
      canvasCtx.fillStyle = 'rgb(15, 23, 42)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        // Gradient from orange to red
        const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#ff6b35');
        gradient.addColorStop(1, '#cc0044');
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const handlePauseResume = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      // Resume
      mediaRecorderRef.current.resume();
      startTimeRef.current = Date.now() - recordingTime * 1000;
      setIsPaused(false);
    } else {
      // Pause
      mediaRecorderRef.current.pause();
      pausedTimeRef.current += Date.now() - startTimeRef.current - recordingTime * 1000;
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    
    // Wait for all data to be collected
    setTimeout(() => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      onSend(audioBlob, recordingTime);
      cleanup();
      onClose();
    }, 100);
  };

  const handleCancel = () => {
    cleanup();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-orange-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-orange-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            <span>Voice Message</span>
          </h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Waveform Visualization */}
        <div className="mb-6 relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="w-full h-32 bg-slate-950 rounded-xl border border-slate-800"
          />
          
          {/* Recording indicator */}
          {isRecording && !isPaused && (
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-red-500/90 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-semibold">REC</span>
            </div>
          )}

          {/* Paused indicator */}
          {isPaused && (
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/90 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white text-xs font-semibold">PAUSED</span>
            </div>
          )}

          {/* Audio level indicator */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all ${
                  audioLevel > i * 0.2 ? 'bg-orange-500 h-4' : 'bg-slate-700 h-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-4xl font-black text-white mb-1">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-slate-400">
            {isPaused ? 'Recording paused' : 'Recording in progress...'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-full transition group"
            title="Cancel"
          >
            <svg className="w-6 h-6 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Pause/Resume Button */}
          <button
            onClick={handlePauseResume}
            className="p-5 bg-yellow-500/20 hover:bg-yellow-500/30 border-2 border-yellow-500 rounded-full transition group"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>

          {/* Stop & Send Button */}
          <button
            onClick={handleStop}
            disabled={recordingTime < 1}
            className="p-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-full transition shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Stop & Send"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Click pause to pause recording • Click send to finish</p>
          <p className="mt-1">Minimum 1 second required</p>
        </div>
      </div>
    </div>
  );
}
