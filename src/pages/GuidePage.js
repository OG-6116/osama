import React from 'react';
import { BookOpen, HelpCircle, AlertCircle, CheckCircle, Clock, Zap, Cpu, Sparkles } from 'lucide-react';

export default function GuidePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1000, margin: '0 auto' }}>
      {/* 1. Header */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 12 }}>
          <div className="section-title" style={{ fontSize: '1.4rem' }}>
            <BookOpen size={24} color="#60A5FA" />
            <span>Operating System CPU Scheduling Guide</span>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          CPU Scheduling is the process by which an operating system decides which of the processes in the ready queue
          is to be allocated the CPU core. A good CPU scheduling algorithm aims to maximize CPU utilization and throughput
          while minimizing turnaround time, waiting time, and response time.
        </p>
      </div>

      {/* 2. Core Scheduling Formulas & Metrics */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">
            <Clock size={20} color="#10B981" />
            <span>Essential Scheduling Metrics & Formulas</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {/* Arrival Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 10,
            padding: 16,
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontWeight: 700, color: '#60A5FA', marginBottom: 4 }}>
              Arrival Time (AT)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              The exact time instant at which a process enters the ready queue and is available for execution.
            </div>
          </div>

          {/* Burst Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 10,
            padding: 16,
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>
              Burst Time (BT / Execution Time)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              The amount of CPU time required by the process to complete its total execution.
            </div>
          </div>

          {/* Completion Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 10,
            padding: 16,
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontWeight: 700, color: '#34D399', marginBottom: 4 }}>
              Completion Time (CT)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              The time instant at which the process finishes its complete burst execution.
            </div>
          </div>

          {/* Turnaround Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 10,
            padding: 16,
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontWeight: 700, color: '#A78BFA', marginBottom: 4 }}>
              Turnaround Time (TAT)
            </div>
            <code style={{ fontSize: '0.85rem', color: '#C4B5FD', display: 'block', marginBottom: 6 }}>
              TAT = Completion Time - Arrival Time
            </code>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total elapsed time spent by the process from its arrival until its completion.
            </div>
          </div>

          {/* Waiting Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 10,
            padding: 16,
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontWeight: 700, color: '#FB7185', marginBottom: 4 }}>
              Waiting Time (WT)
            </div>
            <code style={{ fontSize: '0.85rem', color: '#FDA4AF', display: 'block', marginBottom: 6 }}>
              WT = Turnaround Time - Burst Time
            </code>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total time spent by the process waiting in the ready queue for CPU allocation.
            </div>
          </div>

          {/* Response Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 10,
            padding: 16,
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: 4 }}>
              Response Time (RT)
            </div>
            <code style={{ fontSize: '0.85rem', color: '#7DD3FC', display: 'block', marginBottom: 6 }}>
              RT = First Execution Time - Arrival Time
            </code>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Time taken from arrival until the process is granted the CPU for the very first time.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Dive into the 6 Algorithms */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-title">
            <Cpu size={20} color="#8B5CF6" />
            <span>Algorithm Analysis & Comparisons</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* FCFS */}
          <div style={{
            borderLeft: '4px solid #3B82F6',
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>1. First-Come, First-Served (FCFS)</h3>
              <span className="badge badge-non-preemptive">Non-Preemptive</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Executes processes in the strict order of arrival using a FIFO queue. Once a process gets the CPU, it runs until finished.
            </p>
            <div style={{
              marginTop: 8,
              fontSize: '0.8rem',
              color: '#FCD34D',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '6px 10px',
              borderRadius: 6,
            }}>
              <strong>Convoy Effect:</strong> If a CPU-heavy process arrives first, all following short processes are forced to wait, leading to high average waiting times.
            </div>
          </div>

          {/* SJF */}
          <div style={{
            borderLeft: '4px solid #10B981',
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>2. Shortest Job First (SJF)</h3>
              <span className="badge badge-non-preemptive">Non-Preemptive</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Selects the process with the smallest initial Burst Time among all arrived candidates. Once chosen, it runs to completion without preemption. Proven to give the minimum average waiting time among all non-preemptive algorithms.
            </p>
          </div>

          {/* SRTF */}
          <div style={{
            borderLeft: '4px solid #8B5CF6',
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>3. Shortest Remaining Time First (SRTF)</h3>
              <span className="badge badge-preemptive">Preemptive</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Preemptive variant of SJF. At every time unit, if a new process arrives with a remaining burst time shorter than the currently running process, the CPU preempts the running process and switches to the newly arrived shorter process.
            </p>
          </div>

          {/* Round Robin */}
          <div style={{
            borderLeft: '4px solid #F59E0B',
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>4. Round Robin (RR)</h3>
              <span className="badge badge-preemptive">Preemptive</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Designed specifically for time-sharing systems. Each process is allocated a fixed time quantum <code>q</code>. If unfinished when the quantum expires, the process is preempted and returned to the tail of the ready queue.
            </p>
            <div style={{
              marginTop: 8,
              fontSize: '0.8rem',
              color: '#93C5FD',
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '6px 10px',
              borderRadius: 6,
            }}>
              <strong>Quantum Selection Tradeoff:</strong> If <code>q</code> is too large, RR degrades into FCFS. If <code>q</code> is too small, context-switching overhead slows down system throughput.
            </div>
          </div>

          {/* Priority Non-Preemptive */}
          <div style={{
            borderLeft: '4px solid #EC4899',
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>5. Priority Scheduling (Non-Preemptive)</h3>
              <span className="badge badge-non-preemptive">Non-Preemptive</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Each process is assigned an integer priority. When the CPU becomes free, the ready process with the highest priority is scheduled and runs to completion.
            </p>
          </div>

          {/* Priority Preemptive */}
          <div style={{
            borderLeft: '4px solid #06B6D4',
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>6. Priority Scheduling (Preemptive)</h3>
              <span className="badge badge-preemptive">Preemptive</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              If a higher-priority process arrives while a lower-priority process is currently running, the CPU immediately preempts the current process and assigns the CPU to the newcomer.
            </p>
            <div style={{
              marginTop: 8,
              fontSize: '0.8rem',
              color: '#FDA4AF',
              background: 'rgba(244, 63, 94, 0.1)',
              padding: '6px 10px',
              borderRadius: 6,
            }}>
              <strong>Starvation & Aging:</strong> Low-priority processes may wait indefinitely if higher-priority processes keep arriving. Modern OSes use "Aging" (gradually increasing a process's priority the longer it waits in queue) to prevent starvation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
