import React, { FC, useState, useEffect } from "react";

interface HintBlockProps {
    message: string;
    onDismiss?: () => void
}

const HintBlock: FC<HintBlockProps> = ({ message, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldDisplay, setShouldDisplay] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            setShouldDisplay(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);

            const removeBlockTimer = setTimeout(() => {
                setShouldDisplay(false);
                if (onDismiss) {
                    onDismiss();
                }
            }, 4000);

            return () => {
                clearTimeout(timer);
                clearTimeout(removeBlockTimer);
            };
        }
    }, [message]);

    if (!shouldDisplay) return null;

    return (
        <div className={`fixed top-5 right-5 w-auto min-w-80 text-center bg-blue-500 whitespace-pre text-white p-2 text-sm rounded-lg shadow-lg transition-opacity duration-500 ${!isVisible ? 'opacity-0' : 'opacity-100'}`}>
            {message}
        </div>
    );
};

export default HintBlock;
