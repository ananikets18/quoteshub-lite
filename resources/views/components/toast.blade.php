<!-- Toast Notification Container -->
<div 
    x-data="toastNotification()"
    x-init="init()"
    class="fixed top-4 right-4 z-50 space-y-2"
    style="pointer-events: none;"
>
    <template x-for="toast in toasts" :key="toast.id">
        <div 
            x-show="toast.visible"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform translate-x-full"
            x-transition:enter-end="opacity-100 transform translate-x-0"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100 transform translate-x-0"
            x-transition:leave-end="opacity-0 transform translate-x-full"
            :class="getColor(toast.type)"
            class="flex items-center px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px]"
            style="pointer-events: auto;"
        >
            <span x-text="getIcon(toast.type)" class="text-xl mr-3"></span>
            <span x-text="toast.message" class="flex-1"></span>
            <button 
                @click="remove(toast.id)" 
                class="ml-3 text-white hover:text-gray-200 transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </template>
</div>
