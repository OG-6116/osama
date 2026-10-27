import React, { useState, useEffect, useRef } from 'react';
import { getProcessColor, IDLE_COLOR } from '../utils/colors.js';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Activity
} from 'lucide-react';

export default function AnimatedGanttChart({
  simulationResult,
  currentTime: externalCurrentTime,
  setCurrentTime: externalSetCurrentTime,
  isPlaying: externalIsPlaying,
  setIsPlaying: externalSetIsPlaying,
  speed: externalSpeed,
  setSpeed: externalSetSpeed,
}) {
  const { ganttSegments, summary, timelineSteps } = simulationResult;
  const totalTime = summary.totalTime || 1;

  // Fallback internal state if not controlled
  const [internalCurrentTime, setInternalCurrentTime] = useState(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState(true);
  const [internalSpeed, setInternalSpeed] = useState(1);

  const currentTime = externalCurrentTime !== undefined ? externalCurrentTime : internalCurrentTime;
  const setCurrentTime = externalSetCurrentTime || setInternalCurrentTime;
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const setIsPlaying = externalSetIsPlaying || setInternalIsPlaying;
  const speed = externalSpeed !== undefined ? externalSpeed : internalSpeed;
  const setSpeed = externalSetSpeed || setInternalSpeed;

  const [activeTooltip, setActiveTooltip] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'single', 'swimlane', 'both'

  const timerRef = useRef(null);

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(120, 900 / speed);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, totalTime, setCurrentTime, setIsPlaying]);

  // When simulationResult changes (e.g. new algorithm or new processes), reset to 0 and play
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(true);
  }, [simulationResult, setCurrentTime, setIsPlaying]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTime >= totalTime) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
    }
  };

  // Step controls
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentTime((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentTime((prev) => Math.min(totalTime, prev + 1));
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    setCurrentTime(totalTime);
  };

  // Calculate needle percentage
  const needlePercent = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

  // Process list for swimlanes
  const uniqueProcessIds = Array.from(
    new Set(
      ganttSegments
        .map((s) => s.processId)
        .filter((id) => id && id !== 'IDLE' && id !== 'Idle')
    )
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Header with Clock and Controls */}
      <div className="section-header" style={{ marginBottom: 0 }}>
        <div>
          <div className="section-title">
            <Activity size={20} color="#10B981" />
            <span>Animated Gantt Chart</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#6EE7B7',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              {simulationResult.algorithmName}
            </span>
          </div>
          <div className="section-subtitle">
            Timeline visualization of CPU process scheduling and context transitions
          </div>
        </div>

        {/* Current Time Clock Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '6px 14px',
        }}>
          <Clock size={16} color="#60A5FA" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Time:
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#60A5FA',
            }}>
              t = {currentTime}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              / {totalTime}
            </span>
          </div>

          <div style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: 6,
            fontWeight: 700,
            background: currentTime >= totalTime ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            color: currentTime >= totalTime ? '#6EE7B7' : '#93C5FD',
          }}>
            {currentTime >= totalTime ? 'Finished' : `${Math.round(needlePercent)}%`}
          </div>
        </div>
      </div>

      {/* 2. Interactive Controls & Speed Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '10px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 10,
        border: '1px solid var(--border-color)',
      }}>
        {/* Playback Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary btn-icon"
            title="Reset to t=0"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={handleStepBack}
            disabled={currentTime <= 0}
            className="btn btn-secondary btn-icon"
            title="Step Back 1 unit"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
            style={{ minWidth: 100, gap: 8 }}
          >
            {isPlaying ? (
              <>
                <Pause size={16} fill="currentColor" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>{currentTime >= totalTime ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={currentTime >= totalTime}
            className="btn btn-secondary btn-icon"
            title="Step Forward 1 unit"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            onClick={handleJumpToEnd}
            disabled={currentTime >= totalTime}
            className="btn btn-secondary btn-icon"
            title="Skip to End"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 4 }}>
            View:
          </span>
          <button
            type="button"
            onClick={() => setViewMode('single')}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              background: viewMode === 'single' ? '#3B82F6' : 'rgba(255, 255, 255, 0.05)',
              color: viewMode === 'single' ? '#FFF' : 'var(--text-muted)',
            }}
          >
            Gantt Bar
          </button>
          <button
            type="button"
            onClick={() => setViewMode('swimlane')}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              background: viewMode === 'swimlane' ? '#3B82F6' : 'rgba(255, 255, 255, 0.05)',
              color: viewMode === 'swimlane' ? '#FFF' : 'var(--text-muted)',
            }}
          >
            Swimlanes
          </button>
          <button
            type="button"
            onClick={() => setViewMode('both')}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              background: viewMode === 'both' ? '#3B82F6' : 'rgba(255, 255, 255, 0.05)',
              color: viewMode === 'both' ? '#FFF' : 'var(--text-muted)',
            }}
          >
            Combined
          </button>
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 2 }}>
            Speed:
          </span>
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                backgroundColor: speed === s ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: speed === s ? '#60A5FA' : 'var(--text-muted)',
                border: speed === s ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 3. Scrubber Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 4px' }}>
        <input
          type="range"
          min="0"
          max={totalTime}
          value={currentTime}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentTime(Number(e.target.value));
          }}
          className="timeline-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          <span>t = 0</span>
          <span>Drag scrubber to jump to any time unit</span>
          <span>t = {totalTime}</span>
        </div>
      </div>

      {/* 4. Single-Row Gantt Bar Chart */}
      {(viewMode === 'single' || viewMode === 'both') && (
        <div className="gantt-chart-container" style={{ padding: '8px 0 16px' }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <Layers size={14} color="#60A5FA" />
            <span>Continuous CPU Timeline</span>
          </div>

          <div
            className="gantt-track"
            style={{
              position: 'relative',
              width: '100%',
              minWidth: 500,
              height: 58,
            }}
          >
            {ganttSegments.map((seg) => {
              const isIdle = seg.processId === 'IDLE' || seg.processId === 'Idle';
              const color = isIdle ? IDLE_COLOR : getProcessColor(seg.processId);
              const widthPct = totalTime > 0 ? (seg.duration / totalTime) * 100 : 0;

              // Check if segment has been reached
              const isPast = currentTime >= seg.end;
              const isCurrent = currentTime >= seg.start && currentTime < seg.end;
              const isFuture = currentTime < seg.start;

              // Progress inside current segment
              const elapsedInSeg = isCurrent ? currentTime - seg.start : isPast ? seg.duration : 0;
              const segProgressPct = (elapsedInSeg / seg.duration) * 100;

              return (
                <div
                  key={seg.id}
                  className={`gantt-block ${isIdle ? 'idle-pattern' : ''} ${isCurrent ? 'animated-stripes' : ''}`}
                  onMouseEnter={() => setActiveTooltip(seg)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: isIdle ? '#1E293B' : color.bg,
                    color: isIdle ? '#94A3B8' : color.text,
                    opacity: isFuture ? 0.35 : 1,
                    boxShadow: isCurrent ? `0 0 16px ${color.glow}` : 'none',
                    border: isCurrent ? `2px solid #FFFFFF` : `1px solid rgba(0,0,0,0.3)`,
                    position: 'relative',
                  }}
                >
                  {/* Progress fill overlay for active segment */}
                  {isCurrent && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${segProgressPct}%`,
                        background: 'rgba(255, 255, 255, 0.25)',
                        pointerEvents: 'none',
                        transition: 'width 0.1s linear',
                      }}
                    />
                  )}

                  <span style={{
                    fontWeight: 800,
                    fontSize: seg.duration >= 2 ? '0.92rem' : '0.75rem',
                    letterSpacing: '0.02em',
                    zIndex: 2,
                  }}>
                    {isIdle ? 'Idle' : seg.processId}
                  </span>
                  
                  {seg.duration >= 2 && (
                    <span style={{
                      fontSize: '0.68rem',
                      opacity: 0.85,
                      fontFamily: 'var(--font-mono)',
                      zIndex: 2,
                    }}>
                      [{seg.duration}ms]
                    </span>
                  )}
                </div>
              );
            })}

            {/* Playhead Vertical Needle */}
            <div
              className="gantt-needle"
              style={{
                left: `${needlePercent}%`,
              }}
            >
              <div className="gantt-needle-head" />
            </div>
          </div>

          {/* Time Ticks */}
          <div className="gantt-ticks" style={{ width: '100%', minWidth: 500 }}>
            {/* Start tick 0 */}
            <div className="gantt-tick" style={{ left: '0%' }}>0</div>
            {/* End tick of each segment */}
            {ganttSegments.map((seg) => {
              const leftPct = (seg.end / totalTime) * 100;
              return (
                <div key={`tick-${seg.id}`} className="gantt-tick" style={{ left: `${leftPct}%` }}>
                  {seg.end}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Swimlane Track: Per-Process Row Timeline */}
      {(viewMode === 'swimlane' || viewMode === 'both') && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <Activity size={14} color="#10B981" />
            <span>Process Execution Swimlanes</span>
          </div>

          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            background: 'rgba(0, 0, 0, 0.3)',
            padding: 12,
            borderRadius: 10,
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
          }}>
            {uniqueProcessIds.map((pid) => {
              const color = getProcessColor(pid);

              return (
                <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 500 }}>
                  {/* Process Label */}
                  <div style={{
                    width: 44,
                    height: 26,
                    borderRadius: 6,
                    backgroundColor: color.bg,
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${color.glow}`,
                  }}>
                    {pid}
                  </div>

                  {/* Lane track */}
                  <div style={{
                    position: 'relative',
                    flex: 1,
                    height: 26,
                    background: '#111827',
                    borderRadius: 6,
                    display: 'flex',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}>
                    {Array.from({ length: totalTime }).map((_, unitIndex) => {
                      const step = timelineSteps[unitIndex];
                      const state = step && step.processStates && step.processStates[pid];
                      const status = state ? state.status : 'not_arrived';
                      const isPastOrCurrent = unitIndex < currentTime;

                      let cellBg = 'transparent';
                      let cellOpacity = 0.3;

                      if (status === 'running') {
                        cellBg = color.bg;
                        cellOpacity = isPastOrCurrent ? 1 : 0.35;
                      } else if (status === 'ready') {
                        cellBg = 'rgba(255, 255, 255, 0.08)';
                        cellOpacity = isPastOrCurrent ? 0.9 : 0.3;
                      } else if (status === 'completed') {
                        cellBg = 'rgba(16, 185, 129, 0.06)';
                      }

                      return (
                        <div
                          key={unitIndex}
                          style={{
                            flex: 1,
                            height: '100%',
                            backgroundColor: cellBg,
                            opacity: cellOpacity,
                            borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                            position: 'relative',
                          }}
                          title={`t=${unitIndex}: ${pid} (${status})`}
                        />
                      );
                    })}

                    {/* Swimlane Needle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${needlePercent}%`,
                        width: 2,
                        backgroundColor: '#F43F5E',
                        boxShadow: '0 0 6px #F43F5E',
                        zIndex: 10,
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Hover Tooltip */}
      {activeTooltip && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#0F172A',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: 8,
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 100,
          fontSize: '0.82rem',
        }}>
          <div style={{ fontWeight: 700, color: '#60A5FA', marginBottom: 4 }}>
            Segment: {activeTooltip.processId}
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Start Time: <strong style={{ color: '#FFF' }}>t = {activeTooltip.start}</strong>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            End Time: <strong style={{ color: '#FFF' }}>t = {activeTooltip.end}</strong>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Duration: <strong style={{ color: '#FFF' }}>{activeTooltip.duration}ms</strong>
          </div>
        </div>
      )}
    </div>
  );
}
