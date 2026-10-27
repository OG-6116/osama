import { buildSimulationResult } from './helper.js';

/**
 * Round Robin (RR) Scheduling
 * Each process gets a fixed time slice (quantum).
 * Queue follows FIFO with textbook tie-breaking on quantum boundary.
 */
export function simulateRoundRobin(processes, timeQuantum = 2) {
  const quantum = Math.max(1, Number(timeQuantum) || 2);

  if (!processes || processes.length === 0) {
    return buildSimulationResult({
      algorithmId: 'rr',
      algorithmName: `Round Robin (Quantum = ${quantum})`,
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
  let prevRunning = null;

  const readyQueue = [];
  const arrivedSet = new Set();
  let completedCount = 0;
  const n = procs.length;

  let currentRunning = null;
  let quantumRemaining = 0;
  let t = 0;

  // Helper to add newly arrived processes at exact time targetTime
  const handleArrivalsAt = (targetTime) => {
    const arrivals = [];
    for (let i = 0; i < procs.length; i++) {
      if (procs[i].arrivalTime === targetTime && !arrivedSet.has(procs[i].id)) {
        arrivals.push(procs[i]);
      }
    }
    arrivals.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

    for (let i = 0; i < arrivals.length; i++) {
      arrivedSet.add(arrivals[i].id);
      readyQueue.push(arrivals[i].id);
    }
  };

  while (completedCount < n) {
    // 1. Check arrivals at current time t
    handleArrivalsAt(t);

    // 2. If no process is currently running, pick from queue
    if (!currentRunning && readyQueue.length > 0) {
      currentRunning = readyQueue.shift();
      quantumRemaining = quantum;

      if (prevRunning && prevRunning !== 'IDLE' && prevRunning !== currentRunning) {
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
        event: `${activeProc.id} running (Remaining: ${activeProc.remainingTime}, Quantum left: ${quantumRemaining})`,
      });

      // Execute 1 unit
      activeProc.remainingTime -= 1;
      quantumRemaining -= 1;
      prevRunning = activeProc.id;

      const nextTime = t + 1;

      // Check if process finished
      if (activeProc.remainingTime === 0) {
        completionMap[activeProc.id] = nextTime;
        completedCount++;
        currentRunning = null;
        quantumRemaining = 0;
      } else if (quantumRemaining === 0) {
        // Quantum expired!
        handleArrivalsAt(nextTime);
        readyQueue.push(activeProc.id);
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
    algorithmId: 'rr',
    algorithmName: `Round Robin (RR, q=${quantum})`,
    originalProcesses: processes,
    timelineUnits,
    firstExecutionMap,
    completionMap,
    contextSwitches,
  });
}
