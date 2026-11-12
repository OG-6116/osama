import React, { useState, useMemo } from 'react';
import { runAllAlgorithms } from '../algorithms/index.js';
import { PRESETS } from '../utils/constants.js';
import { getProcessColor, IDLE_COLOR } from '../utils/colors.js';
import {
  BarChart3,
  Trophy,
  Shuffle,
  Layers
} from 'lucide-react';

export default function ComparisonPage() {
  const [processes, setProcesses] = useState(PRESETS[0].processes);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [priorityOrder, setPriorityOrder] = useState('lower');

  // Run all 6 algorithms concurrently
  const results = useMemo(() => {
    return runAllAlgorithms(processes, { timeQuantum, priorityOrder });
  }, [processes, timeQuantum, priorityOrder]);

  // Find best performing algorithms
  const bestWT = useMemo(() => {
    if (!results || results.length === 0) return null;
    return [...results].sort((a, b) => a.summary.avgWaitingTime - b.summary.avgWaitingTime)[0];
  }, [results]);

  const bestTAT = useMemo(() => {
    if (!results || results.length === 0) return null;
    return [...results].sort((a, b) => a.summary.avgTurnaroundTime - b.summary.avgTurnaroundTime)[0];
  }, [results]);

  // Calculate global max total time for uniform Gantt chart scale
  const globalMaxTime = useMemo(() => {
    return Math.max(...results.map((r) => r.summary.totalTime), 1);
  }, [results]);

  // Max WT for bar chart scaling
  const maxWT = useMemo(() => {
    return Math.max(...results.map((r) => r.summary.avgWaitingTime), 1);
  }, [results]);

  const handleLoadPreset = (e) => {
    const presetName = e.target.value;
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setProcesses(JSON.parse(JSON.stringify(preset.processes)));
      if (preset.quantum) setTimeQuantum(preset.quantum);
      if (preset.priorityOrder) setPriorityOrder(preset.priorityOrder);
    }
  };

  const handleRandomize = () => {
    const count = Math.floor(Math.random() * 3) + 4;
    const newProcs = [];
    for (let i = 1; i <= count; i++) {
      newProcs.push({
        id: `P${i}`,
        arrivalTime: i === 1 ? 0 : Math.floor(Math.random() * 5),
        burstTime: Math.floor(Math.random() * 7) + 1,
        priority: Math.floor(Math.random() * 4) + 1,
      });
    }
    newProcs.sort((a, b) => a.arrivalTime - b.arrivalTime);
    setProcesses(newProcs);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Header & Controls */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div>
            <div className="section-title">
              <BarChart3 size={20} color="#60A5FA" />
              <span>Algorithm Comparison Arena</span>
            </div>
            <div className="section-subtitle">
              Simulate and compare all 6 scheduling algorithms concurrently on the identical workload
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <select
              defaultValue=""
              onChange={handleLoadPreset}
              className="form-select"
              style={{ width: 'auto', minWidth: 200, fontSize: '0.82rem' }}
            >
              <option value="" disabled>Load Preset Scenario...</option>
              {PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleRandomize}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              <Shuffle size={14} />
              <span>Random Workload</span>
            </button>
          </div>
        </div>

        {/* Workload Snapshot & Parameters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          padding: '12px 16px',
          borderRadius: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-color)',
        }}>
          {/* Processes Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Workload ({processes.length} Processes):
            </span>
            {processes.map((p) => {
              const color = getProcessColor(p.id);
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 8px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    backgroundColor: color.bg,
                    display: 'inline-block',
                  }} />
                  <strong style={{ color: '#FFF' }}>{p.id}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>AT={p.arrivalTime}, BT={p.burstTime}, Pri={p.priority}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Param Adjustment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.78rem', color: '#FCD34D', fontWeight: 600 }}>Quantum (q):</span>
              <input
                type="number"
                min="1"
                max="20"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                style={{
                  width: 50,
                  padding: '4px 6px',
                  borderRadius: 6,
                  background: '#1F2937',
                  border: '1px solid #F59E0B',
                  color: '#FFF',
                  fontWeight: 700,
                  textAlign: 'center',
                  fontSize: '0.8rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.78rem', color: '#F472B6', fontWeight: 600 }}>Priority:</span>
              <select
                value={priorityOrder}
                onChange={(e) => setPriorityOrder(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: '#1F2937',
                  border: '1px solid #EC4899',
                  color: '#FFF',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                <option value="lower">Lower # = Higher Pri</option>
                <option value="higher">Higher # = Higher Pri</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Winner Highlight Card */}
      {bestWT && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
            }}>
              <Trophy size={24} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                Top Performing Algorithm: <span style={{ color: '#6EE7B7' }}>{bestWT.algorithmName}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Achieved the lowest Average Waiting Time of{' '}
                <strong style={{ color: '#10B981' }}>{bestWT.summary.avgWaitingTime} ms</strong> and Turnaround Time of{' '}
                <strong style={{ color: '#A78BFA' }}>{bestWT.summary.avgTurnaroundTime} ms</strong>.
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: 8,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            color: '#A7F3D0',
            fontWeight: 700,
          }}>
            Optimal for this workload
          </div>
        </div>
      )}

      {/* 3. Stacked Synchronized Gantt Charts */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">
            <Layers size={20} color="#8B5CF6" />
            <span>Synchronized Gantt Charts Comparison</span>
          </div>
          <div className="section-subtitle">
            All schedules drawn to uniform scale (0 to {globalMaxTime}ms)
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowX: 'auto' }}>
          {results.map((res) => {
            const isWinner = bestWT && bestWT.algorithmId === res.algorithmId;

            return (
              <div key={res.algorithmId} style={{ minWidth: 640 }}>
                {/* Header for algorithm row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isWinner ? '#6EE7B7' : '#FFFFFF' }}>
                      {res.algorithmName}
                    </span>
                    {isWinner && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#6EE7B7',
                      }}>
                        Lowest WT
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    gap: 12,
                  }}>
                    <span>Avg WT: <strong style={{ color: '#34D399' }}>{res.summary.avgWaitingTime}ms</strong></span>
                    <span>Avg TAT: <strong style={{ color: '#A78BFA' }}>{res.summary.avgTurnaroundTime}ms</strong></span>
                    <span>Switches: <strong style={{ color: '#F472B6' }}>{res.summary.contextSwitches}</strong></span>
                  </div>
                </div>

                {/* Scaled Gantt track */}
                <div style={{
                  position: 'relative',
                  height: 38,
                  background: '#111827',
                  borderRadius: 8,
                  border: isWinner ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                  display: 'flex',
                  overflow: 'hidden',
                }}>
                  {res.ganttSegments.map((seg) => {
                    const isIdle = seg.processId === 'IDLE' || seg.processId === 'Idle';
                    const color = isIdle ? IDLE_COLOR : getProcessColor(seg.processId);
                    const widthPct = (seg.duration / globalMaxTime) * 100;

                    return (
                      <div
                        key={seg.id}
                        className={`gantt-block ${isIdle ? 'idle-pattern' : ''}`}
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: isIdle ? '#1E293B' : color.bg,
                          color: isIdle ? '#94A3B8' : color.text,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRight: '1px solid rgba(0,0,0,0.3)',
                        }}
                        title={`${seg.processId}: ${seg.start}ms - ${seg.end}ms (${seg.duration}ms)`}
                      >
                        {isIdle ? 'Idle' : seg.processId}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Side-by-Side Comparison Table */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">
            <BarChart3 size={20} color="#10B981" />
            <span>Comprehensive Metrics Comparison Table</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <th style={{ padding: '10px 12px' }}>Algorithm</th>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>Total Time (Makespan)</th>
                <th style={{ padding: '10px 12px' }}>Avg Waiting Time</th>
                <th style={{ padding: '10px 12px' }}>Avg Turnaround Time</th>
                <th style={{ padding: '10px 12px' }}>Avg Response Time</th>
                <th style={{ padding: '10px 12px' }}>CPU Utilization</th>
                <th style={{ padding: '10px 12px' }}>Context Switches</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const isBestWT = bestWT && bestWT.algorithmId === r.algorithmId;
                const isBestTAT = bestTAT && bestTAT.algorithmId === r.algorithmId;

                return (
                  <tr
                    key={r.algorithmId}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      backgroundColor: isBestWT ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, color: isBestWT ? '#6EE7B7' : '#FFFFFF' }}>
                          {r.algorithmName}
                        </span>
                        {isBestWT && <Trophy size={14} color="#10B981" />}
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${r.algorithmId.includes('p') || r.algorithmId === 'rr' || r.algorithmId === 'srtf' ? 'badge-preemptive' : 'badge-non-preemptive'}`}>
                        {r.algorithmId.includes('p') || r.algorithmId === 'rr' || r.algorithmId === 'srtf' ? 'Preemptive' : 'Non-Preemptive'}
                      </span>
                    </td>

                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                      {r.summary.totalTime} ms
                    </td>

                    <td style={{
                      padding: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: isBestWT ? '#10B981' : '#E2E8F0',
                    }}>
                      {r.summary.avgWaitingTime} ms
                    </td>

                    <td style={{
                      padding: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: isBestTAT ? '#8B5CF6' : '#E2E8F0',
                    }}>
                      {r.summary.avgTurnaroundTime} ms
                    </td>

                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                      {r.summary.avgResponseTime} ms
                    </td>

                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                      {r.summary.cpuUtilization}%
                    </td>

                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#F472B6' }}>
                      {r.summary.contextSwitches}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Visual Bar Charts for Comparison */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">
            <BarChart3 size={20} color="#F59E0B" />
            <span>Average Waiting Time Comparison (Lower is Better)</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map((r) => {
            const pct = maxWT > 0 ? (r.summary.avgWaitingTime / maxWT) * 100 : 0;
            const isBest = bestWT && bestWT.algorithmId === r.algorithmId;

            return (
              <div key={r.algorithmId} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 140, fontSize: '0.8rem', fontWeight: 600, color: isBest ? '#6EE7B7' : 'var(--text-muted)' }}>
                  {r.algorithmName.split('(')[0]}
                </div>

                <div style={{
                  flex: 1,
                  height: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <div style={{
                    width: `${Math.max(5, pct)}%`,
                    height: '100%',
                    backgroundColor: isBest ? '#10B981' : '#3B82F6',
                    borderRadius: 6,
                    transition: 'width 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: 8,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FFF',
                  }}>
                    {r.summary.avgWaitingTime}ms
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
