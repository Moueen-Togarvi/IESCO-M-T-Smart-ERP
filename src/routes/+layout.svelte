<script lang="ts">
    import '../app.css';
    import { 
        LayoutDashboard, FileText, Settings, History, 
        LogOut, Search, Bell, HelpCircle, User, Shield, Zap
    } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    const navItems = [
        { id: 'dashboard', path: '/', label: 'Overview', icon: LayoutDashboard },
        { id: 'reports', path: '/reports', label: 'Report Registry', icon: FileText },
        { id: 'memos', path: '/memos', label: 'Dispatch Memos', icon: History },
        { id: 'logs', path: '/logs', label: 'Audit Trail', icon: Shield, adminOnly: true },
        { id: 'settings', path: '/settings', label: 'System Settings', icon: Settings, adminOnly: true },
    ];

    $: activeTab = navItems.find(item => item.path === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(item.path))?.id || 'dashboard';
    
    let userRole = 'Super Administrator';
    let searchQuery = "";

    const handleSearch = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery) {
            goto(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };
</script>

<div class="app-layout">
    <!-- Premium Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="logo-container">
                <div class="logo-badge">
                    <Zap size={18} fill="white" />
                </div>
                <div class="logo-text">
                    <h1 class="brand-title">IESCO <span>M&T</span></h1>
                    <p class="brand-subtitle">Smart ERP Console</p>
                </div>
            </div>
        </div>

        <nav class="sidebar-nav">
            <div class="nav-group">
                <p class="nav-label">Main Console</p>
                {#each navItems as item}
                    <a 
                        href={item.path}
                        class="sidebar-link {activeTab === item.id ? 'active' : ''}"
                    >
                        <div class="icon-wrapper">
                            <svelte:component this={item.icon} size={18} />
                        </div>
                        <span>{item.label}</span>
                    </a>
                {/each}
            </div>
        </nav>

        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="avatar-ring">
                    <div class="avatar-content">MT</div>
                </div>
                <div class="user-info">
                    <p class="user-name">Moueen Togarvi</p>
                    <p class="user-role">{userRole}</p>
                </div>
                <button class="logout-btn" title="Logout">
                    <LogOut size={16} />
                </button>
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="content-container">
        <!-- Premium Top Bar -->
        <header class="top-bar">
            <div class="search-bar">
                <Search size={16} class="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search intelligence, reports, or logs..." 
                    bind:value={searchQuery}
                    on:keydown={handleSearch}
                />
            </div>

            <div class="top-actions">
                <button class="action-trigger">
                    <Bell size={18} />
                    <span class="ping-dot"></span>
                </button>
                <div class="v-divider"></div>
                <div class="system-status">
                    <div class="status-dot"></div>
                    <span>System Live</span>
                </div>
                <div class="v-divider"></div>
                <button class="help-btn">
                    <HelpCircle size={18} />
                </button>
            </div>
        </header>

        <!-- Page View -->
        <main class="page-viewport">
            <div class="page-container">
                <slot />
            </div>
        </main>
    </div>
</div>

<style>
    .app-layout {
        display: flex;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: var(--bg-main);
    }

    /* Sidebar Redesign */
    .sidebar {
        width: 280px;
        background: var(--bg-sidebar);
        color: var(--text-on-dark);
        display: flex;
        flex-direction: column;
        z-index: 50;
        box-shadow: 10px 0 30px rgba(15, 23, 42, 0.1);
        flex-shrink: 0;
    }

    .sidebar-header {
        padding: 2.5rem 1.5rem;
    }

    .logo-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .logo-badge {
        width: 40px;
        height: 40px;
        background: var(--brand-primary);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .brand-title {
        font-size: 1.125rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1;
        margin-bottom: 0.25rem;
        color: white;
    }

    .brand-title span {
        color: var(--brand-primary);
    }

    .brand-subtitle {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #94a3b8;
    }

    .sidebar-nav {
        flex: 1;
        padding: 0 1rem;
    }

    .nav-label {
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #64748b;
        padding-left: 1rem;
        margin-bottom: 1rem;
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        padding: 0.875rem 1rem;
        border-radius: 12px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 600;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: 0.25rem;
    }

    .sidebar-link:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
    }

    .sidebar-link.active {
        background: var(--brand-primary);
        color: white;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }

    .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
    }

    .sidebar-footer {
        padding: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .user-profile {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 16px;
    }

    .avatar-ring {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, var(--brand-primary), #60a5fa);
        border-radius: 50%;
        padding: 2px;
    }

    .avatar-content {
        width: 100%;
        height: 100%;
        background: var(--bg-sidebar);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 800;
        color: white;
    }

    .user-info {
        flex: 1;
        min-width: 0;
    }

    .user-name {
        font-size: 0.8125rem;
        font-weight: 700;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .user-role {
        font-size: 0.625rem;
        font-weight: 600;
        color: #94a3b8;
    }

    .logout-btn {
        background: transparent;
        border: none;
        color: #64748b;
        cursor: pointer;
        transition: color 0.2s;
    }

    .logout-btn:hover {
        color: var(--error);
    }

    /* Content Area Layout */
    .content-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .top-bar {
        height: 72px;
        background: white;
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2.5rem;
        z-index: 40;
    }

    .search-bar {
        position: relative;
        width: 400px;
    }

    .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-tertiary);
    }

    .search-bar input {
        background: var(--bg-main);
        border: none;
        padding-left: 2.75rem;
        font-size: 0.8125rem;
    }

    .top-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .action-trigger {
        position: relative;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 10px;
        transition: all 0.2s;
    }

    .action-trigger:hover {
        background: var(--bg-main);
        color: var(--brand-primary);
    }

    .ping-dot {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
        background: var(--error);
        border: 2px solid white;
        border-radius: 50%;
    }

    .v-divider {
        width: 1px;
        height: 24px;
        background: var(--border-subtle);
    }

    .system-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .page-viewport {
        flex: 1;
        overflow-y: auto;
        padding: 2.5rem;
    }

    .page-container {
        max-width: 1400px;
        margin: 0 auto;
    }
</style>
