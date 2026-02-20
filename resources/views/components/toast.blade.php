{{-- Toast Notification Container --}}
<div
    x-data="toastNotification()"
    x-init="init()"
    class="fixed z-[9999] flex flex-col gap-2"
    style="bottom: calc(var(--bottom-nav-h, 0px) + 20px); left: 50%; transform: translateX(-50%); min-width: 280px; max-width: 400px; pointer-events: none; width: max-content;"
>
    <template x-for="toast in toasts" :key="toast.id">
        <div
            x-show="toast.visible"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform scale-95 translateY(12px)"
            x-transition:enter-end="opacity-100 transform scale-100 translateY(0)"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0 scale-95"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
            style="
                pointer-events: auto;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.12);
                background: var(--bg-elevated, #1a1a27);
                font-size: 14px;
                font-weight: 500;
                color: #e2e8f0;
                white-space: nowrap;
            "
            :style="toast.type === 'success' ? 'border-color: rgba(16,185,129,0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.15);' :
                    toast.type === 'error'   ? 'border-color: rgba(239,68,68,0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,68,68,0.15);' :
                    'box-shadow: 0 8px 32px rgba(0,0,0,0.5);'"
        >
            <span x-text="getIcon(toast.type)" style="font-size:18px;flex-shrink:0;"></span>
            <span x-text="toast.message" style="flex:1;"></span>
            <button
                @click="remove(toast.id)"
                style="color:#64748b; padding:2px; border:none; background:none; cursor:pointer; flex-shrink:0; transition:color 0.15s ease;"
                onmouseover="this.style.color='#94a3b8'"
                onmouseout="this.style.color='#64748b'"
            >
                <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    </template>
</div>
