import React, { useState, useMemo, useRef } from 'react';
import ProcessInputForm from '../components/ProcessInputForm.js';
import AnimatedGanttChart from '../components/AnimatedGanttChart.js';
import CpuReadyQueueVisualizer from '../components/CpuReadyQueueVisualizer.js';
import MetricsDashboard from '../components/MetricsDashboard.js';
import { runSimulation } from '../algorithms/index.js';
import { PRESETS } from '../utils/constants.js';

export default function SimulatorPage() {
  // Initial processes from standard preset
  const [processes, setProcesses] = useState(PRESETS[0].processes);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [priorityOrder, setPriorityOrder] = useState('lower');

  // Animation playback state lifted up for synchronized visuals
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const ganttSectionRef = useRef(null);

  // Run simulation
  const simulationResult = useMemo(() => {
    return runSimulation(selectedAlgorithm, processes, {
      timeQuantum,
      priorityOrder,
    });
  }, [selectedAlgorithm, processes, timeQuantum, priorityOrder]);

  const handleSimulate = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    // Smooth scroll down to Gantt chart
    if (ganttSectionRef.current) {
      ganttSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 1. Process Input and Algorithm Selection */}
      <ProcessInputForm
        processes={processes}
        setProcesses={setProcesses}
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        priorityOrder={priorityOrder}
        setPriorityOrder={setPriorityOrder}
        onSimulate={handleSimulate}
        isSimulating={isPlaying}
      />

      {/* 2. Animated Gantt Chart */}
      <div ref={ganttSectionRef}>
        <AnimatedGanttChart
          simulationResult={simulationResult}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
        />
      </div>

      {/* 3. CPU Core Socket & Ready Queue Live State */}
      <CpuReadyQueueVisualizer
        simulationResult={simulationResult}
        currentTime={currentTime}
      />

      {/* 4. Performance Metrics Dashboard */}
      <MetricsDashboard
        simulationResult={simulationResult}
      />
    </div>
  );
}
