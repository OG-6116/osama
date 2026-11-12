# OSSim — Interactive CPU Scheduling Algorithm Visualizer & Simulator

A high-performance, animated CPU Scheduling Algorithm Simulator designed for Operating Systems (OS) courses and lab coursework. Built with modern React, React Router, and interactive visualizations.

---

## 🚀 Features

### 1. Eight Core Scheduling Algorithms Supported
- **FCFS** (First-Come, First-Served) — Non-preemptive, FIFO arrival ordering.
- **SJF** (Shortest Job First) — Non-preemptive, optimal average waiting time.
- **SRTF** (Shortest Remaining Time First) — Preemptive version of SJF with dynamic preemption.
- **Round Robin (RR)** — Preemptive time-sharing with configurable time slice ($q$).
- **Priority Scheduling (Non-Preemptive)** — Configurable priority rules (lower/higher number = higher priority).
- **Priority Scheduling (Preemptive)** — Instant CPU preemption upon arrival of higher priority processes.
- **HRRN** (Highest Response Ratio Next) — Non-preemptive aging algorithm balancing waiting time and burst time ($R = \frac{W + S}{S}$).
- **LJF** (Longest Job First) — Non-preemptive benchmark demonstrating convoy phenomena.

### 2. Animated Gantt Chart
- **Real-Time Playback**: Play, pause, step forward, step back, and reset controls.
- **Variable Playback Speed**: 0.5x, 1x, 2x, 4x speed multipliers.
- **Scrubber Timeline Slider**: Scrub to any exact millisecond ($t$) to inspect CPU state.
- **Dual Visual Modes**: Single continuous CPU Gantt track, multi-process swimlanes, or both.
- **Hover Inspection Tooltips**: Instant start/end/duration breakdown on any Gantt block.

### 3. CPU Core Socket & Ready Queue Visualizer
- **Live CPU Core Display**: Active pulsing animations during burst execution and idle sleep state with animated coffee indicators when idle.
- **Real-Time Ready Queue**: Animated queue chips showing which processes are queued, remaining times, and priority levels.
- **Completed Processes Tray**: Tracks completed processes and their finish timestamps.
- **Event Log Stream**: Live terminal-style event feed logging scheduling transitions, preemptions, and quantum expirations.

### 4. Metrics Dashboard & Formula Calculations
- **KPI Summary Cards**: Average Waiting Time (WT), Average Turnaround Time (TAT), Average Response Time (RT), CPU Utilization %, and Context Switch Count.
- **Detailed Process Table**: Per-process arrival time, burst time, priority, completion time, turnaround time, waiting time, response time, and current lifecycle state.
- **Step-by-Step Formula Substitution**: Click on any process or toggle formula steps to inspect exact arithmetic substitutions ($TAT = CT - AT$, $WT = TAT - BT$, $RT = First - AT$) and system averages.
- **Export & Print**: Copy process table as CSV, export/import workload configurations as JSON, and print clean lab reports with printer-friendly styling.

### 5. Algorithm Comparison Arena
- **Side-by-Side Execution**: Run all 8 algorithms simultaneously on identical workloads.
- **Synchronized Gantt Charts**: Stacked timelines calibrated to a uniform time scale.
- **Optimal Algorithm Trophy**: Automatically detects and highlights the best-performing algorithm for the selected workload.
- **Comparison Table & Bar Charts**: Graphical visual bars comparing average waiting times.

### 6. Interactive Theory & Lab Guide
- Clear definitions, formulas, and textbook references for CPU Scheduling metrics.
- Analysis of starvation, convoy effect, priority inversion, and aging solutions.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Hooks, Context, Memoization)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: Modern CSS Glassmorphism with custom variables and `@media print` support
- **Testing**: Jest & React Testing Library (100% passing test suite)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
git clone <repo-url>
cd osama
npm install
```

### Running Locally
```bash
npm start
```
Runs the app in development mode at `http://localhost:3000`.

### Running Tests
```bash
npm test -- --watchAll=false
```

### Production Build
```bash
npm run build
```
Generates production-optimized bundle inside the `build/` directory.

---

## 🧪 Preset Scenarios Included

- **Standard Mixed Workload**: Staggered arrivals with balanced bursts.
- **Convoy Effect Showcase**: Heavy job blocking subsequent short jobs in FCFS vs SJF.
- **SRTF Preemption Demo**: Classic textbook example demonstrating multiple preemptions.
- **Round Robin Time-Sharing**: Processes cycling through a fixed time slice ($q = 2$).
- **Priority Inversion / Hierarchy**: Demonstrates preemption based on process priorities.
- **CPU Idle Gaps Demo**: Workload with arrival gaps resulting in CPU idle periods.
- **HRRN Aging Showcase**: Demonstrates how waiting time prevents starvation in long jobs.
- **LJF vs SJF Workload**: Contrasts Longest Job First with Shortest Job First.
