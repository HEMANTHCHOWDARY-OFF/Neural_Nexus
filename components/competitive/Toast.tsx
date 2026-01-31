import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    visible: boolean;
    onClose: () => void;
}

const Toast = ({ message, visible, onClose }: ToastProps) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div className="cp-toast">
            <div className="cp-toast-icon">✨</div>
            <div className="cp-toast-content">{message}</div>
        </div>
    );
};

export default Toast;
