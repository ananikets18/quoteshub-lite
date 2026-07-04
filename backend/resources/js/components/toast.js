// Toast notification component
export const toastNotification = () => ({
    toasts: [],
    
    init() {
        // Listen for toast events
        window.addEventListener('toast', (event) => {
            this.show(event.detail.message, event.detail.type);
        });
    },
    
    show(message, type = 'success') {
        const id = Date.now();
        const toast = {
            id,
            message,
            type,
            visible: true
        };
        
        this.toasts.push(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => this.remove(id), 3000);
    },
    
    remove(id) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    },
    
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    },
    
    getColor(type) {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        return colors[type] || colors.info;
    }
});
