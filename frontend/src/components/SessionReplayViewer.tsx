'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, AlertCircle, Clock, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReplayData {
  time: number;
  code: string;
  questionId: string;
}

interface SessionReplayViewerProps {
  candidateName: string;
  codeReplayData: string | null;
  videoRecording: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SessionReplayViewer({ candidateName, codeReplayData, videoRecording, isOpen, onClose }: SessionReplayViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const replaySnapshots: ReplayData[] = codeReplayData ? JSON.parse(codeReplayData) : [];

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Reset state on open
      setCurrentTime(0);
      setIsPlaying(false);
      if (replaySnapshots.length > 0) {
        setCurrentCode(replaySnapshots[0].code);
      }
    }
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const timeMs = videoRef.current.currentTime * 1000;
      setCurrentTime(timeMs);
      
      // Find the latest snapshot that is <= current video time
      let latestSnapshot = replaySnapshots[0];
      for (let i = 0; i < replaySnapshots.length; i++) {
        if (replaySnapshots[i].time <= timeMs) {
          latestSnapshot = replaySnapshots[i];
        } else {
          break; // Since it's ordered by time, we can break early
        }
      }
      
      if (latestSnapshot) {
        setCurrentCode(latestSnapshot.code);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration * 1000);
    }
  };

  if (!videoRecording || !codeReplayData) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <AlertCircle className="w-12 h-12 mb-4 text-slate-600" />
            <p>No replay data is available for this candidate.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-950 border-slate-800 text-white p-0">
        <DialogHeader className="p-4 border-b border-slate-800 bg-slate-900">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Video className="w-5 h-5 text-indigo-400" />
            Session Replay: {candidateName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-black">
          
          {/* Main Code Viewer */}
          <div className="md:col-span-3 rounded-lg overflow-hidden border border-slate-800 flex flex-col bg-slate-900">
            <div className="bg-slate-800 p-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span>Code Editor State</span>
              <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-indigo-400">
                {(currentTime / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">
                {currentCode || '// Candidate has not typed anything yet.'}
              </pre>
            </div>
          </div>

          {/* Video Player */}
          <div className="md:col-span-1 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex flex-col">
            <div className="bg-slate-800 p-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Candidate Webcam
            </div>
            <div className="flex-1 bg-black flex items-center justify-center">
              <video 
                ref={videoRef}
                src={videoRecording}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-auto max-h-[300px] object-contain"
              />
            </div>
            
            {/* Playback Controls */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={togglePlay} 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full w-12 h-12 bg-indigo-600 hover:bg-indigo-500 border-0 text-white"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">{(currentTime / 1000).toFixed(1)}s</span>
                <input 
                  type="range" 
                  min={0} 
                  max={duration} 
                  value={currentTime} 
                  onChange={(e) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Number(e.target.value) / 1000;
                    }
                  }}
                  className="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500" 
                />
                <span className="text-[10px] font-mono text-slate-500">{(duration / 1000).toFixed(1)}s</span>
              </div>
            </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}
