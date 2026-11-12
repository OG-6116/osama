import { buildSimulationResult } from './helper.js';

/**
 * Highest Response Ratio Next (HRRN) Scheduling (Non-Preemptive)
 * Response Ratio R = (W + S) / S = 1 + (W / S)
 * where W = waiting time so far (t - arrivalTime)
 * and S = service / burst time
 * 
 * Prevents starvation of long jobs by increasing priority as waiting time increases.
 */
export function simulateHRRN(processes) {
  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'hrrn',
      algorithmName: 'Highest Response Ratio Next (HRRN)',
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

  const calculateRatio = (p, currentTime) => {
    const waitingTime = Math.max(0, currentTime - p.arrivalTime);
    return (waitingTime + p.burstTime) / p.burstTime;
  };

  const compareHRRN = (currentTime) => (a, b) => {
    const ratioA = calculateRatio(a, currentTime);
    const ratioB = calculateRatio(b, currentTime);
    if (Math.abs(ratioA - ratioB) > 0.00001) {
      return ratioB - ratioA; // Higher response ratio comes first
    }
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
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
      readyProcs.sort(compareHRRN(t));
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
    queueCandidates.sort(compareHRRN(t));
    const readyQueueIds = queueCandidates.map((p) => p.id);

    if (currentRunning) {
      let activeProc = null;
      for (let i = 0; i < procs.length; i++) {
        if (procs[i].id === currentRunning) {
          activeProc = procs[i];
          break;
        }
      }

      const currentRatio = calculateRatio(activeProc, t).toFixed(2);

      timelineUnits.push({
        t,
        currentRunning: activeProc.id,
        readyQueueIds,
        event: `${activeProc.id} executing (Response Ratio: ${currentRatio}, Remaining: ${activeProc.remainingTime})`,
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
    algorithmId: 'hrrn',
    algorithmName: 'Highest Response Ratio Next (HRRN)',
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
