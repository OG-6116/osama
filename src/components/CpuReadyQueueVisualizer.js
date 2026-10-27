import { getProcessColor } from '../utils/colors.js';
import { Cpu, ListOrdered, CheckCircle2, Terminal, ArrowRight, Zap, Coffee } from 'lucide-react';

export default function CpuReadyQueueVisualizer({ simulationResult, currentTime }) {
  const { timelineSteps, processStats } = simulationResult;
  const step = timelineSteps[currentTime] || timelineSteps[timelineSteps.length - 1] || {};

  const currentRunningId = step.currentRunning;
  const isIdle = !currentRunningId || currentRunningId === 'IDLE';

  // Find running process details
  const runningProcessStat = !isIdle ? processStats.find((p) => p.id === currentRunningId) : null;
  const runningState = !isIdle && step.processStates ? step.processStates[currentRunningId] : null;

  // Ready queue process details
  const readyQueueIds = step.readyQueue || [];

  // Completed processes
  const completedIds = step.completed || [];

  // Recent events log up to current time (last 4 events)
  const recentEvents = [];
  const startLog = Math.max(0, currentTime - 4);
  for (let i = startLog; i <= currentTime; i++) {
    if (timelineSteps[i] && timelineSteps[i].event) {
      recentEvents.push({
        t: i,
        msg: timelineSteps[i].event,
      });
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
      {/* 1. CPU Core Socket & Ready Queue Card */}
      <div className="glass-card" style={{ gridColumn: 'span 2' }}>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">
            <Cpu size={20} color="#3B82F6" />
            <span>CPU Core & Ready Queue Live State</span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#93C5FD',
            border: '1px solid rgba(59, 130, 246, 0.25)',
          }}>
            Status at t = {currentTime}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 20,
          alignItems: 'stretch',
        }}>
          {/* Active CPU Core Socket */}
          <div style={{
            background: isIdle
              ? 'rgba(30, 41, 59, 0.5)'
              : 'linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(30, 58, 138, 0.2))',
            border: isIdle ? '1px dashed #475569' : '2px solid #3B82F6',
            borderRadius: 14,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: isIdle ? 'none' : '0 0 20px rgba(59, 130, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: isIdle ? 'var(--text-muted)' : '#60A5FA',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Zap size={14} color={isIdle ? '#64748B' : '#60A5FA'} />
                <span>CPU Core 0</span>
              </span>

              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: isIdle ? 'rgba(100, 116, 139, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: isIdle ? '#94A3B8' : '#6EE7B7',
                border: isIdle ? '1px solid #475569' : '1px solid rgba(16, 185, 129, 0.4)',
              }}>
                {isIdle ? 'IDLE' : 'RUNNING'}
              </span>
            </div>

            {/* Core Center Display */}
            <div style={{ textAlign: 'center', margin: '14px 0' }}>
              {isIdle ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <Coffee size={36} color="#64748B" />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    CPU is Idle
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    No process ready in queue
                  </div>
                </div>
              ) : (
                (() => {
                  const color = getProcessColor(currentRunningId);
                  const totalBT = runningProcessStat ? runningProcessStat.burstTime : 1;
                  const remaining = runningState ? runningState.remainingTime : 0;
                  const executed = runningState ? runningState.executedTime : 0;
                  const pct = Math.round((executed / totalBT) * 100);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        backgroundColor: color.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        boxShadow: `0 0 20px ${color.glow}`,
                        animation: 'pulseGlow 2s infinite ease-in-out',
                      }}>
                        {currentRunningId}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Progress: <strong style={{ color: '#FFF' }}>{executed} / {totalBT} ms</strong> (Rem: <strong style={{ color: '#60A5FA' }}>{remaining}ms</strong>)
                        </div>
                        {runningProcessStat && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 2 }}>
                            Priority: {runningProcessStat.priority} | Arrival: {runningProcessStat.arrivalTime}ms
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div style={{
                        width: '100%',
                        height: 6,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        marginTop: 4,
                      }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: color.bg,
                          transition: 'width 0.2s ease',
                        }} />
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <div style={{
              fontSize: '0.72rem',
              textAlign: 'center',
              color: isIdle ? 'var(--text-dim)' : 'var(--text-muted)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: 8,
            }}>
              {isIdle ? 'Standing by for arrivals' : `Executing time slice at t = ${currentTime}`}
            </div>
          </div>

          {/* Ready Queue Conveyor */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 14,
            padding: 16,
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ListOrdered size={18} color="#F59E0B" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Ready Queue (FIFO / Priority Order)
                </span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 10,
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#FCD34D',
              }}>
                {readyQueueIds.length} waiting
              </span>
            </div>

            {/* Conveyor Strip */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              overflowX: 'auto',
              padding: '10px 4px',
              minHeight: 90,
            }}>
              {readyQueueIds.length === 0 ? (
                <div style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dim)',
                  fontSize: '0.82rem',
                  fontStyle: 'italic',
                }}>
                  No processes waiting in ready queue at this moment
                </div>
              ) : (
                readyQueueIds.map((pid, idx) => {
                  const color = getProcessColor(pid);
                  const pStat = processStats.find((p) => p.id === pid);
                  const pState = step.processStates ? step.processStates[pid] : null;

                  return (
                    <React.Fragment key={pid}>
                      <div style={{
                        background: 'rgba(31, 41, 55, 0.9)',
                        border: `1px solid ${color.border}`,
                        borderRadius: 10,
                        padding: '10px 12px',
                        minWidth: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.3)`,
                        flexShrink: 0,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            backgroundColor: color.bg,
                            color: '#FFF',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {pid}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            #{idx + 1}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                          Rem: <strong style={{ color: '#FFF' }}>{pState ? pState.remainingTime : (pStat?.burstTime ?? 0)}ms</strong>
                        </div>

                        {pStat && pStat.priority !== undefined && (
                          <div style={{ fontSize: '0.68rem', color: '#F472B6' }}>
                            Pri: {pStat.priority}
                          </div>
                        )}
                      </div>

                      {idx < readyQueueIds.length - 1 && (
                        <ArrowRight size={16} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Queue Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: 8,
              marginTop: 6,
            }}>
              <span>Head (Next to run)</span>
              <span>Tail (New arrivals enter here)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Completed Processes & Live Scheduler Log */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Completed Bay */}
        <div>
          <div className="section-header" style={{ marginBottom: 10 }}>
            <div className="section-title" style={{ fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} color="#10B981" />
              <span>Completed ({completedIds.length} / {processStats.length})</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            minHeight: 40,
            alignItems: 'center',
          }}>
            {completedIds.length === 0 ? (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                No processes completed yet
              </span>
            ) : (
              completedIds.map((pid) => {
                const color = getProcessColor(pid);
                const pStat = processStats.find((p) => p.id === pid);

                return (
                  <div
                    key={pid}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 8px',
                      borderRadius: 6,
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      backgroundColor: color.bg,
                      color: '#FFF',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {pid}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#A7F3D0', fontFamily: 'var(--font-mono)' }}>
                      CT: {pStat ? pStat.completionTime : '?'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Event Terminal Feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: 8,
          }}>
            <Terminal size={14} color="#60A5FA" />
            <span>Scheduler Event Log</span>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: '#0A0E17',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '10px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            justifyContent: 'flex-end',
            minHeight: 110,
          }}>
            {recentEvents.length === 0 ? (
              <span style={{ color: 'var(--text-dim)' }}>Simulation initialized at t=0...</span>
            ) : (
              recentEvents.map((ev, i) => (
                <div
                  key={`${ev.t}-${i}`}
                  style={{
                    color: ev.t === currentTime ? '#93C5FD' : '#6B7280',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: '#F59E0B' }}>[t={ev.t}]</span> {ev.msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
