<script lang="ts">
    import { 
        Search, FileText, Calendar, User, 
        ChevronRight, ExternalLink, Zap, 
        Clock, ArrowRight, Table, AlertCircle,
        ShieldCheck, Database, History, Download
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="search-container animate-in">
    <header class="search-header">
        <div class="header-main">
            <h2 class="view-title">Intelligence Hive</h2>
            <div class="query-indicator">
                <Database size={14} />
                <span>Recursive Search for: <span class="highlight">"{data.query || 'Global Audit'}"</span></span>
            </div>
        </div>
        <div class="header-actions">
            <div class="verification-pill">
                <ShieldCheck size={14} />
                <span>Blockchain Verified</span>
            </div>
        </div>
    </header>

    {#if data.reports.length === 0}
        <div class="empty-state card-premium shadow-glow">
            <div class="icon-orb">
                <Search size={40} />
            </div>
            <div class="text-content">
                <h3>Vortex Index: Zero Hits</h3>
                <p>The neural engine could not locate records matching your parameters. Refine your query for deeper indexing.</p>
            </div>
            <div class="tips-grid">
                <div class="tip-card">
                    <span class="tip-num">01</span>
                    <p>Use 14-digit Reference</p>
                </div>
                <div class="tip-card">
                    <span class="tip-num">02</span>
                    <p>Audit Meter Serial</p>
                </div>
                <div class="tip-card">
                    <span class="tip-num">03</span>
                    <p>Trace Consumer Identity</p>
                </div>
            </div>
        </div>
    {:else}
        <div class="results-stack">
            {#each data.reports as r, i}
                <div class="result-card card-premium animate-in" style="animation-delay: {i * 0.1}s">
                    <div class="card-inner">
                        <!-- Identity Sector -->
                        <aside class="identity-sector">
                            <div class="sector-header">
                                <div class="id-icon">
                                    <FileText size={24} />
                                </div>
                                <div class="id-text">
                                    <p class="label">Reference ID</p>
                                    <h3 class="value mono-font">{r.referenceNo}</h3>
                                </div>
                            </div>

                            <div class="detail-matrix">
                                <div class="matrix-item">
                                    <span class="m-label">Consumer</span>
                                    <span class="m-value">{r.consumerName}</span>
                                </div>
                                <div class="matrix-item">
                                    <span class="m-label">Meter Serial</span>
                                    <span class="m-value">{r.meterNo}</span>
                                </div>
                                <div class="matrix-item">
                                    <span class="m-label">Diagnostic</span>
                                    <span class="status-pill" class:healthy={r.statusOfMeter === 'Healthy'} class:critical={r.statusOfMeter !== 'Healthy'}>
                                        {r.statusOfMeter}
                                    </span>
                                </div>
                            </div>

                            <div class="sector-footer">
                                <a href="https://lees.iesco.com.pk/iescobill?ref={r.referenceNo}" target="_blank" class="portal-link">
                                    <ExternalLink size={16} />
                                    External Portal Trace
                                </a>
                            </div>
                        </aside>

                        <!-- Timeline Sector -->
                        <main class="timeline-sector">
                            <div class="sector-title">
                                <History size={16} />
                                <h4>Chronological Audit Log</h4>
                            </div>

                            <div class="chronology">
                                <div class="entry current">
                                    <div class="entry-marker">
                                        <div class="marker-dot"></div>
                                        <div class="marker-line"></div>
                                    </div>
                                    <div class="entry-content">
                                        <header>
                                            <span class="entry-label">Latest Synchronization</span>
                                            <span class="entry-time">{new Date(r.createdAt).toLocaleDateString()}</span>
                                        </header>
                                        <div class="remarks-box">
                                            <p>"{r.remarks || 'Standard diagnostic confirmed. No anomalies detected.'}"</p>
                                            <div class="stats-mini">
                                                <div class="stat">
                                                    <span>Load Index</span>
                                                    <strong>{r.readingMeter || 'N/A'}</strong>
                                                </div>
                                                <div class="stat">
                                                    <span>Audit Hash</span>
                                                    <strong>MT-{r.id.slice(-6).toUpperCase()}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="entry legacy">
                                    <div class="entry-marker">
                                        <div class="marker-dot"></div>
                                    </div>
                                    <div class="entry-content">
                                        <header>
                                            <span class="entry-label">Inherited Registry Record</span>
                                            <span class="entry-time">Archive 2025</span>
                                        </header>
                                        <p class="legacy-note">Legacy data migrated from local subdivision storage.</p>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div class="card-accent" class:healthy={r.statusOfMeter === 'Healthy'} class:critical={r.statusOfMeter !== 'Healthy'}></div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .search-container {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .search-header {
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

    .query-indicator {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--text-tertiary);
        margin-top: 0.5rem;
    }

    .query-indicator .highlight { color: var(--brand-primary); font-weight: 800; }

    .verification-pill {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #f0fdf4;
        border: 1px solid #dcfce7;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.65rem;
        font-weight: 900;
        text-transform: uppercase;
        color: #166534;
        letter-spacing: 0.05em;
    }

    /* Empty State Styles */
    .empty-state {
        padding: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: white;
    }

    .icon-orb {
        width: 80px;
        height: 80px;
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
        margin-bottom: 2rem;
    }

    .text-content h3 { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.75rem; }
    .text-content p { font-size: 1rem; font-weight: 600; color: var(--text-tertiary); max-width: 500px; line-height: 1.6; }

    .tips-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-top: 4rem;
        width: 100%;
        max-width: 700px;
    }

    .tip-card {
        padding: 1.5rem;
        background: #f8fafc;
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    .tip-num { font-size: 0.75rem; font-weight: 900; color: var(--brand-primary); opacity: 0.5; }
    .tip-card p { font-size: 0.8125rem; font-weight: 800; color: var(--text-secondary); }

    /* Results Stack Styles */
    .results-stack {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .result-card {
        position: relative;
        overflow: hidden;
        background: white;
    }

    .card-inner {
        display: flex;
        min-height: 380px;
    }

    .identity-sector {
        width: 35%;
        padding: 2.5rem;
        background: #fbfcfe;
        border-right: 1px solid var(--border-light);
    }

    .sector-header { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2.5rem; }
    .id-icon {
        width: 54px;
        height: 54px;
        background: white;
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--brand-primary);
        box-shadow: var(--shadow-sm);
    }

    .label { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: var(--text-tertiary); letter-spacing: 0.1em; }
    .value { font-size: 1.25rem; font-weight: 900; color: var(--text-primary); margin-top: 0.25rem; }

    .detail-matrix { display: flex; flex-direction: column; gap: 1.5rem; }
    .matrix-item { display: flex; justify-content: space-between; align-items: center; }
    .m-label { font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); }
    .m-value { font-size: 0.875rem; font-weight: 800; color: var(--text-secondary); }

    .status-pill {
        padding: 0.35rem 0.875rem;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 900;
        text-transform: uppercase;
    }
    .status-pill.healthy { background: #dcfce7; color: #166534; }
    .status-pill.critical { background: #fee2e2; color: #991b1b; }

    .sector-footer { margin-top: 3rem; pt: 2rem; border-top: 1px solid var(--border-light); }
    .portal-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.8125rem;
        font-weight: 800;
        color: var(--brand-primary);
        text-decoration: none;
    }

    .timeline-sector {
        flex: 1;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
    }

    .sector-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.75rem;
        font-weight: 900;
        text-transform: uppercase;
        color: var(--text-primary);
        margin-bottom: 2.5rem;
    }

    .chronology {
        display: flex;
        flex-direction: column;
        gap: 0;
        position: relative;
    }

    .entry { display: flex; gap: 2rem; position: relative; }
    .entry.current { padding-bottom: 3rem; }

    .entry-marker { display: flex; flex-direction: column; align-items: center; }
    .marker-dot {
        width: 12px;
        height: 12px;
        background: #e2e8f0;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 4px #f1f5f9;
        z-index: 1;
    }
    .current .marker-dot { background: var(--brand-primary); box-shadow: 0 0 0 6px var(--brand-primary-light); }
    .marker-line { flex: 1; width: 2px; background: #f1f5f9; margin: 4px 0; }

    .entry-content { flex: 1; }
    .entry-content header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .entry-label { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: var(--text-primary); }
    .entry-time { font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); }

    .remarks-box {
        background: #f8fafc;
        border: 1px solid var(--border-subtle);
        padding: 1.5rem;
        border-radius: 16px;
    }

    .remarks-box p { font-size: 0.9375rem; font-weight: 600; color: var(--text-secondary); line-height: 1.6; font-style: italic; }

    .stats-mini { display: flex; gap: 3rem; margin-top: 1.5rem; pt: 1rem; border-top: 1px solid #e2e8f0; }
    .stat { display: flex; flex-direction: column; gap: 0.25rem; }
    .stat span { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: var(--text-tertiary); }
    .stat strong { font-size: 0.8125rem; font-weight: 800; color: var(--text-primary); }

    .legacy-note { font-size: 0.875rem; font-weight: 600; color: var(--text-tertiary); }

    .card-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
    .card-accent.healthy { background: var(--success); }
    .card-accent.critical { background: var(--error); }
</style>
