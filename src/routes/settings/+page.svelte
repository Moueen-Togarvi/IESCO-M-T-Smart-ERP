<script lang="ts">
    import { 
        User, Shield, Signature, Upload, Save, 
        Trash2, CheckCircle, Bell, Globe, Key,
        LogOut, MoreVertical, ChevronRight, Zap
    } from 'lucide-svelte';
    import { enhance } from '$app/forms';

    let userName = "Moueen Togarvi";
    let userRole = "Admin Staff";
    let signatureUploaded = true;
</script>

<div class="settings-container animate-in">
    <header class="settings-header">
        <div class="header-main">
            <h2 class="view-title">System Architecture</h2>
            <p class="view-subtitle">User Preference & Identity Configuration</p>
        </div>
        <div class="header-actions">
            <button class="btn-primary shadow-glow">
                <Save size={18} />
                Synchronize Changes
            </button>
        </div>
    </header>

    <div class="settings-grid">
        <!-- Vertical Navigation -->
        <aside class="settings-sidebar">
            <div class="nav-group">
                <p class="group-label">Personalization</p>
                <button class="nav-item active">
                    <User size={18} />
                    <span>User Profile</span>
                    <ChevronRight size={14} class="ml-auto" />
                </button>
                <button class="nav-item">
                    <Signature size={18} />
                    <span>Digital Identity</span>
                    <ChevronRight size={14} class="ml-auto" />
                </button>
            </div>

            <div class="nav-group">
                <p class="group-label">Infrastructure</p>
                <button class="nav-item">
                    <Shield size={18} />
                    <span>Security Protocol</span>
                    <ChevronRight size={14} class="ml-auto" />
                </button>
                <button class="nav-item">
                    <Bell size={18} />
                    <span>Alert Hub</span>
                    <ChevronRight size={14} class="ml-auto" />
                </button>
                <button class="nav-item">
                    <Globe size={18} />
                    <span>Regional Logic</span>
                    <ChevronRight size={14} class="ml-auto" />
                </button>
            </div>

            <div class="nav-footer">
                <button class="logout-btn">
                    <LogOut size={18} />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>

        <!-- Dynamic Content Engine -->
        <main class="settings-content">
            <!-- Profile Section -->
            <section class="settings-section card-premium">
                <div class="section-header">
                    <div class="icon-orb">
                        <User size={20} />
                    </div>
                    <div class="header-text">
                        <h3>Identity Credentials</h3>
                        <p>Core account synchronization data</p>
                    </div>
                </div>

                <div class="section-body">
                    <div class="input-grid">
                        <div class="field-entry">
                            <label>Official Display Name</label>
                            <input type="text" bind:value={userName} placeholder="Full legal name..." />
                        </div>
                        <div class="field-entry">
                            <label>Designated Role</label>
                            <div class="role-badge shadow-sm">
                                <Shield size={14} />
                                <span>{userRole}</span>
                            </div>
                            <p class="helper-text">Roles are assigned by System Administrator</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Digital Signature Engine -->
            <section class="settings-section card-premium highlight">
                <div class="section-header">
                    <div class="icon-orb primary">
                        <Signature size={20} />
                    </div>
                    <div class="header-text">
                        <h3>Biometric Transit</h3>
                        <p>Signature embedding for official documents</p>
                    </div>
                    {#if signatureUploaded}
                        <div class="status-chip success">
                            <Zap size={12} />
                            Verified
                        </div>
                    {/if}
                </div>

                <div class="section-body">
                    <div class="upload-facade" class:active={signatureUploaded}>
                        {#if !signatureUploaded}
                            <div class="empty-state">
                                <div class="upload-circle">
                                    <Upload size={32} />
                                </div>
                                <div class="text-center">
                                    <h4>Deploy Signature File</h4>
                                    <p>High-resolution PNG (Alpha) recommended</p>
                                </div>
                                <button class="btn-secondary" on:click={() => signatureUploaded = true}>Select Asset</button>
                            </div>
                        {:else}
                            <div class="asset-display">
                                <div class="preview-box">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Signature_of_Barack_Obama.svg" alt="Auth Signature" />
                                </div>
                                <div class="asset-info">
                                    <h5>Primary_Signature_V1.png</h5>
                                    <p>Size: 42 KB • Format: PNG (Transparent)</p>
                                    <div class="asset-actions">
                                        <button class="text-btn danger" on:click={() => signatureUploaded = false}>
                                            <Trash2 size={16} />
                                            Re-Deploy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            </section>

            <!-- Authentication Layer -->
            <section class="settings-section card-premium">
                <div class="section-header">
                    <div class="icon-orb danger">
                        <Key size={20} />
                    </div>
                    <div class="header-text">
                        <h3>Security Vault</h3>
                        <p>Access control and key rotation</p>
                    </div>
                </div>

                <div class="section-body">
                    <div class="auth-box shadow-sm">
                        <div class="auth-info">
                            <h4>Renew Session Key</h4>
                            <p>A one-time synchronization link will be dispatched to your system registry email.</p>
                        </div>
                        <button class="btn-secondary">Request Rotation</button>
                    </div>
                </div>
            </section>
        </main>
    </div>
</div>

<style>
    .settings-container {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .settings-header {
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

    .view-subtitle {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-tertiary);
        margin-top: 0.5rem;
    }

    .settings-grid {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 3rem;
        align-items: start;
    }

    /* Sidebar Navigation Styles */
    .settings-sidebar {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        position: sticky;
        top: 2rem;
    }

    .group-label {
        font-size: 0.7rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-tertiary);
        margin-bottom: 1rem;
        padding-left: 1rem;
    }

    .nav-group { display: flex; flex-direction: column; gap: 0.25rem; }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.875rem 1rem;
        background: transparent;
        border: none;
        border-radius: 12px;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
    }

    .nav-item:hover { background: #f1f5f9; color: var(--text-primary); }
    .nav-item.active { background: white; color: var(--brand-primary); box-shadow: var(--shadow-sm); border: 1px solid var(--border-subtle); }

    .nav-footer { margin-top: 1rem; padding-top: 2rem; border-top: 1px solid var(--border-light); }

    .logout-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.875rem 1rem;
        background: #fef2f2;
        border: 1px solid #fee2e2;
        border-radius: 12px;
        color: #ef4444;
        font-size: 0.875rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
    }
    .logout-btn:hover { background: #fee2e2; border-color: #fecaca; }

    /* Content Engine Styles */
    .settings-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .settings-section {
        padding: 2.5rem;
        overflow: hidden;
    }

    .settings-section.highlight {
        background: linear-gradient(135deg, white 0%, #f0f7ff 100%);
        border-color: #dbeafe;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }

    .icon-orb {
        width: 48px;
        height: 48px;
        background: #f1f5f9;
        color: #64748b;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-orb.primary { background: #eff6ff; color: var(--brand-primary); }
    .icon-orb.danger { background: #fef2f2; color: #ef4444; }

    .header-text h3 { font-size: 1.125rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.01em; }
    .header-text p { font-size: 0.875rem; font-weight: 600; color: var(--text-tertiary); }

    .status-chip {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.875rem;
        border-radius: 20px;
        font-size: 0.65rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .status-chip.success { background: #dcfce7; color: #166534; }

    .section-body { position: relative; }

    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .field-entry { display: flex; flex-direction: column; gap: 0.625rem; }
    .field-entry label { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-tertiary); letter-spacing: 0.05em; }

    .role-badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: #f8fafc;
        padding: 0.875rem 1.25rem;
        border-radius: 12px;
        border: 1px solid var(--border-subtle);
        font-size: 0.875rem;
        font-weight: 800;
        color: var(--text-primary);
        width: fit-content;
    }

    .helper-text { font-size: 0.65rem; font-weight: 700; color: var(--text-tertiary); font-style: italic; }

    /* Upload Facade Styles */
    .upload-facade {
        background: white;
        border: 2px dashed var(--border-subtle);
        border-radius: 20px;
        padding: 3rem;
        transition: all 0.3s;
    }

    .upload-facade.active { border-style: solid; padding: 2rem; }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .upload-circle {
        width: 64px;
        height: 64px;
        background: var(--bg-main);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-tertiary);
    }

    .empty-state h4 { font-size: 1rem; font-weight: 800; color: var(--text-primary); }
    .empty-state p { font-size: 0.8125rem; font-weight: 600; color: var(--text-tertiary); }

    .asset-display { display: flex; align-items: center; gap: 2.5rem; }
    .preview-box {
        padding: 1.5rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .preview-box img { height: 4rem; opacity: 0.8; }

    .asset-info h5 { font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; }
    .asset-info p { font-size: 0.75rem; font-weight: 600; color: var(--text-tertiary); margin-bottom: 1rem; }

    .text-btn {
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        font-weight: 900;
        text-transform: uppercase;
        cursor: pointer;
        padding: 0;
    }
    .text-btn.danger { color: #ef4444; }

    .auth-box {
        background: #f8fafc;
        border: 1px solid var(--border-subtle);
        padding: 2rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .auth-info h4 { font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; }
    .auth-info p { font-size: 0.8125rem; font-weight: 600; color: var(--text-tertiary); max-width: 400px; }
</style>
