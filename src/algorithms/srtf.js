import { buildSimulationResult } from './helper.js';

/**
 * Shortest Remaining Time First (SRTF) Scheduling (Preemptive SJF)
 * At each unit step, process with smallest remaining burst time is executed.
 * Preempts current process if a newly arrived process has shorter remaining time.
 */
export function simulateSRTF(processes) {
  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'srtf',
      algorithmName: 'Shortest Remaining Time First',
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

  const compareSRTF = (a, b) => {
    if (a.remainingTime !== b.remainingTime) return a.remainingTime - b.remainingTime;
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  };

  while (completedCount < n) {
    // Ready processes at time t
    const readyProcs = [];
    for (let i = 0; i < procs.length; i++) {
      if (procs[i].arrivalTime <= t && procs[i].remainingTime > 0) {
        readyProcs.push(procs[i]);
      }
    }

    if (readyProcs.length > 0) {
      let bestCandidate = readyProcs[0];

      for (let i = 1; i < readyProcs.length; i++) {
        const p = readyProcs[i];
        if (p.remainingTime < bestCandidate.remainingTime) {
          bestCandidate = p;
        } else if (p.remainingTime === bestCandidate.remainingTime) {
          if (p.id === currentRunning) {
            bestCandidate = p;
          } else if (bestCandidate.id !== currentRunning) {
            if (p.arrivalTime < bestCandidate.arrivalTime) {
              bestCandidate = p;
            } else if (p.arrivalTime === bestCandidate.arrivalTime) {
              if (p.id.localeCompare(bestCandidate.id, undefined, { numeric: true }) < 0) {
                bestCandidate = p;
              }
            }
          }
        }
      }

      if (currentRunning && currentRunning !== bestCandidate.id) {
        contextSwitches++;
      } else if (!currentRunning && prevRunning && prevRunning !== 'IDLE' && prevRunning !== bestCandidate.id) {
        contextSwitches++;
      }

      currentRunning = bestCandidate.id;

      if (firstExecutionMap[currentRunning] === undefined) {
        firstExecutionMap[currentRunning] = t;
      }
    } else {
      currentRunning = null;
    }

    const queueCandidates = [];
    for (let i = 0; i < readyProcs.length; i++) {
      if (readyProcs[i].id !== currentRunning) {
        queueCandidates.push(readyProcs[i]);
      }
    }
    queueCandidates.sort(compareSRTF);
    const readyQueueIds = queueCandidates.map((p) => p.id);

    if (currentRunning) {
      let activeProc = null;
      for (let i = 0; i < procs.length; i++) {
        if (procs[i].id === currentRunning) {
          activeProc = procs[i];
          break;
        }
      }

      const isPreemption = prevRunning && prevRunning !== 'IDLE' && prevRunning !== activeProc.id;
      const eventMsg = isPreemption
        ? `${activeProc.id} preempted previous process (Remaining: ${activeProc.remainingTime})`
        : `${activeProc.id} executing (Remaining: ${activeProc.remainingTime})`;

      timelineUnits.push({
        t,
        currentRunning: activeProc.id,
        readyQueueIds,
        event: eventMsg,
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
    algorithmId: 'srtf',
    algorithmName: 'Shortest Remaining Time First (SRTF)',
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
