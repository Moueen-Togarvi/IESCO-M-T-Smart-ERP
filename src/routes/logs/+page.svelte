<script lang="ts">
    import { 
        History, User, Activity, Clock, 
        AlertCircle, FileText, Search, Filter,
        UserCircle2, ExternalLink, ChevronLeft, ChevronRight, RefreshCw,
        ShieldCheck, Database, Zap, Download
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="logs-container animate-in">
    <header class="page-header">
        <div class="header-main">
            <h2 class="view-title">Audit Trail</h2>
            <div class="status-brief">
                <span class="pulse-indicator"></span>
                <span>Immutable Ledger Active</span>
            </div>
        </div>
        <div class="header-actions">
            <div class="stat-pill">
                <Database size={14} />
                <span>{data.logs.length} Recent Events</span>
            </div>
            <button class="btn-primary">
                <Download size={16} />
                Export Forensic Log
            </button>
        </div>
    </header>

    <div class="filter-bar card-premium">
        <div class="search-field">
            <Search size={18} class="search-icon" />
            <input type="text" placeholder="Trace user, action, or target resource..." />
        </div>
        <div class="filter-group">
            <div class="select-wrapper">
                <select>
                    <option>All Security Levels</option>
                    <option>Critical Only</option>
                </select>
            </div>
            <div class="v-separator"></div>
            <button class="refresh-btn">
                <RefreshCw size={16} />
            </button>
        </div>
    </div>

    <div class="table-viewport card-premium">
        <table class="audit-table">
            <thead>
                <tr>
                    <th>Operator</th>
                    <th>Intelligence Action</th>
                    <th>Target Resource</th>
                    <th>Timestamp</th>
                    <th>Security Signature</th>
                    <th class="text-right">Details</th>
                </tr>
            </thead>
            <tbody>
                {#each data.logs as log, i}
                    <tr class="audit-row animate-in" style="animation-delay: {i * 0.03}s">
                        <td>
                            <div class="operator-cell">
                                <div class="operator-avatar">
                                    {log.user.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div class="operator-info">
                                    <p class="username">@{log.user.username}</p>
                                    <p class="role">{log.user.role}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="action-cell">
                                <div class="action-orb" class:create={log.action.includes('CREATE')} class:delete={log.action.includes('DELETE')}>
                                    {#if log.action.includes('CREATE')}
                                        <Zap size={14} />
                                    {:else if log.action.includes('DELETE')}
                                        <AlertCircle size={14} />
                                    {:else}
                                        <Activity size={14} />
                                    {/if}
                                </div>
                                <span class="action-text">{log.action.replace(/_/g, ' ')}</span>
                            </div>
                        </td>
                        <td>
                            <span class="target-tag">{log.target}</span>
                        </td>
                        <td>
                            <div class="time-cell">
                                <p class="date">{new Date(log.timestamp).toLocaleDateString()}</p>
                                <p class="time">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </td>
                        <td>
                            <div class="signature-cell">
                                <ShieldCheck size={14} class="text-success" />
                                <span>Verified</span>
                            </div>
                        </td>
                        <td class="text-right">
                            <button class="btn-icon-sm">
                                <ExternalLink size={16} />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <footer class="table-pagination">
            <p class="integrity-note">
                <ShieldCheck size={14} />
                Log integrity protected by cryptographic hashing
            </p>
            <div class="pagination-controls">
                <button class="nav-btn"><ChevronLeft size={16} /></button>
                <div class="page-list">
                    <button class="page-num active">1</button>
                    <button class="page-num">2</button>
                    <button class="page-num">3</button>
                </div>
                <button class="nav-btn"><ChevronRight size={16} /></button>
            </div>
        </footer>
    </div>
</div>

<style>
    .logs-container {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .view-title {
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--text-primary);
    }

    .status-brief {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-tertiary);
        margin-top: 0.5rem;
    }

    .pulse-indicator {
        width: 8px;
        height: 8px;
        background: var(--brand-primary);
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .stat-pill {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        background: white;
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-secondary);
    }

    .filter-bar {
        padding: 0.75rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .search-field {
        position: relative;
        flex: 1;
        max-width: 500px;
    }

    .search-icon {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-tertiary);
    }

    .search-field input {
        border: none;
        background: transparent;
        padding-left: 2rem;
        width: 100%;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .filter-group {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .select-wrapper select {
        background: transparent;
        border: none;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-secondary);
        cursor: pointer;
    }

    .v-separator { width: 1px; height: 24px; background: var(--border-light); }

    .refresh-btn {
        background: none;
        border: none;
        color: var(--text-tertiary);
        cursor: pointer;
        transition: transform 0.3s;
    }

    .refresh-btn:hover { transform: rotate(180deg); color: var(--brand-primary); }

    .table-viewport {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .audit-table {
        width: 100%;
        border-collapse: collapse;
    }

    .audit-table th {
        text-align: left;
        padding: 1.25rem 1.75rem;
        font-size: 0.65rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-tertiary);
        border-bottom: 1px solid var(--border-light);
    }

    .audit-row {
        border-bottom: 1px solid var(--border-light);
        transition: background 0.2s;
    }

    .audit-row:hover { background: #fbfcfe; }

    .audit-row td { padding: 1.25rem 1.75rem; vertical-align: middle; }

    .operator-cell { display: flex; align-items: center; gap: 1rem; }
    .operator-avatar {
        width: 36px;
        height: 36px;
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 800;
        color: var(--brand-primary);
    }

    .username { font-size: 0.8125rem; font-weight: 800; color: var(--text-primary); }
    .role { font-size: 0.65rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; }

    .action-cell { display: flex; align-items: center; gap: 0.75rem; }
    .action-orb {
        width: 32px;
        height: 32px;
        background: #f1f5f9;
        color: #64748b;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .action-orb.create { background: #f0fdf4; color: #166534; }
    .action-orb.delete { background: #fef2f2; color: #991b1b; }

    .action-text { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: capitalize; }

    .target-tag {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        font-weight: 700;
        background: var(--bg-main);
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        color: var(--text-tertiary);
        border: 1px solid var(--border-subtle);
    }

    .time-cell .date { font-size: 0.8125rem; font-weight: 700; color: var(--text-secondary); }
    .time-cell .time { font-size: 0.65rem; font-weight: 600; color: var(--text-tertiary); }

    .signature-cell {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--success);
    }

    .btn-icon-sm {
        width: 32px;
        height: 32px;
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        color: var(--text-tertiary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-icon-sm:hover { background: white; color: var(--brand-primary); border-color: var(--brand-primary); }

    .table-pagination {
        padding: 1.5rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fcfdfe;
        border-top: 1px solid var(--border-light);
    }

    .integrity-note {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .pagination-controls { display: flex; align-items: center; gap: 1rem; }
    .page-list { display: flex; gap: 0.5rem; }
    .page-num {
        width: 32px;
        height: 32px;
        border: 1px solid var(--border-subtle);
        background: white;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
    }
    .page-num.active { background: var(--brand-primary); color: white; border-color: var(--brand-primary); }

    .nav-btn {
        width: 32px;
        height: 32px;
        background: white;
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
</style>
