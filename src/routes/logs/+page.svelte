<script lang="ts">
    import { 
        History, User, Activity, Clock, 
        AlertCircle, FileText, Search, Filter,
        UserCircle2, ExternalLink, ChevronLeft, ChevronRight, RefreshCw
    } from 'lucide-svelte';

    const logs = [
        { id: 1, user: 'moueen_admin', role: 'Super Admin', action: 'Login', target: 'System Console', time: '2 mins ago', status: 'Healthy' },
        { id: 2, user: 'operator_01', role: 'Operator', action: 'Create Report', target: 'Ref: 14212398', time: '15 mins ago', status: 'Healthy' },
        { id: 3, user: 'operator_02', role: 'Operator', action: 'Print Memo', target: 'IESCO/MT/0842', time: '1 hr ago', status: 'Healthy' },
        { id: 4, user: 'moueen_admin', role: 'Super Admin', action: 'Delete Report', target: 'Ref: 1499... ', time: '3 hrs ago', status: 'Low Consumption' },
        { id: 5, user: 'operator_01', role: 'Operator', action: 'Failed Login', target: 'IP: 192.168.1.1', time: '5 hrs ago', status: 'Faulty' },
    ];
</script>

<div class="space-y-8 animate-in">
    <header class="flex items-center justify-between">
        <div class="space-y-1">
            <h2 class="text-2xl font-black text-main tracking-tight">System Audit logs</h2>
            <p class="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <span class="status-dot"></span>
                Immutable Transaction Log
            </p>
        </div>
        <div class="flex items-center gap-3">
            <button class="btn-secondary">
                <History size={16} />
                History
            </button>
            <button class="btn-primary">
                Download Audit
            </button>
        </div>
    </header>

    <!-- Search & Filter Bar -->
    <div class="search-filter-bar">
        <div class="search-input-wrapper">
            <Search size={16} class="search-icon-fixed" />
            <input 
                type="text" 
                placeholder="Search by user, action or target..." 
                class="filter-input"
            />
        </div>
        <div class="filter-actions">
            <select class="select-mini"><option>All Users</option></select>
            <select class="select-mini"><option>All Events</option></select>
            <button class="icon-btn-border"><RefreshCw size={16} /></button>
        </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
        <table class="premium-table">
            <thead>
                <tr>
                    <th>User Details</th>
                    <th>Action</th>
                    <th>Target Resource</th>
                    <th>Timestamp</th>
                    <th>System Health</th>
                    <th class="text-right">Trace</th>
                </tr>
            </thead>
            <tbody>
                {#each logs as l}
                    <tr>
                        <td>
                            <div class="user-cell">
                                <div class="user-avatar-small">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p class="user-name">{l.user}</p>
                                    <p class="user-role">{l.role}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="action-badge">
                                {l.action}
                            </span>
                        </td>
                        <td>
                            <p class="target-mono">{l.target}</p>
                        </td>
                        <td><span class="time-text">{l.time}</span></td>
                        <td>
                            <span class="status-badge {l.status === 'Healthy' ? 'status-success' : l.status.includes('Low') ? 'status-warning' : 'status-error'}">
                                {l.status}
                            </span>
                        </td>
                        <td class="text-right">
                            <button class="action-icon hover:text-primary">
                                <ExternalLink size={16} />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <footer class="table-footer">
            <span>Audit integrity verified by Neon DB</span>
            <div class="pagination">
                <button class="page-btn"><ChevronLeft size={16} /></button>
                <button class="page-btn active">1</button>
                <div class="page-spacer">...</div>
                <button class="page-btn">842</button>
                <button class="page-btn"><ChevronRight size={16} /></button>
            </div>
        </footer>
    </div>
</div>

<style>
    .space-y-8 > * + * { margin-top: 2rem; }
    .space-y-1 > * + * { margin-top: 0.25rem; }
    
    .status-dot { width: 0.4rem; height: 0.4rem; background: #10b981; border-radius: 50%; }
    
    .search-filter-bar { background: white; padding: 1rem; border-radius: 1rem; border: 1px solid var(--border-base); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: var(--shadow-sm); }
    .search-input-wrapper { position: relative; flex: 1; }
    .search-icon-fixed { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-subtle); pointer-events: none; }
    .filter-input { width: 100%; border: none; background: #f3f4f6b0; padding: 0.625rem 1rem 0.625rem 2.5rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 500; }
    .filter-input:focus { background: white; box-shadow: 0 0 0 4px var(--primary-light); }
    
    .filter-actions { display: flex; align-items: center; gap: 0.5rem; }
    .select-mini { width: auto; font-size: 0.7rem; font-weight: 800; padding: 0.375rem 0.75rem; text-transform: uppercase; border-radius: 0.75rem; }
    .icon-btn-border { background: transparent; border: 1px solid var(--border-base); padding: 0.5rem; border-radius: 0.75rem; color: var(--text-subtle); cursor: pointer; display: flex; transition: all 0.2s; }
    .icon-btn-border:hover { background: #f9fafb; color: var(--text-main); }

    .table-card { background: white; border: 1px solid var(--border-base); border-radius: 1rem; box-shadow: var(--shadow-sm); overflow: hidden; }
    .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
    .premium-table th { background: #f9fafb; padding: 1rem 1.5rem; font-size: 0.65rem; font-weight: 900; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border-light); }
    .premium-table td { padding: 1.25rem 1.5rem; font-size: 0.875rem; border-bottom: 1px solid #f9fafb; }
    .premium-table tr:hover { background: #fcfdfe; }
    
    .user-cell { display: flex; align-items: center; gap: 1rem; }
    .user-avatar-small { width: 2.25rem; height: 2.25rem; background: #eff6ff; color: var(--primary); border: 1px solid #dbeafe; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
    .user-name { font-weight: 900; color: var(--text-main); letter-spacing: -0.025em; margin-bottom: 0.125rem; line-height: 1; }
    .user-role { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    
    .action-badge { padding: 0.25rem 0.5rem; background: #f3f4f6; color: #4b5563; border-radius: 0.5rem; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid var(--border-light); }
    .target-mono { font-family: 'Inter', monospace; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .time-text { font-size: 0.75rem; font-weight: 600; color: var(--text-subtle); }
    
    .action-icon { background: none; border: none; padding: 0.25rem; cursor: pointer; color: var(--text-subtle); transition: color 0.2s; display: flex; }
    
    .table-footer { padding: 1.25rem 2rem; border-top: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; font-weight: 700; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.05em; }
    .pagination { display: flex; align-items: center; gap: 0.5rem; }
    .page-btn { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; border: 1px solid var(--border-base); background: white; color: var(--text-subtle); cursor: pointer; transition: all 0.2s; }
    .page-btn:hover { background: #f9fafb; color: var(--text-main); }
    .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2); }
    .page-spacer { color: #d1d5db; padding: 0 0.25rem; }
</style>
