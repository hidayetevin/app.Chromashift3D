import Analytics from '../analytics/Analytics.js';

class ErrorHandler {
    constructor() {
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        window.addEventListener('error', (event) => {
            console.error('Global Error:', event.error);
            Analytics.track('error_occurred', {
                message: event.error ? event.error.message : 'Unknown Error',
                stack: event.error ? event.error.stack : 'No Stack',
                type: 'uncaught_exception'
            });
            this.showErrorToast('Something went wrong. Game saved.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise:', event.reason);
            Analytics.track('error_occurred', {
                message: event.reason ? event.reason.toString() : 'Unknown Reason',
                type: 'unhandled_rejection'
            });
        });
    }

    showErrorToast(message) {
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 59, 48, 0.9)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: '10000',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        });
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

export default new ErrorHandler();
