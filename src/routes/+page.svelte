<script lang="ts">
    import { 
        Zap, Activity, Clock, TrendingUp, AlertCircle, 
        Package, CheckCircle2, Inbox, 
        Lock, Siren, ShieldAlert, Flame, 
        Construction, Ghost, MapPin, History, MousePointer2
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    const cards = [
        { title: 'Meters Received', value: data.stats.metersReceived, icon: Inbox, color: 'blue' },
        { title: 'Meters Checked', value: data.stats.metersChecked, icon: CheckCircle2, color: 'emerald' },
        { title: 'Meters Balance', value: data.stats.metersBalance, icon: Package, color: 'slate' },
        { title: 'Theft Cases', value: data.stats.theftCases, icon: Siren, color: 'error' },
        { title: 'Slow Cases', value: data.stats.slowCases, icon: Clock, color: 'orange' },
        { title: 'EPROM Damaged', value: data.stats.epromDamaged, icon: Lock, color: 'purple' },
        { title: 'Meter Burnt', value: data.stats.burntCases, icon: Flame, color: 'orange' },
        { title: 'Damaged Meters', value: data.stats.waterInsertion + data.stats.displayWashed, icon: Construction, color: 'error' },
        { title: 'EOL Cases', value: 24, icon: Ghost, color: 'slate' }, // Placeholder
        { title: 'Mismatch Meters', value: 8, icon: ShieldAlert, color: 'purple' }, // Placeholder
        { title: 'Missing Meters', value: 3, icon: MapPin, color: 'error' }, // Placeholder
    ];
</script>

<div class="space-y-8 animate-in">
    <header class="flex items-center justify-between">
        <div class="space-y-1">
            <h2 class="text-2xl font-black text-main tracking-tight">System Overview</h2>
            <div class="flex items-center gap-2">
                <span class="status-dot"></span>
                <p class="text-[10px] font-black text-muted uppercase tracking-widest">Real-time Neon DB Analytics</p>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
                {#each Array(4) as _}
                    <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">U</div>
                {/each}
            </div>
            <button class="btn-primary">
                Export Dashboard
            </button>
        </div>
    </header>

    <!-- Analytics Grid (Dynamic Cards) -->
    <div class="dashboard-grid">
        {#each cards as card}
            <a href="/reports?filter={card.title}" class="card-premium dashboard-card {card.color}-theme">
                <div class="card-top">
                    <div class="card-icon-box">
                        <svelte:component this={card.icon} size={20} />
                    </div>
                    <div class="drill-down">
                        <MousePointer2 size={12} />
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-label">{card.title}</p>
                    <h3 class="card-value">{card.value}</h3>
                </div>
                <div class="card-footer">
                    <TrendingUp size={12} class="text-success" />
                    <span class="trend-text">+12% vs last month</span>
                </div>
            </a>
        {/each}
    </div>

    <div class="grid grid-cols-5 gap-8">
        <!-- Main Activity Chart Placeholder -->
        <div class="col-span-3 card-premium p-8 h-[400px] flex flex-col">
            <header class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-xs font-black text-main uppercase tracking-widest">Recovery Trends</h3>
                    <p class="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Monthly Unit Recovery (kWh)</p>
                </div>
                <select class="select-mini"><option>Last 30 Days</option></select>
            </header>
            <div class="flex-1 flex items-end gap-3 px-4">
                {#each [34, 45, 23, 56, 78, 45, 67, 89, 45, 34, 56, 78] as height}
                    <div class="flex-1 bg-primary-light rounded-t-lg transition-all hover:bg-primary" style="height: {height}%"></div>
                {/each}
            </div>
            <footer class="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                <p class="text-[11px] font-bold text-muted uppercase tracking-widest">Total Recovery: 12,402 kWh</p>
                <div class="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                    Verification Complete
                    <CheckCircle2 size={14} />
                </div>
            </footer>
        </div>

        <!-- Right Side: Live Logs -->
        <div class="col-span-2 card-premium p-8 h-[400px] overflow-hidden flex flex-col">
            <header class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-2">
                    <History size={16} class="text-primary" />
                    <h3 class="text-xs font-black text-main uppercase tracking-widest">Live Activity</h3>
                </div>
                <span class="status-badge status-success">Live</span>
            </header>
            
            <div class="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                {#each data.recentLogs as log}
                    <div class="activity-item">
                        <div class="activity-icon-box {log.action.includes('CREATE') ? 'bg-blue-light text-primary' : 'bg-orange-light text-orange'}">
                            {#if log.action.includes('CREATE')}
                                <Package size={16} />
                            {:else}
                                <MousePointer2 size={16} />
                            {/if}
                        </div>
                        <div class="flex-1">
                            <p class="activity-text">
                                <span class="actor">@{log.user?.username || 'user'}</span>
                                {log.action.toLowerCase().replace('_', ' ')}
                            </p>
                            <p class="activity-target">{log.target}</p>
                        </div>
                        <span class="activity-time">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .dashboard-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
        gap: 1.5rem; 
    }
    
    .dashboard-card { flex: 1; min-width: 180px; border: 1px solid var(--border-base); border-radius: 1.25rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
    .dashboard-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.15); border-color: var(--primary); }
    
    .card-top { display: flex; justify-content: space-between; align-items: center; }
    .card-icon-box { width: 2.75rem; height: 2.75rem; border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: var(--text-subtle); transition: all 0.2s; }
    .drill-down { width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f1f5f9; color: var(--text-muted); opacity: 0; transform: translateX(10px); transition: all 0.3s; }
    .dashboard-card:hover .drill-down { opacity: 1; transform: translateX(0); }
    .dashboard-card:hover .card-icon-box { background: white; transform: scale(1.1); }

    .card-label { font-size: 0.7rem; font-weight: 800; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
    .card-value { font-size: 1.75rem; font-weight: 950; color: var(--text-main); letter-spacing: -0.04em; }
    .card-footer { display: flex; align-items: center; gap: 0.4rem; padding-top: 0.5rem; border-top: 1px solid #f8fafc; margin-top: 0.5rem; }
    .trend-text { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); }

    /* Theme Variants */
    .blue-theme .card-icon-box { color: #2563eb; background: #eff6ff; }
    .emerald-theme .card-icon-box { color: #059669; background: #ecfdf5; }
    .orange-theme .card-icon-box { color: #d97706; background: #fffbeb; }
    .error-theme .card-icon-box { color: #dc2626; background: #fef2f2; }
    .purple-theme .card-icon-box { color: #7c3aed; background: #f5f3ff; }

    .activity-item { display: flex; align-items: center; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid #f9fafb; transition: transform 0.2s; }
    .activity-item:last-child { border-bottom: none; }
    .activity-icon-box { width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
    .actor { font-weight: 900; color: var(--text-main); }
    .activity-text { font-size: 0.8rem; font-weight: 600; color: var(--text-subtle); }
    .activity-target { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-top: 0.125rem; }
    .activity-time { font-size: 0.65rem; font-weight: 900; color: #cbd5e1; }

    .status-dot { width: 0.4rem; height: 0.4rem; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
</style>
