import { buildSimulationResult } from './helper.js';

/**
 * First-Come, First-Served (FCFS) Scheduling
 * Non-preemptive algorithm: processes are dispatched in arrival order.
 */
export function simulateFCFS(processes) {
  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'fcfs',
      algorithmName: 'First-Come, First-Served',
      originalProcesses: [],
      timelineUnits: [],
      firstExecutionMap: {},
      completionMap: {},
    });
  }

  // Clone processes
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

  const readyQueue = [];
  const arrivedSet = new Set();
  let completedCount = 0;
  const n = procs.length;
  let t = 0;

  while (completedCount < n) {
    // 1. Check newly arrived processes at time t
    const newArrivals = [];
    for (let i = 0; i < procs.length; i++) {
      const p = procs[i];
      if (p.arrivalTime === t && !arrivedSet.has(p.id)) {
        newArrivals.push(p);
      }
    }
    newArrivals.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

    for (let i = 0; i < newArrivals.length; i++) {
      arrivedSet.add(newArrivals[i].id);
      readyQueue.push(newArrivals[i].id);
    }

    // Catch any earlier arrivals if time jumped
    for (let i = 0; i < procs.length; i++) {
      const p = procs[i];
      if (p.arrivalTime <= t && !arrivedSet.has(p.id)) {
        arrivedSet.add(p.id);
        readyQueue.push(p.id);
      }
    }

    // 2. If no process is running, take next from readyQueue
    if (!currentRunning && readyQueue.length > 0) {
      currentRunning = readyQueue.shift();
      if (prevRunning && prevRunning !== currentRunning) {
        contextSwitches++;
      }
      if (firstExecutionMap[currentRunning] === undefined) {
        firstExecutionMap[currentRunning] = t;
      }
    }

    // 3. Record unit step [t, t+1)
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
        readyQueueIds: [...readyQueue],
        event: `${activeProc.id} executing (Remaining: ${activeProc.remainingTime})`,
      });

      // Execute 1 unit
      activeProc.remainingTime -= 1;
      prevRunning = activeProc.id;

      // Check if finished
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
    algorithmId: 'fcfs',
    algorithmName: 'First-Come, First-Served (FCFS)',
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
