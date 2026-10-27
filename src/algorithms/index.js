import { simulateFCFS } from './fcfs.js';
import { simulateSJF } from './sjf.js';
import { simulateSRTF } from './srtf.js';
import { simulateRoundRobin } from './roundRobin.js';
import { simulatePriorityNonPreemptive } from './priorityNonPreemptive.js';
import { simulatePriorityPreemptive } from './priorityPreemptive.js';

export {
  simulateFCFS,
  simulateSJF,
  simulateSRTF,
  simulateRoundRobin,
  simulatePriorityNonPreemptive,
  simulatePriorityPreemptive,
};

/**
 * Runs a selected scheduling algorithm on the provided processes
 */
export function runSimulation(algorithmId, processes, options = {}) {
  const { timeQuantum = 2, priorityOrder = 'lower' } = options;

  switch (algorithmId) {
    case 'fcfs':
      return simulateFCFS(processes);
    case 'sjf':
      return simulateSJF(processes);
    case 'srtf':
      return simulateSRTF(processes);
    case 'rr':
      return simulateRoundRobin(processes, timeQuantum);
    case 'priority_np':
      return simulatePriorityNonPreemptive(processes, priorityOrder);
    case 'priority_p':
      return simulatePriorityPreemptive(processes, priorityOrder);
    default:
      return simulateFCFS(processes);
  }
}

/**
 * Runs all 6 scheduling algorithms on the same process dataset
 * Used for the Side-by-Side Comparison view
 */
export function runAllAlgorithms(processes, options = {}) {
  const { timeQuantum = 2, priorityOrder = 'lower' } = options;

  return [
    simulateFCFS(processes),
    simulateSJF(processes),
    simulateSRTF(processes),
    simulateRoundRobin(processes, timeQuantum),
    simulatePriorityNonPreemptive(processes, priorityOrder),
    simulatePriorityPreemptive(processes, priorityOrder),
  ];
}
