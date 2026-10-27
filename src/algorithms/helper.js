/**
 * Helper to build standard simulation result from unit-by-unit execution trace
 */
export function buildSimulationResult({
  algorithmId,
  algorithmName,
  originalProcesses,
  timelineUnits, // array of { t, currentRunning, readyQueueIds, event } for each t from 0 to totalTime - 1
  firstExecutionMap, // map of processId -> first CPU tick
  completionMap, // map of processId -> completion time
  contextSwitches = 0,
}) {
  const totalTime = timelineUnits.length;
  
  // 1. Build Gantt segments by coalescing consecutive identical running processes
  const ganttSegments = [];
  if (totalTime > 0) {
    let currentProc = timelineUnits[0].currentRunning || 'IDLE';
    let start = 0;

    for (let i = 1; i <= totalTime; i++) {
      const nextProc = i < totalTime ? (timelineUnits[i].currentRunning || 'IDLE') : null;
      if (nextProc !== currentProc) {
        ganttSegments.push({
          id: `seg-${ganttSegments.length}`,
          processId: currentProc,
          start,
          end: i,
          duration: i - start,
        });
        currentProc = nextProc;
        start = i;
      }
    }
  }

  // 2. Compute Process Stats
  const processStats = originalProcesses.map((p) => {
    const ct = completionMap[p.id] !== undefined ? completionMap[p.id] : 0;
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    const firstExec = firstExecutionMap[p.id] !== undefined ? firstExecutionMap[p.id] : p.arrivalTime;
    const rt = firstExec - p.arrivalTime;

    return {
      id: p.id,
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime),
      priority: Number(p.priority ?? 1),
      completionTime: Math.max(0, ct),
      turnaroundTime: Math.max(0, tat),
      waitingTime: Math.max(0, wt),
      responseTime: Math.max(0, rt),
      firstExecutionTime: firstExec,
    };
  });

  // 3. Compute Summary Metrics
  const n = originalProcesses.length;
  let totalTAT = 0;
  let totalWT = 0;
  let totalRT = 0;
  let totalIdle = 0;

  processStats.forEach((p) => {
    totalTAT += p.turnaroundTime;
    totalWT += p.waitingTime;
    totalRT += p.responseTime;
  });

  for (let i = 0; i < totalTime; i++) {
    if (!timelineUnits[i].currentRunning || timelineUnits[i].currentRunning === 'IDLE') {
      totalIdle++;
    }
  }

  const avgTurnaroundTime = n > 0 ? Number((totalTAT / n).toFixed(2)) : 0;
  const avgWaitingTime = n > 0 ? Number((totalWT / n).toFixed(2)) : 0;
  const avgResponseTime = n > 0 ? Number((totalRT / n).toFixed(2)) : 0;
  const cpuUtilization = totalTime > 0 ? Number((((totalTime - totalIdle) / totalTime) * 100).toFixed(2)) : 100;
  const throughput = totalTime > 0 ? Number((n / totalTime).toFixed(4)) : 0;

  // 4. Build timeline steps with rich snapshot state for animation scrub/step
  // Each timeline step t in [0 ... totalTime]
  // Pre-calculate cumulative progress for each process
  const timelineSteps = [];
  const execCount = {};
  originalProcesses.forEach((p) => {
    execCount[p.id] = 0;
  });

  for (let t = 0; t <= totalTime; t++) {
    const processStates = {};
    const unit = t < totalTime ? timelineUnits[t] : null;

    originalProcesses.forEach((p) => {
      const executed = execCount[p.id] || 0;
      const remaining = Math.max(0, p.burstTime - executed);
      const isCompleted = executed >= p.burstTime;
      const isArrived = p.arrivalTime <= t;
      const isRunning = unit && unit.currentRunning === p.id;

      let status = 'not_arrived';
      if (isCompleted) {
        status = 'completed';
      } else if (isRunning) {
        status = 'running';
      } else if (isArrived) {
        status = 'ready';
      }

      processStates[p.id] = {
        status,
        executedTime: executed,
        remainingTime: remaining,
        completionTime: isCompleted ? completionMap[p.id] : null,
      };
    });

    // Determine gantt segments visible up to time t
    const currentGantt = [];
    ganttSegments.forEach((seg) => {
      if (seg.start < t) {
        currentGantt.push({
          ...seg,
          activeDuration: Math.min(seg.end, t) - seg.start,
          isCurrent: seg.start <= t && t < seg.end,
        });
      }
    });

    timelineSteps.push({
      t,
      currentRunning: unit ? unit.currentRunning : null,
      readyQueue: unit ? (unit.readyQueueIds || []) : [],
      completed: originalProcesses.filter(p => (execCount[p.id] || 0) >= p.burstTime).map(p => p.id),
      processStates,
      event: unit ? unit.event : (t === totalTime ? 'All processes completed.' : 'Idle'),
      currentGantt,
    });

    // Advance execution count for the unit that just finished
    if (unit && unit.currentRunning && unit.currentRunning !== 'IDLE') {
      execCount[unit.currentRunning] = (execCount[unit.currentRunning] || 0) + 1;
    }
  }

  return {
    algorithmId,
    algorithmName,
    ganttSegments,
    timelineSteps,
    processStats,
    summary: {
      totalTime,
      totalIdleTime: totalIdle,
      cpuUtilization,
      throughput,
      avgTurnaroundTime,
      avgWaitingTime,
      avgResponseTime,
      contextSwitches,
    },
  };
}
