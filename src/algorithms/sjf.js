import { buildSimulationResult } from './helper.js';

/**
 * Shortest Job First (SJF) Scheduling (Non-Preemptive)
 * When CPU is free, process with the shortest initial burst time is chosen and runs to completion.
 */
export function simulateSJF(processes) {
  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'sjf',
      algorithmName: 'Shortest Job First',
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

  const compareSJF = (a, b) => {
    if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  };

  while (completedCount < n) {
    // Determine which processes are ready (arrived and not completed)
    const readyProcs = [];
    for (let i = 0; i < procs.length; i++) {
      if (procs[i].arrivalTime <= t && procs[i].remainingTime > 0) {
        readyProcs.push(procs[i]);
      }
    }

    // If no process is running, select the best candidate from ready pool
    if (!currentRunning && readyProcs.length > 0) {
      readyProcs.sort(compareSJF);
      currentRunning = readyProcs[0].id;

      if (prevRunning && prevRunning !== currentRunning) {
        contextSwitches++;
      }
      if (firstExecutionMap[currentRunning] === undefined) {
        firstExecutionMap[currentRunning] = t;
      }
    }

    // The ready queue for visualization is all ready processes except the running one
    const queueCandidates = [];
    for (let i = 0; i < readyProcs.length; i++) {
      if (readyProcs[i].id !== currentRunning) {
        queueCandidates.push(readyProcs[i]);
      }
    }
    queueCandidates.sort(compareSJF);
    const readyQueueIds = queueCandidates.map((p) => p.id);

    // Record unit step [t, t+1)
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
        event: `${activeProc.id} running (Shortest Job: BT=${activeProc.burstTime}, Remaining: ${activeProc.remainingTime})`,
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
    algorithmId: 'sjf',
    algorithmName: 'Shortest Job First (SJF - Non-Preemptive)',
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
