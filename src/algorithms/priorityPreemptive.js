import { buildSimulationResult } from './helper.js';

/**
 * Priority Scheduling (Preemptive)
 * If a process arrives with higher priority than the current running process,
 * CPU preempts current process.
 */
export function simulatePriorityPreemptive(processes, priorityOrder = 'lower') {
  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'priority_p',
      algorithmName: 'Priority (Preemptive)',
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

    if (readyProcs.length > 0) {
      let best = readyProcs[0];
      for (let i = 1; i < readyProcs.length; i++) {
        const p = readyProcs[i];
        const isBetter = priorityOrder === 'lower' ? p.priority < best.priority : p.priority > best.priority;
        const isEqual = p.priority === best.priority;

        if (isBetter) {
          best = p;
        } else if (isEqual) {
          if (p.id === currentRunning) {
            best = p;
          } else if (best.id !== currentRunning) {
            if (p.arrivalTime < best.arrivalTime) {
              best = p;
            } else if (p.arrivalTime === best.arrivalTime) {
              if (p.id.localeCompare(best.id, undefined, { numeric: true }) < 0) {
                best = p;
              }
            }
          }
        }
      }

      if (currentRunning && currentRunning !== best.id) {
        contextSwitches++;
      } else if (!currentRunning && prevRunning && prevRunning !== 'IDLE' && prevRunning !== best.id) {
        contextSwitches++;
      }

      currentRunning = best.id;

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

      const isPreemption = prevRunning && prevRunning !== 'IDLE' && prevRunning !== activeProc.id;
      const eventMsg = isPreemption
        ? `${activeProc.id} preempted previous process (Priority: ${activeProc.priority}, Remaining: ${activeProc.remainingTime})`
        : `${activeProc.id} executing (Priority: ${activeProc.priority}, Remaining: ${activeProc.remainingTime})`;

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

  const priorityRuleLabel = priorityOrder === 'lower' ? 'Lower # = Higher Priority' : 'Higher # = Higher Priority';

  return buildSimulationResult({
    algorithmId: 'priority_p',
    algorithmName: `Priority (${priorityRuleLabel}, Preemptive)`,
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
