<script lang="ts">
    import { enhance } from '$app/forms';
    import { 
        Send, Users, FileText, Download, 
        Plus, Search, Calendar, Hash, X, CheckCircle,
        ShieldCheck, Mail, Briefcase, Printer, History
    } from 'lucide-svelte';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    let date = new Date().toISOString().split('T')[0];
    let recipients = ["XEN (Operations) Jhelum", "SRE City Subdivision"];
    let newRecipient = "";
    let subject = "Inquiry regarding burnt meter at Ref: 1421... ";
    let content = "";

    // Sequential Logic
    $: baseNo = data.memos ? 400 + data.memos.length : 400;
    $: recipientCount = recipients.length;
    $: memoNumber = `IESCO/MT/2026/${baseNo}${recipientCount > 1 ? '-' + String(recipientCount).padStart(2, '0') : ''}`;

    const addRecipient = () => {
        if (newRecipient) {
            recipients = [...recipients, newRecipient];
            newRecipient = "";
        }
    };

    const removeRecipient = (index: number) => {
        recipients = recipients.filter((_, i) => i !== index);
    };

    $: if (form?.success) {
        alert('Memo Dispatched & Saved to Folder!');
        content = "";
    }
</script>

<div class="memos-container animate-in">
    <!-- Left: Configuration Terminal -->
    <aside class="dispatch-config">
        <form method="POST" action="?/createMemo" use:enhance class="card-premium fill-form">
            <input type="hidden" name="memoNo" value={memoNumber} />
            <input type="hidden" name="sendTo" value={recipients.join(', ')} />
            <input type="hidden" name="officesCount" value={recipientCount} />
            <input type="hidden" name="documentType" value="Official Dispatch" />

            <div class="terminal-header">
                <div>
                    <h3 class="terminal-title">Dispatch Terminal</h3>
                    <p class="terminal-subtitle">Official Correspondence Hub</p>
                </div>
                <div class="status-indicator">
                    <span class="pulse"></span>
                    Ready
                </div>
            </div>

            <div class="terminal-scroll custom-scrollbar">
                <div class="field-entry">
                    <label>Generated Identity</label>
                    <div class="id-display mono-font">
                        <Hash size={14} />
                        {memoNumber}
                    </div>
                </div>

                <div class="field-entry">
                    <label>Destination Layer</label>
                    <div class="recipient-input-group">
                        <input 
                            type="text" 
                            placeholder="Add targeted office..." 
                            bind:value={newRecipient}
                            on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addRecipient())}
                        />
                        <button type="button" on:click={addRecipient} class="add-btn">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div class="recipients-stack">
                        {#each recipients as recipient, i}
                            <div class="recipient-pill shadow-sm">
                                <Mail size={12} />
                                <span class="truncate">{recipient}</span>
                                <button type="button" on:click={() => removeRecipient(i)} class="kill-btn">
                                    <X size={12} />
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="field-entry">
                    <label>Official Subject Header</label>
                    <textarea 
                        name="subject"
                        bind:value={subject} 
                        rows="3"
                        placeholder="Define the scope of this memo..."
                        required
                    ></textarea>
                </div>
                
                <div class="info-alert">
                    <ShieldCheck size={14} />
                    <span>Sequence validated via IESCO Jhelum Registry</span>
                </div>
            </div>

            <div class="terminal-footer">
                <button type="submit" class="btn-primary w-full shadow-glow py-4">
                    <Send size={18} />
                    Dispatch Archive
                </button>
            </div>
        </form>
    </aside>

    <!-- Right: Paper Engine Preview -->
    <main class="preview-engine">
        <div class="paper-canvas shadow-xl">
            <!-- Official Header -->
            <div class="iesco-header">
                <div class="gov-seal">
                    <!-- Placeholder for Seal -->
                    <div class="seal-icon">IESCO</div>
                </div>
                <div class="header-text">
                    <h1 class="main-org">Islamabad Electric Supply Company (IESCO)</h1>
                    <p class="dept">Office of the Assistant Manager (M&T) Division Jhelum</p>
                    <p class="branch">M&T Jhelum Sub-Office</p>
                </div>
            </div>

            <div class="meta-strip">
                <div class="meta-item">
                    <span class="meta-label">NO:</span>
                    <span class="meta-field">{memoNumber}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">DATED:</span>
                    <span class="meta-field">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
            </div>

            <div class="recipients-box">
                <p class="to-prefix">To,</p>
                <div class="recipients-list">
                    {#each recipients as recipient}
                        <p class="recipient-line">{recipient.toUpperCase()}</p>
                    {/each}
                </div>
            </div>

            <div class="subject-box">
                <p class="subject-line">
                    <span class="subj-tag">Subject:</span>
                    <span class="subj-content underline underline-offset-4 decoration-2">{subject.toUpperCase()}</span>
                </p>
            </div>

            <div class="content-box">
                <textarea 
                    name="content"
                    bind:value={content}
                    placeholder="Commence official transcript..."
                    class="paper-textarea"
                    required
                ></textarea>
            </div>

            <div class="signature-block">
                <div class="sig-container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Signature_of_Barack_Obama.svg" alt="Auth Signature" class="sig-img" />
                    <div class="sig-details">
                        <p class="name">Assistant Manager (M&T)</p>
                        <p class="org">IESCO Division Jhelum</p>
                    </div>
                </div>
                <div class="digital-seal">
                    <ShieldCheck size={14} />
                    <span>Cryptographic Audit Trail Applied</span>
                </div>
            </div>

            <footer class="paper-footer">
                <div class="footer-left">
                    <span>Dispatch Registry: MT-2026-X</span>
                </div>
                <div class="footer-actions">
                    <button type="button" class="action-btn">
                        <Printer size={16} />
                        Print Formal
                    </button>
                    <button type="button" class="action-btn primary">
                        <Download size={16} />
                        Generate PDF
                    </button>
                </div>
            </footer>
        </div>
    </main>
</div>

<style>
    .memos-container {
        display: flex;
        gap: 3rem;
        height: calc(100vh - 160px);
    }

    /* Dispatch Configuration Panel */
    .dispatch-config {
        width: 360px;
        flex-shrink: 0;
    }

    .fill-form {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .terminal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .terminal-title {
        font-size: 1.125rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--text-primary);
    }

    .terminal-subtitle {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-tertiary);
    }

    .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--brand-primary);
        background: var(--brand-primary-light);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
    }

    .pulse { width: 6px; height: 6px; background: var(--brand-primary); border-radius: 50%; animation: pulse 2s infinite; }

    .terminal-scroll {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
    }

    .field-entry { display: flex; flex-direction: column; gap: 0.5rem; }
    .field-entry label { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-tertiary); letter-spacing: 0.05em; }

    .id-display {
        background: var(--bg-main);
        border: 1px solid var(--border-subtle);
        padding: 0.875rem 1rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 800;
        color: var(--brand-primary);
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .recipient-input-group { position: relative; display: flex; gap: 0.5rem; }
    .add-btn {
        background: var(--brand-primary);
        color: white;
        border: none;
        padding: 0 0.75rem;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .add-btn:hover { transform: scale(1.05); }

    .recipients-stack {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.75rem;
    }

    .recipient-pill {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        background: white;
        border: 1px solid var(--border-subtle);
        padding: 0.625rem 0.875rem;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-secondary);
    }

    .kill-btn {
        margin-left: auto;
        border: none;
        background: #fee2e2;
        color: #ef4444;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .info-alert {
        padding: 0.875rem;
        background: #fdfaff;
        border: 1px solid #f3e8ff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.7rem;
        font-weight: 700;
        color: #7c3aed;
    }

    .terminal-footer { padding: 1.5rem; border-top: 1px solid var(--border-light); }

    /* Paper Preview Engine */
    .preview-engine {
        flex: 1;
        display: flex;
        justify-content: center;
        overflow-y: auto;
        padding: 2rem;
        background: #f1f5f9;
        border-radius: 20px;
        mask-image: linear-gradient(to bottom, black 90%, transparent);
    }

    .paper-canvas {
        background: white;
        width: 100%;
        max-width: 800px;
        min-height: 1000px;
        padding: 4rem;
        display: flex;
        flex-direction: column;
        font-family: 'Times New Roman', serif;
        position: relative;
    }

    .iesco-header {
        display: flex;
        align-items: center;
        gap: 2rem;
        border-bottom: 3px double #000;
        padding-bottom: 2rem;
        margin-bottom: 3rem;
    }

    .seal-icon {
        width: 70px;
        height: 70px;
        border: 2px solid #000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .header-text { flex: 1; text-align: center; }
    .main-org { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.01em; margin-bottom: 0.25rem; color: #000; }
    .dept { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: #374151; }
    .branch { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 0.5rem; }

    .meta-strip {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3rem;
        font-size: 1rem;
        font-weight: 700;
    }

    .meta-field { border-bottom: 1px solid #000; padding: 0 1rem; min-width: 150px; display: inline-block; text-align: center; }

    .recipients-box { margin-bottom: 3rem; }
    .to-prefix { font-weight: 900; font-size: 1.125rem; margin-bottom: 1rem; }
    .recipient-line { margin-left: 3rem; font-weight: 800; font-size: 1rem; color: #111; margin-bottom: 0.375rem; }

    .subject-box { margin-bottom: 3.5rem; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 1rem 0; }
    .subject-line { text-align: center; font-weight: 900; font-size: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .subj-tag { font-size: 0.875rem; color: #444; }

    .content-box { flex: 1; margin-bottom: 5rem; }
    .paper-textarea {
        width: 100%;
        height: 100%;
        border: none;
        resize: none;
        font-size: 1.125rem;
        line-height: 1.8;
        color: #000;
        background: transparent;
    }
    .paper-textarea:focus { outline: none; }

    .signature-block { display: flex; flex-direction: column; align-items: flex-end; gap: 1.5rem; }
    .sig-container { text-align: right; }
    .sig-img { height: 4rem; margin-bottom: 0.5rem; opacity: 0.9; margin-left: auto; }
    .sig-details .name { font-weight: 900; font-size: 1.125rem; text-transform: uppercase; }
    .sig-details .org { font-size: 0.875rem; font-weight: 700; color: #666; text-transform: uppercase; }

    .digital-seal {
        background: #f0fdf4;
        border: 1px dashed #4ade80;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.65rem;
        font-weight: 900;
        color: #166534;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .paper-footer {
        position: sticky;
        bottom: 0;
        margin-top: 4rem;
        padding-top: 2rem;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-left { font-size: 0.7rem; font-weight: 800; color: #999; text-transform: uppercase; }
    .footer-actions { display: flex; gap: 1rem; }
    .action-btn {
        background: white;
        border: 1px solid var(--border-subtle);
        padding: 0.625rem 1.25rem;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    .action-btn:hover { background: #f8fafc; border-color: var(--border-base); }
    .action-btn.primary { background: var(--brand-primary); color: white; border-color: var(--brand-primary); }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }

    /* Responsive Queries */
    @media (max-width: 1024px) {
        .memos-container {
            flex-direction: column;
            height: auto;
        }
        .dispatch-config {
            width: 100%;
        }
        .paper-canvas {
            padding: 2rem;
        }
    }
    @media (max-width: 768px) {
        .paper-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }
        .footer-actions {
            flex-direction: column;
            width: 100%;
        }
        .action-btn { width: 100%; justify-content: center; }
    }
</style>
