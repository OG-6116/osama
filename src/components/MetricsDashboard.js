import React, { useState } from 'react';
import { getProcessColor } from '../utils/colors.js';
import {
  Timer,
  Hourglass,
  Gauge,
  Repeat,
  Copy,
  Check,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MetricsDashboard({ simulationResult, currentTime }) {
  const { summary, processStats, timelineSteps } = simulationResult;
  const [copied, setCopied] = useState(false);
  const [showCalculations, setShowCalculations] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState(processStats[0]?.id || null);

  const step = (timelineSteps && timelineSteps[currentTime]) || {};
  const processStates = step.processStates || {};

  // Copy table as CSV
  const handleCopyCSV = () => {
    const headers = ['Process', 'AT', 'BT', 'Priority', 'CT', 'TAT', 'WT', 'RT'];
    const rows = processStats.map((p) => [
      p.id,
      p.arrivalTime,
      p.burstTime,
      p.priority,
      p.completionTime,
      p.turnaroundTime,
      p.waitingTime,
      p.responseTime,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    navigator.clipboard.writeText(csvContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedProc = processStats.find((p) => p.id === selectedProcessId) || processStats[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {/* Avg Waiting Time */}
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Avg Waiting Time
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Hourglass size={18} color="#60A5FA" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
            {summary.avgWaitingTime} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#93C5FD', marginTop: 4 }}>
            WT = Turnaround - Burst
          </div>
        </div>

        {/* Avg Turnaround Time */}
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Avg Turnaround Time
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Timer size={18} color="#A78BFA" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
            {summary.avgTurnaroundTime} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#C4B5FD', marginTop: 4 }}>
            TAT = Completion - Arrival
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Avg Response Time
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={18} color="#34D399" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
            {summary.avgResponseTime} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6EE7B7', marginTop: 4 }}>
            RT = First CPU Run - Arrival
          </div>
        </div>

        {/* CPU Utilization */}
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              CPU Utilization
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Gauge size={18} color="#FBBF24" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
            {summary.cpuUtilization}%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#FCD34D', marginTop: 4 }}>
            Total Busy Time / Total Time
          </div>
        </div>

        {/* Context Switches */}
        <div className="glass-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Context Switches
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Repeat size={18} color="#FB7185" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
            {summary.contextSwitches}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#FDA4AF', marginTop: 4 }}>
            Process preemptions & switches
          </div>
        </div>
      </div>

      {/* 2. Process Performance Table */}
      <div className="glass-card">
        <div className="section-header">
          <div>
            <div className="section-title">
              <FileSpreadsheet size={20} color="#60A5FA" />
              <span>Detailed Process Performance Table</span>
            </div>
            <div className="section-subtitle">
              Calculated completion, turnaround, waiting, and response metrics per process (click any row to view step-by-step substitution)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowCalculations(!showCalculations)}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '6px 12px',
                borderColor: showCalculations ? '#3B82F6' : undefined,
                color: showCalculations ? '#60A5FA' : undefined,
              }}
            >
              <Calculator size={14} />
              <span>{showCalculations ? 'Hide Formulas' : 'Show Formula Steps'}</span>
              {showCalculations ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button
              type="button"
              onClick={handleCopyCSV}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy CSV'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-secondary print-button"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              title="Print Lab Report or Save as PDF"
            >
              <Printer size={14} />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <th style={{ padding: '10px 12px' }}>Process</th>
                <th style={{ padding: '10px 12px' }}>Arrival (AT)</th>
                <th style={{ padding: '10px 12px' }}>Burst (BT)</th>
                <th style={{ padding: '10px 12px' }}>Priority</th>
                <th style={{ padding: '10px 12px' }}>Completion (CT)</th>
                <th style={{ padding: '10px 12px' }}>Turnaround (TAT)</th>
                <th style={{ padding: '10px 12px' }}>Waiting (WT)</th>
                <th style={{ padding: '10px 12px' }}>Response (RT)</th>
                <th style={{ padding: '10px 12px' }}>Status (t={currentTime})</th>
              </tr>
            </thead>
            <tbody>
              {processStats.map((p) => {
                const color = getProcessColor(p.id);
                const pState = processStates[p.id];
                const status = pState ? pState.status : 'not_arrived';
                const isSelected = selectedProcessId === p.id;

                let statusBadgeBg = 'rgba(100, 116, 139, 0.2)';
                let statusColor = '#94A3B8';
                let statusLabel = 'Not Arrived';

                if (status === 'running') {
                  statusBadgeBg = 'rgba(59, 130, 246, 0.25)';
                  statusColor = '#93C5FD';
                  statusLabel = 'Running';
                } else if (status === 'ready') {
                  statusBadgeBg = 'rgba(245, 158, 11, 0.2)';
                  statusColor = '#FCD34D';
                  statusLabel = 'In Ready Queue';
                } else if (status === 'completed') {
                  statusBadgeBg = 'rgba(16, 185, 129, 0.2)';
                  statusColor = '#6EE7B7';
                  statusLabel = 'Completed';
                }

                return (
                  <tr
                    key={p.id}
                    onClick={() => {
                      setSelectedProcessId(p.id);
                      setShowCalculations(true);
                    }}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'all 0.15s ease',
                      backgroundColor: isSelected
                        ? 'rgba(59, 130, 246, 0.12)'
                        : status === 'running'
                        ? 'rgba(59, 130, 246, 0.06)'
                        : 'transparent',
                      cursor: 'pointer',
                    }}
                    title="Click to view detailed formula calculations"
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          backgroundColor: color.bg,
                          color: '#FFF',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {p.id}
                        </div>
                        <span style={{ fontWeight: 600 }}>{p.id}</span>
                      </div>
                    </td>

                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>
                      {p.arrivalTime} ms
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>
                      {p.burstTime} ms
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>
                      {p.priority}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#60A5FA' }}>
                      {p.completionTime} ms
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#A78BFA' }}>
                      {p.turnaroundTime} ms
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34D399' }}>
                      {p.waitingTime} ms
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>
                      {p.responseTime} ms
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 12,
                        backgroundColor: statusBadgeBg,
                        color: statusColor,
                      }}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{
                borderTop: '2px solid var(--border-color)',
                fontWeight: 700,
                fontSize: '0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}>
                <td style={{ padding: '12px' }}>Average</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>-</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>-</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>-</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>-</td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#A78BFA' }}>
                  {summary.avgTurnaroundTime} ms
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#34D399' }}>
                  {summary.avgWaitingTime} ms
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#6EE7B7' }}>
                  {summary.avgResponseTime} ms
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>-</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 3. Interactive Formula Calculation Breakdown */}
        {showCalculations && selectedProc && (
          <div style={{
            marginTop: 20,
            padding: 18,
            borderRadius: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Calculator size={18} color="#60A5FA" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                  Step-by-Step Mathematical Calculation Breakdown
                </span>
              </div>

              {/* Process Selector Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select Process:</span>
                {processStats.map((p) => {
                  const isCur = selectedProc.id === p.id;
                  const color = getProcessColor(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProcessId(p.id)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: isCur ? color.bg : 'rgba(255, 255, 255, 0.05)',
                        color: isCur ? '#FFF' : 'var(--text-muted)',
                        border: isCur ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--border-color)',
                      }}
                    >
                      {p.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculations Grid for Selected Process */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}>
              {/* Turnaround Time Calculation */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C4B5FD', marginBottom: 4 }}>
                  Turnaround Time (TAT) for {selectedProc.id}
                </div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 2 }}>
                  TAT = Completion Time (CT) − Arrival Time (AT)
                </div>
                <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#A78BFA' }}>
                  TAT = {selectedProc.completionTime} − {selectedProc.arrivalTime} = {selectedProc.turnaroundTime} ms
                </div>
              </div>

              {/* Waiting Time Calculation */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6EE7B7', marginBottom: 4 }}>
                  Waiting Time (WT) for {selectedProc.id}
                </div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 2 }}>
                  WT = Turnaround Time (TAT) − Burst Time (BT)
                </div>
                <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#34D399' }}>
                  WT = {selectedProc.turnaroundTime} − {selectedProc.burstTime} = {selectedProc.waitingTime} ms
                </div>
              </div>

              {/* Response Time Calculation */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93C5FD', marginBottom: 4 }}>
                  Response Time (RT) for {selectedProc.id}
                </div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 2 }}>
                  RT = First CPU Dispatched − Arrival Time (AT)
                </div>
                <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#60A5FA' }}>
                  RT = {selectedProc.firstExecutionTime} − {selectedProc.arrivalTime} = {selectedProc.responseTime} ms
                </div>
              </div>
            </div>

            {/* System Averages Step-by-Step */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 8,
              padding: '12px 14px',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <span style={{ fontWeight: 700, color: '#FCD34D' }}>System-Wide Workload Summary Equations:</span>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                Average TAT = ({processStats.map((p) => p.turnaroundTime).join(' + ')}) / {processStats.length} = <strong style={{ color: '#A78BFA' }}>{summary.avgTurnaroundTime} ms</strong>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                Average WT = ({processStats.map((p) => p.waitingTime).join(' + ')}) / {processStats.length} = <strong style={{ color: '#34D399' }}>{summary.avgWaitingTime} ms</strong>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                Average RT = ({processStats.map((p) => p.responseTime).join(' + ')}) / {processStats.length} = <strong style={{ color: '#60A5FA' }}>{summary.avgResponseTime} ms</strong>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                CPU Utilization = (({summary.totalTime} − {summary.totalIdleTime}) / {summary.totalTime}) × 100% = <strong style={{ color: '#FBBF24' }}>{summary.cpuUtilization}%</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
