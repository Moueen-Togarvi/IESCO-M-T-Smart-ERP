<script lang="ts">
    import { enhance } from '$app/forms';
    import { 
        Search, ExternalLink, AlertCircle, History, 
        Eye, Pencil, Trash2, Filter, Plus, FileText, 
        Zap, TrendingUp, ChevronLeft, ChevronRight, Download, RefreshCw, AlertTriangle, 
        Image as ImageIcon, Upload, FileSearch, CheckCircle2, MoreHorizontal
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
    let historyRecords: any[] = [];
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
    let aiSuggestions: string[] = [];
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

<div class="reports-container animate-in">
    <!-- Left: Entry Console -->
    <aside class="entry-console">
        <form method="POST" action="?/createReport" use:enhance class="card-premium entry-form">
            <input type="hidden" name="type" value={reportType} />
            <input type="hidden" name="subdivision" value={subdivision} />

            <div class="form-header">
                <div class="header-main">
                    <h3 class="entry-title">Entry Terminal</h3>
                    <p class="entry-subtitle">Precision Data Logging</p>
                </div>
                <div class="type-selector">
                    <button type="button" class:active={reportType === 'SINGLE_PHASE'} on:click={() => reportType = 'SINGLE_PHASE'}>Single</button>
                    <button type="button" class:active={reportType === 'THREE_PHASE'} on:click={() => reportType = 'THREE_PHASE'}>3-Ph</button>
                    <button type="button" class:active={reportType === 'SPECIAL_CASE'} on:click={() => reportType = 'SPECIAL_CASE'}>Special</button>
                </div>
            </div>

            <div class="form-scrollable custom-scrollbar">
                {#if reportType === 'SPECIAL_CASE'}
                    <div class="ai-ocr-dropzone" class:success={analysisSuccess}>
                        {#if isAnalyzingImage}
                            <div class="loading-state">
                                <RefreshCw size={24} class="spin-icon" />
                                <span>Spectral Analysis...</span>
                            </div>
                        {:else}
                            <label class="dropzone-label">
                                <Upload size={24} />
                                <div class="label-text">
                                    <p class="main-label">Upload Memo/Letter</p>
                                    <p class="sub-label">Drag or click to scan via AI</p>
                                </div>
                                <input type="file" hidden on:change={simulateOCR} />
                            </label>
                        {/if}
                        {#if analysisSuccess}
                            <div class="ai-status-pill">
                                <Zap size={10} />
                                <span>AI Extracted</span>
                            </div>
                        {/if}
                    </div>
                {/if}

                <div class="field-group">
                    <label>Reference Number (14-Digit)</label>
                    <div class="input-with-action">
                        <input 
                            name="referenceNo" type="text" maxlength="14" placeholder="00000000000000"
                            bind:value={referenceNumber} on:input={checkReference} required
                            class="mono-font"
                        />
                        {#if referenceNumber.length === 14}
                            <a href="https://lees.iesco.com.pk/iescobill" target="_blank" class="action-btn-sm" title="View Bill Portal">
                                <ExternalLink size={14} />
                            </a>
                        {/if}
                    </div>
                </div>

                {#if showAlert}
                    <div class="history-alert animate-in">
                        <div class="alert-head">
                            <AlertTriangle size={14} />
                            <span>Risk History Detected</span>
                        </div>
                        <div class="history-list">
                            {#each historyRecords as record}
                                <div class="history-card">
                                    <div class="card-row">
                                        <span class="date">{record.date}</span>
                                        <span class="status-chip-mini">{record.status}</span>
                                    </div>
                                    <p class="remarks text-muted italic">"{record.remarks || 'No detailed logs'}"</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <div class="field-group">
                    <label>Consumer Identity</label>
                    <input name="consumerName" type="text" bind:value={consumerName} placeholder="Enter full name..." required />
                </div>

                <div class="row-flex">
                    <div class="field-group flex-1">
                        <label>Meter Serial</label>
                        <input name="meterNo" type="text" bind:value={meterNo} placeholder="IES-..." required />
                    </div>
                    <div class="field-group flex-1">
                        <label>Manufacturer</label>
                        <input name="meterMake" type="text" bind:value={meterMake} placeholder="e.g. Microtech" required />
                    </div>
                </div>

                <div class="v-divider"></div>

                {#if reportType !== 'THREE_PHASE'}
                    <div class="row-flex">
                        <div class="field-group flex-1">
                            <label>Portal Reading</label>
                            <input name="readingBill" type="number" bind:value={readingBill} class="bold-font" />
                        </div>
                        <div class="field-group flex-1">
                            <label>On-Site Reading</label>
                            <input name="readingMeter" type="number" bind:value={readingMeter} class="bold-font" />
                        </div>
                    </div>
                    <div class="calculation-summary blue">
                        <span class="calc-label">Differential</span>
                        <span class="calc-value">{diffSingle} <span>kWh</span></span>
                    </div>
                {:else}
                    <div class="grid grid-cols-2 gap-3">
                        <div class="field-group"><label>Peak (Portal)</label><input name="peakBill" type="number" bind:value={peakBill} /></div>
                        <div class="field-group"><label>Off-Peak (Portal)</label><input name="offPeakBill" type="number" bind:value={offPeakBill} /></div>
                        <div class="field-group"><label>Peak (Site)</label><input name="peakMeter" type="number" bind:value={peakMeter} /></div>
                        <div class="field-group"><label>Off-Peak (Site)</label><input name="offPeakMeter" type="number" bind:value={offPeakMeter} /></div>
                    </div>
                    <div class="calculation-summary indigo">
                        <span class="calc-label">Total Recovered</span>
                        <span class="calc-value">{totalRecovered} <span>kWh</span></span>
                    </div>
                {/if}

                <div class="field-group">
                    <label>Technical Status</label>
                    <select name="statusOfMeter" bind:value={statusOfMeter} class="bold-font">
                        {#each statusOptions as option}<option>{option}</option>{/each}
                    </select>
                </div>

                <div class="ai-analysis-block">
                    <div class="ai-header">
                        <div class="ai-label">
                            <Zap size={14} />
                            <span>AI Diagnostic</span>
                        </div>
                        <button type="button" class="ai-btn" on:click={analyzeBill} disabled={aiActive}>
                            {aiActive ? 'Scanning...' : 'Run Diagnostics'}
                        </button>
                    </div>
                    {#if aiSuggestions.length > 0}
                        <div class="ai-suggestions animate-in">
                            {#each aiSuggestions as suggestion}
                                <button type="button" class="suggestion-pill" on:click={() => remarks = suggestion}>
                                    {suggestion}
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>

                <div class="field-group">
                    <label>Officer Remarks</label>
                    <textarea name="remarks" bind:value={remarks} placeholder="Note any visible irregularities..." rows="3"></textarea>
                </div>
            </div>

            <div class="form-footer">
                <button type="submit" class="btn-primary w-full shadow-glow">
                    <CheckCircle2 size={18} />
                    Commit & Generate PDF
                </button>
            </div>
        </form>
    </aside>

    <!-- Right: Registry Table -->
    <main class="registry-viewport">
        <header class="view-header">
            <div class="header-info">
                <h2 class="view-title">Registry Archive</h2>
                <div class="live-status">
                    <span class="live-pulse"></span>
                    <span>Synchronized with Mainframe</span>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn-secondary">
                    <Download size={16} />
                    Export Dataset
                </button>
                <div class="h-divider"></div>
                <button class="btn-icon">
                    <MoreHorizontal size={20} />
                </button>
            </div>
        </header>

        <div class="filter-strip card-premium">
            <div class="search-box">
                <Search size={18} class="search-icon" />
                <input type="text" placeholder="Filter by reference, consumer, or serial..." />
            </div>
            <div class="filter-actions">
                <button class="filter-btn">
                    <Filter size={16} />
                    View Options
                </button>
                <div class="v-separator"></div>
                <button class="refresh-btn">
                    <RefreshCw size={16} />
                </button>
            </div>
        </div>

        <div class="table-container card-premium">
            <table class="registry-table">
                <thead>
                    <tr>
                        <th class="w-16">Index</th>
                        <th>Reference / Consumer</th>
                        <th>Technical ID</th>
                        <th>Class</th>
                        <th>Diagnostic</th>
                        <th>Logged</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.reports as r, i}
                        <tr class="table-row animate-in" style="animation-delay: {i * 0.05}s">
                            <td class="index-cell">#{String(i + 1).padStart(3, '0')}</td>
                            <td>
                                <div class="consumer-cell">
                                    <div class="icon-avatar" class:flagged={r.isAiFlagged}>
                                        <FileText size={18} />
                                    </div>
                                    <div class="info">
                                        <p class="ref">{r.referenceNo}</p>
                                        <p class="name">{r.consumerName}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="id-cell">
                                    <span class="serial">{r.meterNo}</span>
                                    <span class="make">{r.meterMake}</span>
                                </div>
                            </td>
                            <td>
                                <span class="type-pill">{r.type.split('_')[0]}</span>
                            </td>
                            <td>
                                <span class="status-pill" class:healthy={r.statusOfMeter === 'Healthy'} class:critical={r.statusOfMeter !== 'Healthy'}>
                                    {r.statusOfMeter}
                                </span>
                            </td>
                            <td>
                                <span class="date-cell">{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </td>
                            <td class="text-right">
                                <div class="action-btns">
                                    <button class="row-btn" title="View Detail"><Eye size={16} /></button>
                                    <button class="row-btn" title="Edit Record"><Pencil size={16} /></button>
                                    <form method="POST" action="?/deleteReport" use:enhance class="inline-form">
                                        <input type="hidden" name="id" value={r.id} />
                                        <button type="submit" class="row-btn delete-btn" title="Delete Record">
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                    <button class="row-btn" title="Download Audit"><Download size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            
            <footer class="table-pagination">
                <span class="result-count">Showing {data.reports.length} critical records</span>
                <div class="pagination-controls">
                    <button class="page-nav"><ChevronLeft size={16} /></button>
                    <span class="page-indicator">Page 1 of 12</span>
                    <button class="page-nav"><ChevronRight size={16} /></button>
                </div>
            </footer>
        </div>
    </main>
</div>

<style>
    .reports-container {
        display: flex;
        gap: 1.5rem;
        align-items: stretch;
        height: calc(100vh - 120px);
    }

    /* Entry Console Styles */
    .entry-console {
        width: 320px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
    }

    .entry-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .form-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-light);
    }

    .entry-title {
        font-size: 1.125rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--text-primary);
    }

    .entry-subtitle {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-tertiary);
        margin-top: 0.125rem;
    }

    .type-selector {
        display: flex;
        background: var(--bg-main);
        padding: 0.25rem;
        border-radius: 10px;
        margin-top: 0.5rem;
    }

    .type-selector button {
        flex: 1;
        border: none;
        background: transparent;
        padding: 0.25rem 0.5rem;
        border-radius: 8px;
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--text-tertiary);
        cursor: pointer;
        transition: all 0.2s;
    }

    .type-selector button.active {
        background: white;
        color: var(--brand-primary);
        box-shadow: var(--shadow-sm);
    }

    .form-scrollable {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .field-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .field-group label {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-tertiary);
    }

    .mono-font { font-family: 'JetBrains Mono', monospace; letter-spacing: -0.02em; }
    .bold-font { font-weight: 700; }

    .input-with-action {
        position: relative;
    }

    .action-btn-sm {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        background: var(--brand-primary-light);
        color: var(--brand-primary);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .action-btn-sm:hover {
        background: var(--brand-primary);
        color: white;
    }

    /* AI OCR Styles */
    .ai-ocr-dropzone {
        background: #f8fafc;
        border: 2px dashed var(--border-subtle);
        border-radius: 16px;
        transition: all 0.3s;
        position: relative;
    }

    .ai-ocr-dropzone.success {
        border-color: var(--brand-primary);
        background: #f0f7ff;
    }

    .dropzone-label {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        cursor: pointer;
        color: var(--text-tertiary);
    }

    .dropzone-label:hover {
        color: var(--brand-primary);
    }

    .main-label { font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); }
    .sub-label { font-size: 0.7rem; font-weight: 600; color: var(--text-tertiary); }

    .ai-status-pill {
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--brand-primary);
        color: white;
        padding: 2px 10px;
        border-radius: 20px;
        font-size: 0.6rem;
        font-weight: 800;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }

    /* Calculation Cards */
    .calculation-summary {
        padding: 0.5rem 0.75rem;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .calculation-summary.blue { background: #eff6ff; border: 1px solid #dbeafe; }
    .calculation-summary.indigo { background: #f5f3ff; border: 1px solid #ede9fe; }

    .calc-label { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); }
    .calc-value { font-size: 1.25rem; font-weight: 900; color: var(--text-primary); }
    .calc-value span { font-size: 0.75rem; color: var(--text-tertiary); }

    /* AI Analysis Block */
    .ai-analysis-block {
        background: #fdfaff;
        border: 1px solid #f3e8ff;
        border-radius: 16px;
        padding: 0.75rem 1rem;
    }

    .ai-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .ai-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        color: #7c3aed;
    }

    .ai-btn {
        background: #7c3aed;
        color: white;
        border: none;
        padding: 0.375rem 0.75rem;
        border-radius: 8px;
        font-size: 0.65rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
    }

    .ai-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .suggestion-pill {
        background: white;
        border: 1px solid #ede9fe;
        color: #6d28d9;
        padding: 0.375rem 0.75rem;
        border-radius: 8px;
        font-size: 0.7rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .suggestion-pill:hover {
        background: #f5f3ff;
        border-color: #7c3aed;
    }

    /* Registry Table Styles */
    .registry-viewport {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .view-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .view-title {
        font-size: 1.75rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--text-primary);
    }

    .live-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--text-tertiary);
        margin-top: 0.25rem;
    }

    .live-pulse {
        width: 8px;
        height: 8px;
        background: var(--success);
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .h-divider { width: 1px; height: 24px; background: var(--border-subtle); }

    .filter-strip {
        padding: 0.75rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .search-box {
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
        pointer-events: none;
    }

    .search-box input {
        border: none;
        background: transparent;
        padding-left: 2rem;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .search-box input:focus { box-shadow: none; }

    .filter-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .filter-btn {
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-secondary);
        cursor: pointer;
    }

    .table-container {
        display: flex;
        flex-direction: column;
        overflow-x: auto;
        flex: 1;
    }

    .registry-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 650px; /* Reduced min-width to prevent overflow */
    }

    .registry-table th {
        text-align: left;
        padding: 1.25rem 1.5rem;
        font-size: 0.65rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-tertiary);
        border-bottom: 1px solid var(--border-light);
    }

    .table-row {
        border-bottom: 1px solid var(--border-light);
        transition: background 0.2s;
    }

    .table-row:hover {
        background: #fbfcfe;
    }

    .table-row td {
        padding: 0.75rem 1rem;
        vertical-align: middle;
    }

    .index-cell {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-tertiary);
    }

    .consumer-cell {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .icon-avatar {
        width: 40px;
        height: 40px;
        background: #f1f5f9;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
    }

    .icon-avatar.flagged {
        background: #fef2f2;
        color: var(--error);
    }

    .consumer-cell .ref {
        font-size: 0.8125rem;
        font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.01em;
    }

    .consumer-cell .name {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-tertiary);
    }

    .id-cell { display: flex; flex-direction: column; }
    .id-cell .serial { font-weight: 700; color: var(--text-secondary); font-size: 0.8125rem; }
    .id-cell .make { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); }

    .type-pill {
        padding: 0.25rem 0.5rem;
        background: var(--bg-main);
        border-radius: 6px;
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--text-secondary);
    }

    .status-pill {
        padding: 0.35rem 0.75rem;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
    }

    .status-pill.healthy { background: #dcfce7; color: #166534; }
    .status-pill.critical { background: #fee2e2; color: #991b1b; }

    .date-cell {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-tertiary);
    }

    .action-btns {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .row-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: var(--text-tertiary);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .row-btn:hover {
        background: var(--bg-main);
        color: var(--brand-primary);
    }

    .row-btn.delete-btn:hover {
        color: var(--error);
        background: #fef2f2;
    }

    .inline-form {
        display: inline;
        margin: 0;
    }

    .table-pagination {
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--border-light);
        margin-top: auto;
    }

    .result-count { font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); }

    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .page-indicator { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); }

    .page-nav {
        width: 32px;
        height: 32px;
        border: 1px solid var(--border-subtle);
        background: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        cursor: pointer;
    }

    .form-footer {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--border-light);
    }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.4; }
        100% { transform: scale(1); opacity: 1; }
    }

    .spin-icon { animation: spin 2s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* Responsive Queries */
    @media (max-width: 1024px) {
        .reports-container {
            flex-direction: column;
            height: auto;
        }
        .entry-console {
            width: 100%;
        }
        .row-flex {
            flex-direction: column;
        }
        .view-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        .filter-strip {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        .search-box {
            max-width: 100%;
            width: 100%;
        }
        .table-container {
            overflow-x: auto;
        }
    }
</style>
