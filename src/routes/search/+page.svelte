<script lang="ts">
    import { 
        Search, FileText, Calendar, User, 
        ChevronRight, ExternalLink, Zap, 
        Clock, ArrowRight, Table, AlertCircle
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="w-full space-y-8 animate-in">
    <header class="flex items-center justify-between">
        <div class="space-y-1">
            <h2 class="text-2xl font-black text-main tracking-tight">Global Search Hive</h2>
            <p class="text-xs font-bold text-muted uppercase tracking-widest">
                Searching Database for: <span class="text-primary">"{data.query || 'Type to search...'}"</span>
            </p>
        </div>
        <div class="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            <Zap size={14} />
            Verified Records
        </div>
    </header>

    {#if data.reports.length === 0}
        <div class="card-premium p-20 flex flex-col items-center justify-center text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Search size={32} />
            </div>
            <h3 class="text-lg font-black text-main">No records found</h3>
            <p class="text-sm font-medium text-muted mt-2 max-w-sm">
                Try searching by a 14-digit Reference Number, Meter Serial, or Consumer Name.
            </p>
        </div>
    {:else}
        <div class="space-y-6">
            {#each data.reports as r}
                <section class="card-premium overflow-hidden">
                    <div class="flex h-full">
                        <!-- Left Info Card -->
                        <div class="w-1/3 p-8 border-r border-gray-100 bg-gray-50/30">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                                    <FileText size={24} class="text-primary" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-black text-muted uppercase tracking-widest">Reference No.</p>
                                    <h3 class="text-lg font-black text-main leading-none mt-1">{r.referenceNo}</h3>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="detail-row">
                                    <span class="detail-label">Consumer</span>
                                    <span class="detail-value text-primary">{r.consumerName}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Meter S/N</span>
                                    <span class="detail-value">{r.meterNo}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Status</span>
                                    <span class="status-badge {r.statusOfMeter === 'Healthy' ? 'status-success' : 'status-error'}">
                                        {r.statusOfMeter}
                                    </span>
                                </div>
                            </div>

                            <div class="mt-8 pt-6 border-t border-gray-100">
                                <a href="https://lees.iesco.com.pk/iescobill?ref={r.referenceNo}" target="_blank" class="btn-secondary w-full">
                                    <ExternalLink size={16} />
                                    View Digital Bill
                                </a>
                            </div>
                        </div>

                        <!-- Right History Timeline -->
                        <div class="flex-1 p-8">
                            <h4 class="text-[10px] font-black text-main uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Clock size={14} class="text-primary" />
                                Complete Transaction History
                            </h4>

                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="timeline-dot active"></div>
                                    <div class="timeline-content">
                                        <div class="flex items-center justify-between mb-2">
                                            <p class="text-xs font-black text-main uppercase">Current Inspection Report</p>
                                            <span class="text-[10px] font-bold text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p class="text-xs font-medium text-gray-600 leading-relaxed italic">
                                                "{r.remarks || 'No special remarks provided for this inspection.'}"
                                            </p>
                                            <div class="flex gap-4 mt-4">
                                                <div class="stat-mini">
                                                    <span>Consumption</span>
                                                    <strong>{r.readingMeter ? r.readingMeter : '3-Phase'}</strong>
                                                </div>
                                                <div class="stat-mini">
                                                    <span>Audit Trace</span>
                                                    <strong>IESCO-MT-{r.id.slice(-4)}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pseudo History items for Demo -->
                                <div class="timeline-item">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <div class="flex items-center justify-between mb-2">
                                            <p class="text-xs font-black text-muted uppercase">Archived Inspection</p>
                                            <span class="text-[10px] font-bold text-muted">2025-08-12</span>
                                        </div>
                                        <p class="text-[11px] font-bold text-muted uppercase tracking-widest">Manual Record Inherited</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            {/each}
        </div>
    {/if}
</div>

<style>
    .detail-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-label { font-size: 0.65rem; font-weight: 800; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.05em; }
    .detail-value { font-size: 0.875rem; font-weight: 900; color: var(--text-main); }
    
    .timeline { display: flex; flex-direction: column; gap: 2rem; padding-left: 1rem; position: relative; }
    .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #f3f4f6; }
    .timeline-item { position: relative; padding-left: 2rem; }
    .timeline-dot { position: absolute; left: -5px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: #e2e8f0; border: 3px solid white; box-shadow: 0 0 0 4px #f8fafc; }
    .timeline-dot.active { background: var(--primary); box-shadow: 0 0 0 6px var(--primary-light); }
    
    .stat-mini { display: flex; flex-direction: column; }
    .stat-mini span { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
    .stat-mini strong { font-size: 0.75rem; font-weight: 900; color: var(--text-main); }
    
    .bg-blue-50 { background-color: #f0f7ff; }
    .border-blue-100 { border-color: #dbeafe; }
</style>
