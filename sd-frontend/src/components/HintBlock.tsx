import React, { FC, useState, useEffect } from "react";

interface HintBlockProps {
    message: string;
}

const HintBlock: FC<HintBlockProps> = ({ message }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldDisplay, setShouldDisplay] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            setShouldDisplay(true);
            const timer = setTimeout(() => {
                setIsVisible(false); // Start fade-out
            }, 5000); // Keep visible for 5000 ms = 5 seconds

            const removeBlockTimer = setTimeout(() => {
                setShouldDisplay(false); // Remove from DOM after fade-out
            }, 7000); // Extra time for fade-out

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
