import React from 'react';
import { CheckCircleIcon, InfoIcon, XCircleIcon } from './icons';

interface NotificationProps {
    notification: { message: string; type: 'success' | 'error' | 'info' } | null;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
    if (!notification) return null;

    const icons = {
        success: <CheckCircleIcon className="w-6 h-6 text-success" />,
        error: <XCircleIcon className="w-6 h-6 text-warning" />,
        info: <InfoIcon className="w-6 h-6 text-secondary" />,
    };

    const colors = {
        success: 'bg-success/10 border-success/30 text-success',
        error: 'bg-warning/10 border-warning/30 text-warning',
        info: 'bg-secondary/10 border-secondary/30 text-secondary',
    }
    
    // Add a key to the root element to force re-render on notification change, which restarts the animation
    return (
        <div key={Date.now()} className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in-out ${colors[notification.type]}`}>
            {icons[notification.type]}
            <p className="font-semibold text-text-main">{notification.message}</p>
            <button onClick={onClose} className="ml-4 text-text-muted hover:text-text-main text-lg">&times;</button>
        </div>
    );
};

export default Notification;
