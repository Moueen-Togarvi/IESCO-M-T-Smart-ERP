<script lang="ts">
    import { 
        User, Shield, Signature, Upload, Save, 
        Trash2, CheckCircle, Bell, Globe, Key 
    } from 'lucide-svelte';
    import { enhance } from '$app/forms';

    let userName = "Moueen Togarvi";
    let userRole = "Admin Staff";
    let signatureUploaded = false;
</script>

<div class="w-full space-y-8 animate-in">
    <header class="flex items-center justify-between">
        <div class="space-y-1">
            <h2 class="text-2xl font-black text-main tracking-tight">System Settings</h2>
            <p class="text-xs font-bold text-muted uppercase tracking-widest">Manage your identity and preferences</p>
        </div>
        <button class="btn-primary">
            <Save size={16} />
            Save Changes
        </button>
    </header>

    <div class="grid grid-cols-3 gap-8">
        <!-- Sidebar Navigation -->
        <aside class="col-span-1 space-y-2">
            <button class="settings-nav-btn active">
                <User size={18} />
                <span>Profile Details</span>
            </button>
            <button class="settings-nav-btn">
                <Shield size={18} />
                <span>Security</span>
            </button>
            <button class="settings-nav-btn">
                <Bell size={18} />
                <span>Notifications</span>
            </button>
            <button class="settings-nav-btn">
                <Globe size={18} />
                <span>Regional Settings</span>
            </button>
        </aside>

        <!-- Main Content -->
        <main class="col-span-2 space-y-6">
            <!-- Account Info -->
            <section class="card-premium p-8">
                <h3 class="text-xs font-black text-main uppercase tracking-widest mb-6">Account Information</h3>
                <div class="space-y-5">
                    <div class="form-group">
                        <label class="label-tiny">Full Name</label>
                        <input type="text" bind:value={userName} class="font-bold" />
                    </div>
                    <div class="form-group">
                        <label class="label-tiny">Role / Designation</label>
                        <div class="badge-display">
                            <Shield size={14} class="text-primary" />
                            <span>{userRole}</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Digital Signature Section -->
            <section class="card-premium p-8 border-primary-light bg-blue-fade">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <Signature size={20} class="text-primary" />
                        <h3 class="text-xs font-black text-main uppercase tracking-widest">Digital Signature</h3>
                    </div>
                    {#if signatureUploaded}
                        <div class="flex items-center gap-1.5 text-success font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle size={14} />
                            Verified
                        </div>
                    {/if}
                </div>

                <p class="text-xs font-medium text-muted mb-6 leading-relaxed">
                    Upload your official signature image (PNG/JPG). This will be automatically embedded in all generated Memos and Reports.
                </p>

                <div class="signature-upload-zone {signatureUploaded ? 'has-signature' : ''}">
                    {#if !signatureUploaded}
                        <div class="flex flex-col items-center gap-3">
                            <div class="upload-icon-box">
                                <Upload size={24} />
                            </div>
                            <div class="text-center">
                                <p class="text-[11px] font-black text-main uppercase tracking-widest mb-1">Upload Signature</p>
                                <p class="text-[10px] font-bold text-muted">PNG with transparent background preferred</p>
                            </div>
                            <button class="btn-secondary mt-2" on:click={() => signatureUploaded = true}>Choose File</button>
                        </div>
                    {:else}
                        <div class="flex items-center justify-between w-full">
                            <div class="signature-preview">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Signature_of_Barack_Obama.svg" alt="Signature" class="h-12 opacity-80" />
                            </div>
                            <button class="action-icon text-error hover:bg-error-bg p-2 rounded-lg transition-all" on:click={() => signatureUploaded = false}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    {/if}
                </div>
            </section>

            <!-- Password Change -->
            <section class="card-premium p-8">
                <div class="flex items-center gap-3 mb-6">
                    <Key size={20} class="text-subtle" />
                    <h3 class="text-xs font-black text-main uppercase tracking-widest">Authentication</h3>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-black text-main uppercase tracking-widest mb-1">Reset Password</p>
                        <p class="text-[10px] font-bold text-muted">A secure reset link will be sent to your official email.</p>
                    </div>
                    <button class="btn-secondary">Send Link</button>
                </div>
            </section>
        </main>
    </div>
</div>

<style>
    .settings-nav-btn { width: 100%; display: flex; align-items: center; gap: 0.875rem; padding: 0.875rem 1rem; border: none; background: transparent; border-radius: 0.75rem; color: var(--text-muted); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .settings-nav-btn:hover { background: #f3f4f6; color: var(--text-main); }
    .settings-nav-btn.active { background: white; color: var(--primary); box-shadow: var(--shadow-sm); border: 1px solid var(--border-base); }
    
    .badge-display { display: flex; align-items: center; gap: 0.5rem; background: #f3f4f6; padding: 0.625rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-base); font-size: 0.8rem; font-weight: 700; color: #4b5563; width: fit-content; }
    
    .border-primary-light { border-color: #dbeafe; }
    .bg-blue-fade { background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%); }
    
    .signature-upload-zone { border: 2px dashed #d1d5db; border-radius: 1rem; padding: 2.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.2s; background: white; }
    .signature-upload-zone.has-signature { border-style: solid; border-color: #dbeafe; padding: 1.5rem; }
    .upload-icon-box { width: 3rem; height: 3rem; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-subtle); }
    
    .text-success { color: #10b981; }
    .error-bg { background-color: #fef2f2; }
    
    .signature-preview { padding: 1rem; background: white; border-radius: 0.75rem; border: 1px solid #f3f4f6; }
</style>
