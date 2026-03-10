<script lang="ts">
    import { enhance } from '$app/forms';
    import { 
        Search, ExternalLink, AlertCircle, History, 
        Eye, Pencil, Trash2, Filter, Plus, FileText, 
        Zap, TrendingUp, ChevronLeft, ChevronRight, Download, RefreshCw, AlertTriangle, 
        Image as ImageIcon, Upload, FileSearch
    } from 'lucide-svelte';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    // State Management
    let reportType = 'SINGLE_PHASE'; // SINGLE_PHASE | THREE_PHASE | SPECIAL_CASE
    let referenceNumber = '';
    let consumerName = '';
    let meterNo = '';
    let meterMake = '';
    let subdivision = 'Jhelum';
    let statusOfMeter = 'Healthy';
    let remarks = '';

    // Single/3-Phase specific readings
    let readingBill = 0; let readingMeter = 0;
    let peakBill = 0; let offPeakBill = 0; let peakMeter = 0; let offPeakMeter = 0;

    $: diffSingle = Math.abs(readingMeter - readingBill);
    $: peakDiff = Math.abs(peakMeter - peakBill);
    $: offPeakDiff = Math.abs(offPeakMeter - offPeakBill);
    $: totalRecovered = peakDiff + offPeakDiff;

    // Alert Logic
    let showAlert = false;
    let historyRecords = [];
    const checkReference = async () => {
        if (referenceNumber.length === 14) {
            const res = await fetch(`/api/check-ref?ref=${referenceNumber}`);
            const result = await res.json();
            if (result.exists) { showAlert = true; historyRecords = result.history; }
            else showAlert = false;
        } else showAlert = false;
    };

    // AI OCR Logic
    let isAnalyzingImage = false;
    let analysisSuccess = false;
    const simulateOCR = () => {
        isAnalyzingImage = true;
        setTimeout(() => {
            referenceNumber = "14212398542100";
            consumerName = "M/S Malik Flour Mills";
            meterNo = "IES-99842";
            meterMake = "Landis+Gyr";
            remarks = "Complaint for EPROM damage received via SE Office Jhelum.";
            isAnalyzingImage = false;
            analysisSuccess = true;
            checkReference();
        }, 1500);
    };

    // AI Remarks Logic
    let aiActive = false;
    let aiSuggestions = [];
    const analyzeBill = () => {
        aiActive = true;
        setTimeout(() => {
            aiSuggestions = [
                "Sudden 40% drop in consumption detected in Nov 2025.",
                "Possible EPROM damage. Suggest verification of MDI.",
                "Suggest 'Slow' status due to invariant MDI readings."
            ];
            aiActive = false;
        }, 800);
    };

    const statusOptions = ['Healthy', 'Slow', 'Burnt', 'Theft', 'EPROM Damaged', 'Totally Damaged', 'Display Washed', 'Water Insertion'];

    $: if (form?.success) {
        alert('Report Saved Successfully!');
        referenceNumber = ''; consumerName = ''; meterNo = ''; meterMake = '';
        analysisSuccess = false;
    }
</script>

