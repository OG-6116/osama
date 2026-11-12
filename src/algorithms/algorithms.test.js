import {
  simulateFCFS,
  simulateSJF,
  simulateSRTF,
  simulateRoundRobin,
  simulatePriorityNonPreemptive,
  simulatePriorityPreemptive,
  simulateHRRN,
  simulateLJF,
} from './index.js';

describe('CPU Scheduling Algorithms', () => {
  const sampleProcesses = [
    { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 2 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
  ];

  test('FCFS runs in arrival order', () => {
    const res = simulateFCFS(sampleProcesses);
    expect(res.processStats.find(p => p.id === 'P1').completionTime).toBe(4);
    expect(res.processStats.find(p => p.id === 'P2').completionTime).toBe(7);
    expect(res.processStats.find(p => p.id === 'P3').completionTime).toBe(8);
    expect(res.summary.totalTime).toBe(8);
  });

  test('SJF runs shortest job when CPU is free', () => {
    const res = simulateSJF(sampleProcesses);
    expect(res.processStats.find(p => p.id === 'P1').completionTime).toBe(4);
    // At t=4, both P2 (burst 3) and P3 (burst 1) are ready. P3 is shorter!
    expect(res.processStats.find(p => p.id === 'P3').completionTime).toBe(5);
    expect(res.processStats.find(p => p.id === 'P2').completionTime).toBe(8);
  });

  test('SRTF preempts currently running process if shorter job arrives', () => {
    const res = simulateSRTF(sampleProcesses);
    // At t=0: P1 starts (remaining 4)
    // At t=1: P2 arrives (remaining 3 < P1 remaining 3 -> tie breaker P1 stays)
    // At t=2: P3 arrives (remaining 1 < P1 remaining 2 -> P3 preempts!)
    // P3 runs [2, 3), finishes at 3
    // At t=3: P1 has 2 remaining, P2 has 3 remaining -> P1 runs [3, 5), finishes at 5
    // P2 runs [5, 8), finishes at 8
    expect(res.processStats.find(p => p.id === 'P3').completionTime).toBe(3);
    expect(res.processStats.find(p => p.id === 'P1').completionTime).toBe(5);
    expect(res.processStats.find(p => p.id === 'P2').completionTime).toBe(8);
  });

  test('Round Robin respects quantum', () => {
    const res = simulateRoundRobin(sampleProcesses, 2);
    expect(res.summary.totalTime).toBe(8);
    expect(res.processStats.length).toBe(3);
  });

  test('Priority (NP) orders by priority', () => {
    const res = simulatePriorityNonPreemptive(sampleProcesses, 'lower');
    // P1 runs [0, 4)
    // At t=4, P2 (priority 1) and P3 (priority 3) are ready. P2 has lower number = higher priority!
    expect(res.processStats.find(p => p.id === 'P2').completionTime).toBe(7);
    expect(res.processStats.find(p => p.id === 'P3').completionTime).toBe(8);
  });

  test('Priority (P) preempts when higher priority arrives', () => {
    const res = simulatePriorityPreemptive(sampleProcesses, 'lower');
    // At t=1, P2 (priority 1) arrives and preempts P1 (priority 2)
    // P2 runs [1, 4), completes at 4
    expect(res.processStats.find(p => p.id === 'P2').completionTime).toBe(4);
  });

  test('HRRN prioritizes highest response ratio', () => {
    const res = simulateHRRN(sampleProcesses);
    // At t=4: P2 ratio=(3+3)/3=2.0; P3 ratio=(2+1)/1=3.0 -> P3 selected first
    expect(res.processStats.find(p => p.id === 'P1').completionTime).toBe(4);
    expect(res.processStats.find(p => p.id === 'P3').completionTime).toBe(5);
    expect(res.processStats.find(p => p.id === 'P2').completionTime).toBe(8);
  });

  test('LJF selects process with longest burst time', () => {
    const res = simulateLJF(sampleProcesses);
    // At t=4: P2 (BT=3) > P3 (BT=1) -> P2 runs first
    expect(res.processStats.find(p => p.id === 'P1').completionTime).toBe(4);
    expect(res.processStats.find(p => p.id === 'P2').completionTime).toBe(7);
    expect(res.processStats.find(p => p.id === 'P3').completionTime).toBe(8);
  });
});
