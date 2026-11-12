import React, { useRef } from 'react';
import { ALGORITHMS, PRESETS } from '../utils/constants.js';
import { getProcessColor } from '../utils/colors.js';
import { Plus, Trash2, Shuffle, RotateCcw, Play, Sliders, Download, Upload } from 'lucide-react';

export default function ProcessInputForm({
  processes,
  setProcesses,
  selectedAlgorithm,
  setSelectedAlgorithm,
  timeQuantum,
  setTimeQuantum,
  priorityOrder,
  setPriorityOrder,
  onSimulate,
  isSimulating,
}) {
  // Add new process
  const handleAddProcess = () => {
    // Generate next ID
    const existingIds = new Set(processes.map((p) => p.id));
    let nextNum = 1;
    while (existingIds.has(`P${nextNum}`)) {
      nextNum++;
    }
    const newId = `P${nextNum}`;
    const defaultPriority = nextNum;
    
    setProcesses([
      ...processes,
      {
        id: newId,
        arrivalTime: processes.length > 0 ? Math.max(...processes.map((p) => Number(p.arrivalTime))) : 0,
        burstTime: 4,
        priority: defaultPriority,
      },
    ]);
  };

  // Remove process
  const handleRemoveProcess = (id) => {
    if (processes.length <= 1) {
      alert('You need at least one process to simulate!');
      return;
    }
    setProcesses(processes.filter((p) => p.id !== id));
  };

  // Update process field
  const handleUpdateProcess = (id, field, value) => {
    setProcesses(
      processes.map((p) => {
        if (p.id === id) {
          const numVal = parseInt(value, 10);
          return {
            ...p,
            [field]: isNaN(numVal) ? value : Math.max(0, numVal),
          };
        }
        return p;
      })
    );
  };

  // Load Preset
  const handleLoadPreset = (e) => {
    const presetName = e.target.value;
    if (!presetName) return;
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setProcesses(JSON.parse(JSON.stringify(preset.processes)));
      if (preset.recommendedAlgo) {
        setSelectedAlgorithm(preset.recommendedAlgo);
      }
      if (preset.quantum) {
        setTimeQuantum(preset.quantum);
      }
      if (preset.priorityOrder) {
        setPriorityOrder(preset.priorityOrder);
      }
    }
  };

  // Randomize Workload
  const handleRandomize = () => {
    const count = Math.floor(Math.random() * 3) + 4; // 4 to 6 processes
    const newProcs = [];
    for (let i = 1; i <= count; i++) {
      newProcs.push({
        id: `P${i}`,
        arrivalTime: i === 1 ? 0 : Math.floor(Math.random() * 6),
        burstTime: Math.floor(Math.random() * 8) + 1,
        priority: Math.floor(Math.random() * 5) + 1,
      });
    }
    // Sort arrivals slightly for realism
    newProcs.sort((a, b) => a.arrivalTime - b.arrivalTime);
    setProcesses(newProcs);
  };

  // Clear all except 1
  const handleClear = () => {
    setProcesses([
      { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 1 },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 2 },
    ]);
  };

  const fileInputRef = useRef(null);

  const handleExportJSON = () => {
    const data = JSON.stringify(processes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workload-${selectedAlgorithm}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = parsed.map((p, idx) => ({
            id: p.id ? String(p.id) : `P${idx + 1}`,
            arrivalTime: Math.max(0, parseInt(p.arrivalTime, 10) || 0),
            burstTime: Math.max(1, parseInt(p.burstTime, 10) || 1),
            priority: Math.max(1, parseInt(p.priority, 10) || 1),
          }));
          setProcesses(validated);
        } else {
          alert('Invalid format: Expected a JSON array of process objects.');
        }
      } catch (err) {
        alert('Could not parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const currentAlgoMeta = Object.values(ALGORITHMS).find((a) => a.id === selectedAlgorithm) || ALGORITHMS.FCFS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Algorithm Selection Cards */}
      <div className="glass-card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div>
            <div className="section-title">
              <Sliders size={20} color="#60A5FA" />
              <span>Select Scheduling Algorithm</span>
            </div>
            <div className="section-subtitle">
              Choose from 6 standard CPU scheduling algorithms
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}>
          {Object.values(ALGORITHMS).map((algo) => {
            const isSelected = selectedAlgorithm === algo.id;
            return (
              <button
                key={algo.id}
                type="button"
                onClick={() => setSelectedAlgorithm(algo.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '2px solid #3B82F6' : '1px solid var(--border-color)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(59, 130, 246, 0.3)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#FFFFFF' : 'var(--text-main)' }}>
                    {algo.name}
                  </span>
                  <span
                    className={`badge ${algo.type === 'Preemptive' ? 'badge-preemptive' : 'badge-non-preemptive'}`}
                    style={{ fontSize: '0.65rem', padding: '2px 6px' }}
                  >
                    {algo.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: isSelected ? '#93C5FD' : 'var(--text-muted)', lineHeight: 1.3 }}>
                  {algo.fullName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Algorithm details & parameters */}
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          borderRadius: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 640 }}>
            <span style={{ color: '#60A5FA', fontWeight: 600 }}>{currentAlgoMeta.fullName}: </span>
            {currentAlgoMeta.description}
          </div>

          {/* Conditional Algorithm Parameters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Time Quantum for Round Robin */}
            {currentAlgoMeta.requiresTimeQuantum && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FCD34D' }}>
                  Time Quantum (q):
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  style={{
                    width: 64,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: '#1F2937',
                    border: '1px solid #F59E0B',
                    color: '#FFF',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                />
              </div>
            )}

            {/* Priority Convention for Priority Algorithms */}
            {currentAlgoMeta.requiresPriority && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F472B6' }}>
                  Priority Order:
                </span>
                <select
                  value={priorityOrder}
                  onChange={(e) => setPriorityOrder(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: '#1F2937',
                    border: '1px solid #EC4899',
                    color: '#FFF',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="lower">Lower # = Higher Priority (e.g. 1 &gt; 4)</option>
                  <option value="higher">Higher # = Higher Priority (e.g. 10 &gt; 1)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Process Input Table Card */}
      <div className="glass-card">
        <div className="section-header">
          <div>
            <div className="section-title">
              <span>Processes Configuration</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
              }}>
                {processes.length} Processes
              </span>
            </div>
            <div className="section-subtitle">
              Configure Arrival Time, Burst Time, and Priority for each process
            </div>
          </div>

          {/* Preset selector and actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <select
              defaultValue=""
              onChange={handleLoadPreset}
              className="form-select"
              style={{ width: 'auto', minWidth: 190, fontSize: '0.82rem' }}
            >
              <option value="" disabled>Load Preset Scenario...</option>
              {PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleRandomize}
              className="btn btn-secondary"
              title="Generate random processes"
              style={{ padding: '7px 12px', fontSize: '0.8rem' }}
            >
              <Shuffle size={14} />
              <span>Random</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
              title="Reset processes"
              style={{ padding: '7px 12px', fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="btn btn-secondary"
              title="Export current processes as JSON"
              style={{ padding: '7px 12px', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="btn btn-secondary"
              title="Import processes from JSON file"
              style={{ padding: '7px 12px', fontSize: '0.8rem' }}
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              style={{ display: 'none' }}
            />

            <button
              type="button"
              onClick={handleAddProcess}
              className="btn btn-secondary"
              style={{
                padding: '7px 14px',
                fontSize: '0.82rem',
                background: 'rgba(59, 130, 246, 0.15)',
                borderColor: 'rgba(59, 130, 246, 0.4)',
                color: '#93C5FD',
              }}
            >
              <Plus size={16} />
              <span>Add Process</span>
            </button>
          </div>
        </div>

        {/* Process Input Grid / Table */}
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 540 }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <th style={{ padding: '10px 12px', width: '22%' }}>Process ID</th>
                <th style={{ padding: '10px 12px', width: '24%' }}>Arrival Time (AT)</th>
                <th style={{ padding: '10px 12px', width: '24%' }}>Burst Time (BT)</th>
                {currentAlgoMeta.requiresPriority && (
                  <th style={{ padding: '10px 12px', width: '20%' }}>Priority</th>
                )}
                <th style={{ padding: '10px 12px', width: '10%', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, index) => {
                const color = getProcessColor(p.id);
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Process ID */}
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          backgroundColor: color.bg,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          boxShadow: `0 0 10px ${color.glow}`,
                          flexShrink: 0,
                        }}>
                          {p.id}
                        </div>
                        <input
                          type="text"
                          value={p.id}
                          onChange={(e) => handleUpdateProcess(p.id, 'id', e.target.value)}
                          style={{
                            background: '#1F2937',
                            border: '1px solid var(--border-color)',
                            color: '#FFF',
                            borderRadius: 6,
                            padding: '6px 10px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            width: 80,
                          }}
                        />
                      </div>
                    </td>

                    {/* Arrival Time */}
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number"
                          min="0"
                          value={p.arrivalTime}
                          onChange={(e) => handleUpdateProcess(p.id, 'arrivalTime', e.target.value)}
                          className="form-input"
                          style={{ width: 100, textAlign: 'center', fontWeight: 600 }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ms</span>
                      </div>
                    </td>

                    {/* Burst Time */}
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number"
                          min="1"
                          value={p.burstTime}
                          onChange={(e) => handleUpdateProcess(p.id, 'burstTime', e.target.value)}
                          className="form-input"
                          style={{ width: 100, textAlign: 'center', fontWeight: 600 }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ms</span>
                      </div>
                    </td>

                    {/* Priority */}
                    {currentAlgoMeta.requiresPriority && (
                      <td style={{ padding: '10px 12px' }}>
                        <input
                          type="number"
                          value={p.priority}
                          onChange={(e) => handleUpdateProcess(p.id, 'priority', e.target.value)}
                          className="form-input"
                          style={{ width: 90, textAlign: 'center', fontWeight: 600 }}
                        />
                      </td>
                    )}

                    {/* Delete Action */}
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveProcess(p.id)}
                        disabled={processes.length <= 1}
                        className="btn-danger btn-icon"
                        title="Delete process"
                        style={{ opacity: processes.length <= 1 ? 0.3 : 1 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Submit & Simulate Action */}
        <div style={{
          marginTop: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 12,
          borderTop: '1px solid var(--border-color)',
          paddingTop: 16,
        }}>
          <button
            type="button"
            onClick={onSimulate}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '1rem',
              fontWeight: 700,
              gap: 10,
              borderRadius: 12,
            }}
          >
            <Play size={18} fill="#FFFFFF" />
            <span>Simulate & Animate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
