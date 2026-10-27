import { buildSimulationResult } from './helper.js';

/**
 * Priority Scheduling (Non-Preemptive)
 * Process with highest priority is selected when CPU is free, and runs to completion.
 */
export function simulatePriorityNonPreemptive(processes, priorityOrder = 'lower') {
  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'priority_np',
      algorithmName: 'Priority (Non-Preemptive)',
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

  const comparePriority = (a, b) => {
    if (priorityOrder === 'lower') {
      if (a.priority !== b.priority) return a.priority - b.priority;
    } else {
      if (a.priority !== b.priority) return b.priority - a.priority;
    }
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
      readyProcs.sort(comparePriority);
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
    queueCandidates.sort(comparePriority);
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
        event: `${activeProc.id} running (Priority: ${activeProc.priority}, Remaining: ${activeProc.remainingTime})`,
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

  const priorityRuleLabel = priorityOrder === 'lower' ? 'Lower # = Higher Priority' : 'Higher # = Higher Priority';

  return buildSimulationResult({
    algorithmId: 'priority_np',
    algorithmName: `Priority (${priorityRuleLabel}, Non-Preemptive)`,
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
