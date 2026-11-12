import { buildSimulationResult } from './helper.js';

/**
 * Longest Job First (LJF) Scheduling (Non-Preemptive)
 * Selects the process with the longest initial Burst Time.
 * Once scheduled, runs to completion without interruption.
 */
export function simulateLJF(processes) {
  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'ljf',
      algorithmName: 'Longest Job First',
      originalProcesses: [],
      timelineUnits: [],
      firstExecutionMap: {},
      completionMap: {},
    });
  }

  const procs = processes.map((p) => ({
    id: p.id,
    arrivalTime: Math.max(0, Number(p.arrivalTime)),
    burstTime: Math.max(1, Number(p.burstTime)),
    priority: Number(p.priority ?? 1),
    remainingTime: Math.max(1, Number(p.burstTime)),
  }));

  const timelineUnits = [];
  const firstExecutionMap = {};
  const completionMap = {};
  let contextSwitches = 0;
  let currentRunning = null;
  let prevRunning = null;
  let completedCount = 0;
  const n = procs.length;
  let t = 0;

  const compareLJF = (a, b) => {
    if (a.burstTime !== b.burstTime) return b.burstTime - a.burstTime; // Longest first
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  };

  while (completedCount < n) {
    const readyProcs = [];
    for (let i = 0; i < procs.length; i++) {
      if (procs[i].arrivalTime <= t && procs[i].remainingTime > 0) {
        readyProcs.push(procs[i]);
      }
    }

    if (!currentRunning && readyProcs.length > 0) {
      readyProcs.sort(compareLJF);
      currentRunning = readyProcs[0].id;

      if (prevRunning && prevRunning !== 'IDLE' && prevRunning !== currentRunning) {
        contextSwitches++;
      }
      if (firstExecutionMap[currentRunning] === undefined) {
        firstExecutionMap[currentRunning] = t;
      }
    }

    const queueCandidates = [];
    for (let i = 0; i < readyProcs.length; i++) {
      if (readyProcs[i].id !== currentRunning) {
        queueCandidates.push(readyProcs[i]);
      }
    }
    queueCandidates.sort(compareLJF);
    const readyQueueIds = queueCandidates.map((p) => p.id);

    if (currentRunning) {
      let activeProc = null;
      for (let i = 0; i < procs.length; i++) {
        if (procs[i].id === currentRunning) {
          activeProc = procs[i];
          break;
        }
      }

      timelineUnits.push({
        t,
        currentRunning: activeProc.id,
        readyQueueIds,
        event: `${activeProc.id} running (Longest Job: BT=${activeProc.burstTime}, Remaining: ${activeProc.remainingTime})`,
      });

      activeProc.remainingTime -= 1;
      prevRunning = activeProc.id;

      if (activeProc.remainingTime === 0) {
        completionMap[activeProc.id] = t + 1;
        completedCount++;
        currentRunning = null;
      }
    } else {
      timelineUnits.push({
        t,
        currentRunning: 'IDLE',
        readyQueueIds: [],
        event: 'CPU is idle waiting for process arrival',
      });
      prevRunning = 'IDLE';
    }

    t++;
  }

  return buildSimulationResult({
    algorithmId: 'ljf',
    algorithmName: 'Longest Job First (LJF - Non-Preemptive)',
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
