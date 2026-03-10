<script lang="ts">
    import '../app.css';
    import { 
        LayoutDashboard, FileText, Settings, History, 
        LogOut, Search, Bell, HelpCircle, ChevronRight, UserCircle 
    } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    const navItems = [
        { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reports', path: '/reports', label: 'Reports', icon: FileText },
        { id: 'memos', path: '/memos', label: 'Memos', icon: History },
        { id: 'logs', path: '/logs', label: 'Logs', icon: History, adminOnly: true },
        { id: 'settings', path: '/settings', label: 'Settings', icon: Settings, adminOnly: true },
    ];

    $: activeTab = navItems.find(item => $page.url.pathname === item.path)?.id || 'dashboard';
    let userRole = 'Admin Staff';
    let searchQuery = "";

    const handleSearch = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery) {
            goto(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };
</script>

<div class="app-container">
    <!-- Sidebar - Inspired by Image 3 -->
    <aside class="sidebar">
        <div class="p-6 flex items-center gap-3 mb-4">
            <div class="logo-box">
                <FileText class="text-white w-5 h-5" />
            </div>
            <div>
                <h1 class="text-sm font-bold text-main leading-none mb-1">IESCO M&T</h1>
                <p class="text-xs text-muted font-bold uppercase tracking-widest">Erp Console</p>
            </div>
        </div>

        <nav class="flex-1 px-3 space-y-2">
            <p class="px-4 py-2 text-xs font-black text-subtle uppercase tracking-widest">Main Menu</p>
            {#each navItems as item}
                <a 
                    href={item.path}
                    class="sidebar-link {activeTab === item.id ? 'active' : ''}"
                >
                    <svelte:component this={item.icon} size={18} />
                    <span>{item.label}</span>
                </a>
            {/each}
        </nav>

        <div class="p-4 border-t border-light flex items-center gap-3 bg-white">
            <div class="user-avatar">
                MT
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-xs font-black text-main truncate">Moueen Togarvi</p>
                <p class="text-[10px] text-muted font-bold truncate uppercase">{userRole}</p>
            </div>
            <button class="text-muted hover:text-error transition-colors bg-transparent border-none cursor-pointer">
                <LogOut size={16} />
            </button>
        </div>
    </aside>

    <!-- Content Area -->
    <div class="content-area">
        <!-- Top Bar - Inspired by Image 3 -->
        <header class="top-bar">
            <div class="search-container">
                <Search size={16} class="search-icon" />
                <input 
                    type="text" 
                    placeholder="Quick search records, reports or officers..." 
                    class="search-input"
                    bind:value={searchQuery}
                    on:keydown={handleSearch}
                />
            </div>

            <div class="top-bar-actions">
                <button class="icon-btn">
                    <Bell size={18} />
                    <span class="notification-dot"></span>
                </button>
                <div class="divider"></div>
                <div class="status-chip">
                    <span class="dot"></span>
                    March 2026
                </div>
                <HelpCircle size={18} class="text-subtle cursor-pointer hover:text-main transition-colors" />
            </div>
        </header>

        <!-- Dynamic Page Content -->
        <main class="main-content">
            <div class="content-wrapper">
                <slot />
            </div>
        </main>
    </div>
</div>

<style>
    .bg-app { background-color: var(--bg-app); }
    .bg-white { background-color: var(--bg-white); }
    .text-white { color: white; }
    .text-main { color: var(--text-main); }
    .text-muted { color: var(--text-muted); }
    .text-subtle { color: var(--text-subtle); }
    .text-error { color: var(--error-text); }
    
    .border-r { border-right: 1px solid var(--border-base); }
    .border-t { border-top: 1px solid var(--border-base); }
    .border-light { border-color: var(--border-light); }
    
    .w-64 { width: 16rem; }
    .z-30 { z-index: 30; }
    .z-20 { z-index: 20; }
    
    .logo-box {
        width: 2rem;
        height: 2rem;
        background-color: var(--primary);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .user-avatar {
        width: 2.25rem;
        height: 2.25rem;
        background-color: var(--primary-light);
        color: var(--primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.75rem;
        border: 1px solid #dbeafe;
    }
    
    .top-bar {
        height: 4rem;
        background-color: white;
        border-bottom: 1px solid var(--border-base);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem;
        z-index: 20;
    }
    
    .search-container {
        position: relative;
        width: 24rem;
        max-width: 100%;
    }
    
    .search-icon {
        position: absolute;
        left: 0.875rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-subtle);
        pointer-events: none;
    }
    
    .search-input {
        width: 100%;
        background-color: var(--bg-app);
        border: none;
        border-radius: 0.75rem;
        padding: 0.625rem 1rem 0.625rem 2.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s;
    }
    
    .search-input:focus {
        background-color: white;
        box-shadow: 0 0 0 4px var(--primary-light);
    }
    
    .top-bar-actions {
        display: flex;
        align-items: center;
        gap: 1.25rem;
    }
    
    .icon-btn {
        padding: 0.5rem;
        color: var(--text-muted);
        background: transparent;
        border: none;
        border-radius: 0.5rem;
        position: relative;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .icon-btn:hover {
        background-color: var(--bg-app);
        color: var(--text-main);
    }
    
    .notification-dot {
        position: absolute;
        top: 0.5rem;
        right: 0.625rem;
        width: 0.5rem;
        height: 0.5rem;
        background-color: #ef4444;
        border: 2px solid white;
        border-radius: 50%;
    }
    
    .divider {
        height: 2rem;
        width: 1px;
        background-color: var(--border-base);
    }
    
    .status-chip {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #4b5563;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background-color: #f3f4f6;
        padding: 0.375rem 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-base);
    }
    
    .status-chip .dot {
        width: 0.375rem;
        height: 0.375rem;
        background-color: var(--primary);
        border-radius: 50%;
    }
    
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
</style>
