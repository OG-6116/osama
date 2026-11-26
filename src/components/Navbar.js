import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1380,
        margin: '0 auto',
        padding: '0 20px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)',
          }}>
            <Cpu size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                OSAMA
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#93C5FD',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Interactive
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              CPU Process Scheduling Simulator
            </div>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive ? '#FFFFFF' : 'var(--text-muted)',
              backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Layers size={16} />
            <span>Simulator</span>
          </NavLink>

          <NavLink
            to="/guide"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive ? '#FFFFFF' : 'var(--text-muted)',
              backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <BookOpen size={16} />
            <span>Theory & Guide</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
