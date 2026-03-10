<script lang="ts">
    import { 
        Zap, Activity, Clock, TrendingUp, AlertCircle, 
        Package, CheckCircle2, Inbox, 
        Lock, Siren, ShieldAlert, Flame, 
        Construction, Ghost, MapPin, History, MousePointer2,
        ArrowUpRight, Download, Calendar
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    const cards = [
        { title: 'Meters Received', value: data.stats.metersReceived, icon: Inbox, theme: 'blue' },
        { title: 'Meters Checked', value: data.stats.metersChecked, icon: CheckCircle2, theme: 'emerald' },
        { title: 'Meters Balance', value: data.stats.metersBalance, icon: Package, theme: 'slate' },
        { title: 'Theft Cases', value: data.stats.theftCases, icon: Siren, theme: 'error' },
        { title: 'Slow Cases', value: data.stats.slowCases, icon: Clock, theme: 'orange' },
        { title: 'EPROM Damaged', value: data.stats.epromDamaged, icon: Lock, theme: 'purple' },
        { title: 'Meter Burnt', value: data.stats.burntCases, icon: Flame, theme: 'orange' },
        { title: 'Damaged Meters', value: data.stats.waterInsertion + data.stats.displayWashed, icon: Construction, theme: 'error' },
    ];
</script>

<div class="dashboard-viewport animate-in">
    <header class="page-header">
        <div class="header-content">
            <h2 class="page-title">Executive Overview</h2>
            <p class="page-description">
                <span class="status-indicator"></span>
                Monitoring 1.2k+ active deployments in real-time
            </p>
        </div>
        <div class="header-actions">
            <div class="date-chip">
                <Calendar size={14} />
                <span>March 2026</span>
            </div>
            <button class="btn-primary">
                <Download size={16} />
                Export Intelligence
            </button>
        </div>
    </header>

    <!-- Stats Grid -->
    <div class="stats-grid">
        {#each cards as card}
            <div class="card-premium stats-card {card.theme}-theme">
                <div class="card-head">
                    <div class="icon-orb">
                        <svelte:component this={card.icon} size={20} />
                    </div>
                    <div class="trend-badge positive">
                        <TrendingUp size={12} />
                        <span>12%</span>
                    </div>
                </div>
                <div class="card-main">
                    <p class="label">{card.title}</p>
                    <h3 class="value">{card.value}</h3>
                </div>
                <div class="card-graph-mini">
                    <!-- Simple CSS-based mini sparkline effect -->
                    <div class="sparkline">
                        {#each Array(8) as _, i}
                            <div class="bar" style="height: {30 + Math.random() * 70}%; opacity: {0.3 + (i / 10)}"></div>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Analytics Section -->
    <div class="analytics-layout">
        <!-- Main Chart Card -->
        <div class="card-premium chart-card">
            <header class="card-header">
                <div class="header-info">
                    <h4 class="card-title">Recovery Dynamics</h4>
                    <p class="card-subtitle">Monthly Meter Unit Recovery (kWh)</p>
                </div>
                <div class="header-controls">
                    <select class="premium-select">
                        <option>Last 30 Days</option>
                        <option>Current Quarter</option>
                    </select>
                </div>
            </header>
            
            <div class="chart-container">
                <div class="visual-chart">
                    {#each [34, 45, 23, 56, 78, 45, 67, 89, 45, 34, 56, 78] as height}
                        <div class="chart-bar-wrapper">
                            <div class="chart-bar" style="height: {height}%">
                                <div class="bar-glow"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <footer class="card-footer">
                <div class="stat-group">
                    <span class="footer-label">Aggregate Recovery</span>
                    <span class="footer-value">12,402 kWh</span>
                </div>
                <div class="v-separator"></div>
                <div class="stat-group">
                    <span class="footer-label">Status</span>
                    <span class="status-chip success">
                        <CheckCircle2 size={12} />
                        Verified
                    </span>
                </div>
            </footer>
        </div>

        <!-- Live Activity Card -->
        <div class="card-premium activity-card">
            <header class="card-header">
                <div class="header-info">
                    <h4 class="card-title">Operational Stream</h4>
                    <p class="card-subtitle tracking-widest uppercase text-[9px] font-black flex items-center gap-1.5">
                        <span class="live-blink"></span>
                        Live Audit Feed
                    </p>
                </div>
                <button class="btn-icon-sm">
                    <History size={16} />
                </button>
            </header>

            <div class="activity-feed custom-scrollbar">
                {#each data.recentLogs as log}
                    <div class="feed-item">
                        <div class="feed-icon {log.action.includes('CREATE') ? 'blue-orb' : 'orange-orb'}">
                            {#if log.action.includes('CREATE')}
                                <Package size={14} />
                            {:else}
                                <Zap size={14} />
                            {/if}
                        </div>
                        <div class="feed-content">
                            <p class="feed-text">
                                <span class="actor">@{log.user?.username || 'user'}</span>
                                <span class="action">{log.action.toLowerCase().replace(/_/g, ' ')}</span>
                            </p>
                            <p class="feed-target">{log.target}</p>
                        </div>
                        <span class="feed-time">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                {/each}
            </div>

            <button class="view-all-link">
                View Full Logs
                <ArrowUpRight size={14} />
            </button>
        </div>
    </div>
</div>

<style>
    .dashboard-viewport {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .page-title {
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--text-primary);
        line-height: 1.1;
    }

    .page-description {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-tertiary);
        margin-top: 0.5rem;
    }

    .status-indicator {
        width: 8px;
        height: 8px;
        background: var(--success);
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .date-chip {
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

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
    }

    .stats-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .card-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .icon-orb {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s;
    }

    .stats-card:hover .icon-orb {
        transform: scale(1.1) rotate(-5deg);
    }

    .trend-badge {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.625rem;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 800;
    }

    .trend-badge.positive {
        background: #dcfce7;
        color: #166534;
    }

    .card-main .label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-tertiary);
        margin-bottom: 0.25rem;
    }

    .card-main .value {
        font-size: 1.75rem;
        font-weight: 900;
        letter-spacing: -0.04em;
        color: var(--text-primary);
    }

    .sparkline {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 30px;
    }

    .sparkline .bar {
        flex: 1;
        background: currentColor;
        border-radius: 2px 2px 0 0;
    }

    /* Theme Variants */
    .blue-theme .icon-orb { background: #eff6ff; color: #3b82f6; }
    .blue-theme .sparkline { color: #3b82f6; }
    
    .emerald-theme .icon-orb { background: #ecfdf5; color: #10b981; }
    .emerald-theme .sparkline { color: #10b981; }

    .slate-theme .icon-orb { background: #f8fafc; color: #64748b; }
    .slate-theme .sparkline { color: #64748b; }

    .error-theme .icon-orb { background: #fef2f2; color: #ef4444; }
    .error-theme .sparkline { color: #ef4444; }

    .orange-theme .icon-orb { background: #fffbeb; color: #f59e0b; }
    .orange-theme .sparkline { color: #f59e0b; }

    .purple-theme .icon-orb { background: #f5f3ff; color: #8b5cf6; }
    .purple-theme .sparkline { color: #8b5cf6; }

    /* Analytics Layout */
    .analytics-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
    }

    .chart-card, .activity-card {
        padding: 2rem;
        display: flex;
        flex-direction: column;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
    }

    .card-title {
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: -0.025em;
        color: var(--text-primary);
    }

    .card-subtitle {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-tertiary);
        margin-top: 0.125rem;
    }

    .chart-container {
        flex: 1;
        min-height: 240px;
        display: flex;
        align-items: flex-end;
    }

    .visual-chart {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-end;
        gap: 0.75rem;
        padding-bottom: 1rem;
    }

    .chart-bar-wrapper {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: flex-end;
        position: relative;
    }

    .chart-bar {
        width: 100%;
        background: var(--brand-primary-light);
        border-radius: 8px 8px 0 0;
        position: relative;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .chart-bar:hover {
        background: var(--brand-primary);
        transform: scaleX(1.1);
    }

    .bar-glow {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 20%;
        background: var(--brand-primary);
        filter: blur(15px);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .chart-bar:hover .bar-glow {
        opacity: 0.4;
    }

    .card-footer {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-light);
        margin-top: 1.5rem;
    }

    .footer-label {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-tertiary);
        display: block;
        margin-bottom: 0.125rem;
    }

    .footer-value {
        font-size: 0.875rem;
        font-weight: 800;
        color: var(--text-primary);
    }

    .v-separator {
        width: 1px;
        height: 24px;
        background: var(--border-light);
    }

    .status-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 700;
    }

    .status-chip.success {
        color: var(--success);
        background: #f0fdf4;
    }

    /* Activity Card */
    .activity-feed {
        flex: 1;
        overflow-y: auto;
        padding-right: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .feed-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        position: relative;
    }

    .feed-icon {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .blue-orb { background: #eff6ff; color: #3b82f6; }
    .orange-orb { background: #fffbeb; color: #f59e0b; }

    .feed-content {
        flex: 1;
        min-width: 0;
    }

    .feed-text {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    .actor { color: var(--text-primary); font-weight: 700; }
    .action { color: var(--brand-primary); }

    .feed-target {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-tertiary);
        margin-top: 0.125rem;
    }

    .feed-time {
        font-size: 0.7rem;
        font-weight: 700;
        color: #94a3b8;
    }

    .view-all-link {
        margin-top: 1.5rem;
        background: none;
        border: none;
        color: var(--brand-primary);
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 0.375rem;
        cursor: pointer;
        padding: 0;
    }

    .view-all-link:hover {
        text-decoration: underline;
    }

    .live-blink {
        width: 6px;
        height: 6px;
        background: var(--success);
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.4; }
        100% { transform: scale(1); opacity: 1; }
    }

    .premium-select {
        border: 1px solid var(--border-subtle);
        background: var(--bg-main);
        padding: 0.5rem 2rem 0.5rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
    }

    .btn-icon-sm {
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        padding: 0.5rem;
        border-radius: 8px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-icon-sm:hover {
        background: white;
        color: var(--brand-primary);
        border-color: var(--brand-primary);
    }

    /* Responsive Queries */
    @media (max-width: 1200px) {
        .stats-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 1024px) {
        .analytics-layout {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .stats-grid {
            /* 2 cards per row as requested */
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }
        
        .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .header-actions {
            width: 100%;
            justify-content: space-between;
        }
        
        .stats-card {
            padding: 1rem;
            gap: 0.75rem;
        }
        
        .card-main .value {
            font-size: 1.25rem;
        }

        .chart-card, .activity-card {
            padding: 1rem;
        }

        .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .v-separator { display: none; }
    }

    @media (max-width: 480px) {
        .stats-grid {
            /* Still enforcing 2 cards per row but tighter */
            gap: 0.75rem;
        }
        
        .card-main .label { font-size: 0.65rem; }
        .trend-badge { display: none; }
    }
</style>