<div class="flex gap-8 h-full animate-in">
    <!-- Left Panel: Performa Entry -->
    <div class="performa-panel {reportType === 'THREE_PHASE' || reportType === 'SPECIAL_CASE' ? 'w-96' : 'w-80'}">
        <form method="POST" action="?/createReport" use:enhance class="card-premium p-6">
            <input type="hidden" name="type" value={reportType} />
            <input type="hidden" name="subdivision" value={subdivision} />

            <header class="panel-header">
                <div class="flex flex-col gap-1">
                    <h3 class="text-xs font-black text-main uppercase tracking-widest">Performa Entry</h3>
                    <div class="type-toggle">
                        <button type="button" class="toggle-btn {reportType === 'SINGLE_PHASE' ? 'active' : ''}" on:click={() => reportType = 'SINGLE_PHASE'}>Single</button>
                        <button type="button" class="toggle-btn {reportType === 'THREE_PHASE' ? 'active' : ''}" on:click={() => reportType = 'THREE_PHASE'}>3 Phase</button>
                        <button type="button" class="toggle-btn {reportType === 'SPECIAL_CASE' ? 'active' : ''}" on:click={() => reportType = 'SPECIAL_CASE'}>Special</button>
                    </div>
                </div>
            </header>

            <div class="form-container">
                <!-- AI OCR Zone for Special Cases -->
                {#if reportType === 'SPECIAL_CASE'}
                    <div class="ocr-zone {analysisSuccess ? 'analysis-done' : ''}">
                        {#if isAnalyzingImage}
                            <div class="flex flex-col items-center gap-2 py-4">
                                <RefreshCw size={24} class="animate-spin text-primary" />
                                <span class="text-[10px] font-black uppercase tracking-widest text-primary">Analyzing Document...</span>
                            </div>
                        {:else}
                            <label class="ocr-upload-label">
                                <Upload size={20} />
                                <div class="text-center">
                                    <p class="text-[10px] font-black uppercase tracking-widest">Upload Official Letter</p>
                                    <p class="text-[9px] font-bold text-muted mt-1">AI will extract case details</p>
                                </div>
                                <input type="file" class="hidden" on:change={simulateOCR} />
                            </label>
                        {/if}
                        {#if analysisSuccess}
                            <div class="ocr-badge">
                                <Zap size={10} /> AI Extracted
                            </div>
                        {/if}
                    </div>
                {/if}

                <div class="form-group">
                    <label class="label-tiny">Reference Number (14 Digits)</label>
                    <div class="input-relative">
                        <input 
                            name="referenceNo" type="text" maxlength="14" placeholder="e.g. 14212398542100"
                            bind:value={referenceNumber} on:input={checkReference} required
                            class="font-mono font-bold {showAlert ? 'border-orange-glow' : ''}"
                        />
                        {#if referenceNumber.length === 14}
                            <a href="https://lees.iesco.com.pk/iescobill" target="_blank" class="portal-btn"><ExternalLink size={14} /></a>
                        {/if}
                    </div>
                </div>

                {#if showAlert}
                    <div class="alert-box-full">
                        <div class="flex items-center gap-2 mb-2 text-orange">
                            <AlertTriangle size={16} />
                            <span class="font-black text-[10px] uppercase tracking-widest">Theft/Fault history found</span>
                        </div>
                        {#each historyRecords as record}
                            <div class="history-item">
                                <span class="font-bold">{record.date}</span>
                                <span class="badge-mini">{record.status}</span>
                                <p class="text-[9px] mt-1 italic text-muted">"{record.remarks || 'No remarks'}"</p>
                            </div>
                        {/each}
                    </div>
                {/if}

                <div class="form-row">
                    <div class="form-group flex-1">
                        <label class="label-tiny">Consumer Name</label>
                        <input name="consumerName" type="text" bind:value={consumerName} class="font-semibold" required />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group flex-1">
                        <label class="label-tiny">Meter S/N</label>
                        <input name="meterNo" type="text" bind:value={meterNo} class="font-semibold" required />
                    </div>
                    <div class="form-group flex-1">
                        <label class="label-tiny">Make</label>
                        <input name="meterMake" type="text" bind:value={meterMake} class="font-semibold" required />
                    </div>
                </div>

                <div class="divider-dashed"></div>

                {#if reportType !== 'THREE_PHASE'}
                    <div class="form-row">
                        <div class="form-group flex-1">
                            <label class="label-tiny">Bill Reading</label>
                            <input name="readingBill" type="number" bind:value={readingBill} class="font-bold" />
                        </div>
                        <div class="form-group flex-1">
                            <label class="label-tiny">Meter Reading</label>
                            <input name="readingMeter" type="number" bind:value={readingMeter} class="font-bold" />
                        </div>
                    </div>
                    <div class="auto-calc-box">
                        <span class="label-tiny">Difference</span>
                        <span class="calc-value">{diffSingle} kWh</span>
                    </div>
                {:else}
                    <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div class="form-group"><label class="label-tiny">Peak (Bill)</label><input name="peakBill" type="number" bind:value={peakBill} class="input-small" /></div>
                        <div class="form-group"><label class="label-tiny">Off-Peak (Bill)</label><input name="offPeakBill" type="number" bind:value={offPeakBill} class="input-small" /></div>
                        <div class="form-group"><label class="label-tiny">Peak (Meter)</label><input name="peakMeter" type="number" bind:value={peakMeter} class="input-small" /></div>
                        <div class="form-group"><label class="label-tiny">Off-Peak (Meter)</label><input name="offPeakMeter" type="number" bind:value={offPeakMeter} class="input-small" /></div>
                    </div>
                    <div class="total-calc-box"><span class="label-tiny">Total Recovered</span><span class="calc-value">{totalRecovered} kWh</span></div>
                {/if}

                <div class="form-group">
                    <label class="label-tiny">Fault Status</label>
                    <select name="statusOfMeter" bind:value={statusOfMeter} class="font-bold">
                        {#each statusOptions as option}<option>{option}</option>{/each}
                    </select>
                </div>

                <!-- AI Section -->
                <div class="ai-module-card">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <Zap size={14} class="text-primary" />
                            <span class="label-tiny text-primary">AI Analysis</span>
                        </div>
                        <button type="button" class="ai-run-btn" on:click={analyzeBill}>{aiActive ? 'Analyzing...' : 'Run Analysis'}</button>
                    </div>
                    {#if aiSuggestions.length > 0}
                        <div class="ai-list">
                            {#each aiSuggestions as suggestion}
                                <button type="button" class="ai-chip" on:click={() => remarks = suggestion}>{suggestion}</button>
                            {/each}
                        </div>
                    {/if}
                </div>

                <div class="form-group"><label class="label-tiny">Remarks</label><textarea name="remarks" bind:value={remarks} class="remarks-area" placeholder="Enter special field findings..."></textarea></div>
                <div class="form-actions"><button type="submit" class="btn-primary w-full py-4 uppercase tracking-widest font-black">Save & Print Report</button></div>
            </div>
        </form>
    </div>

    <!-- Right Panel: Records Table -->
    <div class="data-panel flex-1 min-w-0">
        <header class="panel-top-bar">
            <div class="space-y-1">
                <h2 class="text-2xl font-black text-main tracking-tight">Report Registry</h2>
                <div class="flex items-center gap-2"><span class="status-dot"></span><p class="text-[10px] font-black text-muted uppercase tracking-widest">Live Cloud Data Connected</p></div>
            </div>
            <div class="flex items-center gap-3">
                <button class="btn-secondary"><Download size={16} /> Export Excel</button>
                <button class="btn-primary"><Plus size={16} /> New Entry</button>
            </div>
        </header>

        <div class="search-filter-bar">
            <div class="search-input-wrapper"><Search size={16} class="search-icon-fixed" /><input type="text" placeholder="Search Reference, Name, or Meter S/N..." class="filter-input" /></div>
            <div class="filter-actions"><button class="icon-btn-border"><Filter size={16} /></button><button class="icon-btn-border"><RefreshCw size={16} /></button></div>
        </div>

        <div class="table-card">
            <table class="premium-table">
                <thead><tr><th class="w-12">S.No</th><th>Reference / Consumer</th><th>Meter Info</th><th>Type</th><th>Status</th><th>Timestamp</th><th class="text-right">Actions</th></tr></thead>
                <tbody>
                    {#each data.reports as r, i}
                        <tr>
                            <td class="font-mono text-muted">{i + 1}</td>
                            <td><div class="item-cell"><div class="item-icon-box {r.isAiFlagged ? 'bg-error-light' : 'bg-blue-light'}"><FileText size={18} class="{r.isAiFlagged ? 'text-error' : 'text-primary'}" /></div><div><p class="item-title">{r.referenceNo}</p><p class="item-subtitle">{r.consumerName}</p></div></div></td>
                            <td><p class="serial-tag">{r.meterNo}</p><p class="text-[10px] font-medium text-muted uppercase tracking-wider">{r.meterMake}</p></td>
                            <td><span class="badge-mini">{r.type.replace('_', ' ')}</span></td>
                            <td><span class="status-badge {r.statusOfMeter === 'Healthy' ? 'status-success' : 'status-error'}">{r.statusOfMeter}</span></td>
                            <td><span class="time-text">{new Date(r.createdAt).toLocaleDateString()}</span></td>
                            <td class="text-right"><div class="action-group"><button class="action-icon"><Eye size={18} /></button><button class="action-icon"><Download size={18} /></button></div></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    .performa-panel { flex-shrink: 0; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .w-80 { width: 320px; }
    .w-96 { width: 400px; }
    
    .type-toggle { display: flex; background: var(--bg-app); padding: 0.25rem; border-radius: 0.75rem; border: 1px solid var(--border-base); margin-top: 0.75rem; }
    .toggle-btn { flex: 1; border: none; background: transparent; padding: 0.375rem; border-radius: 0.5rem; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
    .toggle-btn.active { background: white; color: var(--primary); box-shadow: var(--shadow-sm); }
    
    .ocr-zone { background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 1rem; margin-bottom: 1rem; position: relative; transition: all 0.3s; }
    .ocr-zone.analysis-done { border-color: var(--primary); background: #f0f7ff; }
    .ocr-upload-label { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem; cursor: pointer; color: var(--text-subtle); transition: color 0.2s; }
    .ocr-upload-label:hover { color: var(--primary); }
    .ocr-badge { position: absolute; right: 0.75rem; top: 0.75rem; background: var(--primary); color: white; padding: 0.2rem 0.5rem; border-radius: 0.5rem; font-size: 0.5rem; font-weight: 900; text-transform: uppercase; display: flex; align-items: center; gap: 0.25rem; box-shadow: 0 4px 6px -1px var(--primary-light); }

    .input-relative { position: relative; }
    .portal-btn { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: var(--primary-light); color: var(--primary); border: 1px solid #dbeafe; border-radius: 0.5rem; padding: 0.375rem; cursor: pointer; display: flex; }
    
    .alert-box-full { background: #fff7ed; border: 1px solid #fed7aa; padding: 1rem; border-radius: 1rem; margin-top: -0.5rem; margin-bottom: 0.5rem; }
    .history-item { background: white; border: 1px solid #fed7aa; padding: 0.75rem; border-radius: 0.75rem; margin-bottom: 0.5rem; }
    
    .auto-calc-box, .total-calc-box { background: #f0f9ff; border: 1px solid #bae6fd; padding: 0.75rem 1rem; border-radius: 0.75rem; display: flex; justify-content: space-between; align-items: center; }
    .calc-value { font-weight: 900; color: #0369a1; font-size: 1rem; }
    
    .ai-module-card { background: #fdfaff; border: 1px solid #f3e8ff; border-radius: 1rem; padding: 1rem; margin-top: 0.5rem; }
    .ai-run-btn { background: #6b21a8; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.5rem; font-size: 0.6rem; font-weight: 900; text-transform: uppercase; cursor: pointer; }

    .status-dot { width: 0.4rem; height: 0.4rem; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); animation: pulse-green 2s infinite; }
</style>
