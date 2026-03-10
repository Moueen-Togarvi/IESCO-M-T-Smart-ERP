<script lang="ts">
    import { enhance } from '$app/forms';
    import { 
        Send, Users, FileText, Download, 
        Plus, Search, Calendar, Hash, X, CheckCircle
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
    $: baseNo = data.nextBaseNo;
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

<div class="flex gap-8 h-full animate-in">
    <!-- Left Configuration Panel -->
    <div class="config-panel">
        <form method="POST" action="?/dispatchMemo" use:enhance class="card-premium p-6">
            <input type="hidden" name="memoNo" value={memoNumber} />
            <input type="hidden" name="recipients" value={recipients.join(', ')} />

            <header class="panel-header">
                <h3 class="text-xs font-black text-main uppercase tracking-widest">Dispatch Settings</h3>
            </header>

            <div class="form-container">
                <div class="form-group">
                    <label class="label-tiny">Auto-Generated Memo No.</label>
                    <div class="info-box font-mono text-primary">
                        {memoNumber}
                    </div>
                    <p class="text-[9px] font-bold text-muted uppercase mt-1">Sequence follows IESCO Jhelum Registry</p>
                </div>

                <div class="form-group">
                    <label class="label-tiny">Target Offices</label>
                    <div class="flex gap-2 mb-3">
                        <input 
                            type="text" 
                            placeholder="Add office (e.g. XEN Ops)..." 
                            bind:value={newRecipient}
                            class="flex-1 text-xs"
                        />
                        <button type="button" on:click={addRecipient} class="btn-primary-small">
                            <Plus size={16} />
                        </button>
                    </div>
                    <div class="recipients-list">
                        {#each recipients as recipient, i}
                            <div class="recipient-tag">
                                <span class="truncate">{recipient}</span>
                                <button type="button" on:click={() => removeRecipient(i)} class="remove-btn">
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="form-group">
                    <label class="label-tiny">Official Subject</label>
                    <textarea 
                        name="subject"
                        bind:value={subject} 
                        rows="3"
                        class="memo-textarea-small"
                        required
                    ></textarea>
                </div>

                <div class="pt-4">
                    <button type="submit" class="btn-primary w-full py-4 uppercase tracking-widest font-black">
                        <Send size={14} />
                        Dispatch & Track
                    </button>
                </div>
            </div>
        </form>
    </div>

    <!-- Right Paper Preview -->
    <div class="preview-panel">
        <div class="paper-preview">
            <!-- Header -->
            <div class="paper-header">
                <h1 class="paper-title">Islamabad Electric Supply Company (IESCO)</h1>
                <p class="paper-subtitle">Office of the Assistant Manager (M&T) Division Jhelum</p>
                <p class="paper-sub-brand">Government of Pakistan Entity</p>
            </div>

            <!-- Body -->
            <div class="paper-body">
                <div class="paper-meta">
                    <div>No: <span class="underlined-field">{memoNumber}</span></div>
                    <div>Dated: <span class="underlined-field">{date}</span></div>
                </div>

                <div class="paper-to-section">
                    <p class="to-label">To,</p>
                    {#each recipients as recipient}
                        <p class="recipient-line">{recipient}</p>
                    {/each}
                </div>

                <div class="paper-subject">
                    <p class="subject-line">
                        Subject: <span class="subject-text">{subject}</span>
                    </p>
                </div>

                <div class="paper-content">
                    <textarea 
                        name="content"
                        bind:value={content}
                        placeholder="Type the official correspondence content here..."
                        class="memo-writing-area"
                        required
                    ></textarea>
                </div>

                <div class="paper-signature">
                    <div class="signature-box">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Signature_of_Barack_Obama.svg" alt="Signature" class="signature-img" />
                        <p class="sig-name">Assistant Manager (M&T)</p>
                        <p class="sig-role">IESCO Division Jhelum</p>
                        <div class="digital-verification">
                            <CheckCircle size={12} />
                            Secured Digital Signature
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="paper-footer">
                <div class="footer-labels">
                    <span>Archived in Dispatch Registry</span>
                    <span class="dot-separator"></span>
                    <span>Classified: Restricted</span>
                </div>
                <button type="button" class="btn-secondary-small">
                    <Download size={14} />
                    Download PDF
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .config-panel { width: 320px; flex-shrink: 0; }
    .preview-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; }
    
    .panel-header { margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem; }
    .form-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .label-tiny { font-size: 0.65rem; font-weight: 900; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; }
    
    .info-box { background: #f0f7ff; border: 1px solid #dbeafe; border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.8rem; font-weight: 900; }
    .btn-primary-small { background: var(--primary); color: white; border: none; padding: 0.5rem; border-radius: 0.625rem; cursor: pointer; display: flex; }
    
    .recipients-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 140px; overflow-y: auto; padding-right: 0.25rem; }
    .recipient-tag { display: flex; align-items: center; justify-content: space-between; background: #eff6ff88; border: 1px solid #dbeafe; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.65rem; font-weight: 800; color: #1e40af; }
    .remove-btn { background: none; border: none; color: #93c5fd; cursor: pointer; transition: color 0.2s; display: flex; }
    .remove-btn:hover { color: #ef4444; }
    
    .memo-textarea-small { width: 100%; height: 80px; background: white; border: 1px solid var(--border-base); border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.7rem; font-weight: 600; font-family: 'Inter', sans-serif; resize: none; transition: border-color 0.2s; }
    .memo-textarea-small:focus { outline: none; border-color: var(--primary); }
    
    .paper-preview { background: white; width: 100%; max-width: 800px; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08); border: 1px solid var(--border-light); min-height: 1000px; display: flex; flex-direction: column; font-family: 'Times New Roman', serif; }
    
    .paper-header { padding: 4rem 4rem 2rem 4rem; border-bottom: 2px solid black; text-align: center; }
    .paper-title { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; margin-bottom: 0.25rem; color: black; }
    .paper-subtitle { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #374151; }
    .paper-sub-brand { font-size: 0.6rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 0.25rem; }
    
    .paper-body { padding: 4rem; flex: 1; display: flex; flex-direction: column; }
    .paper-meta { display: flex; justify-content: space-between; margin-bottom: 3rem; font-size: 0.875rem; font-weight: 700; }
    .underlined-field { border-bottom: 1px solid black; padding: 0 0.5rem; }
    
    .paper-to-section { margin-bottom: 3rem; font-size: 0.875rem; }
    .to-label { font-weight: 900; margin-bottom: 0.75rem; font-size: 1rem; }
    .recipient-line { margin-left: 2.5rem; text-transform: uppercase; font-weight: 900; color: #1f2937; margin-bottom: 0.25rem; }
    
    .paper-subject { margin-bottom: 3rem; padding: 0.75rem 0; border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1); }
    .subject-line { text-align: center; font-weight: 900; text-transform: uppercase; font-size: 0.875rem; }
    .subject-text { text-decoration: underline; text-underline-offset: 4px; }
    
    .paper-content { flex: 1; margin-bottom: 5rem; }
    .memo-writing-area { width: 100%; height: 100%; border: none; resize: none; font-size: 0.95rem; line-height: 1.6; color: black; padding: 0; }
    .memo-writing-area:focus { outline: none; }
    
    .paper-signature { display: flex; justify-content: flex-end; }
    .signature-box { text-align: right; }
    .signature-img { height: 3.5rem; opacity: 0.8; margin-bottom: 0.5rem; display: block; margin-left: auto; }
    .sig-name { font-weight: 900; font-size: 0.875rem; text-transform: uppercase; }
    .sig-role { font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; }
    
    .digital-verification { margin-top: 1.5rem; padding: 0.5rem 1rem; border: 1px dashed #bfdbfe; border-radius: 0.5rem; font-size: 0.6rem; font-weight: 900; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.1em; background: #eff6ff88; font-style: italic; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    
    .paper-footer { background: #f9fafb; padding: 1.5rem 4rem; border-top: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; }
    .footer-labels { display: flex; align-items: center; gap: 1rem; font-size: 0.6rem; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; }
    .dot-separator { width: 4px; height: 4px; background: #d1d5db; border-radius: 50%; }
    .btn-secondary-small { background: white; border: 1px solid var(--border-base); padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
</style>
