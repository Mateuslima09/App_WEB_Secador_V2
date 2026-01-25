import React, { useState, useEffect, useRef } from 'react';

const Draggable = ({ children, handleId, persistenceKey }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const ref = useRef(null);
    // Use a ref to access the latest position inside event listeners without re-attaching them
    const positionRef = useRef(position);

    useEffect(() => {
        positionRef.current = position;
    }, [position]);

    // Initial position logic
    useEffect(() => {
        if (ref.current) {
            let initialX = 0;
            let initialY = 0;
            let loaded = false;

            // Try to load from localStorage
            if (persistenceKey) {
                const saved = localStorage.getItem(persistenceKey);
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                            initialX = parsed.x;
                            initialY = parsed.y;
                            loaded = true;
                        }
                    } catch (e) {
                        console.error("Failed to parse saved position", e);
                    }
                }
            }

            if (!loaded) {
                // Default to bottom center
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                const width = ref.current.offsetWidth;
                const height = ref.current.offsetHeight;

                initialX = (screenWidth - width) / 2;
                initialY = screenHeight - height - 20 // 20px from bottom
            }

            setPosition({ x: initialX, y: initialY });
        }
    }, [persistenceKey]); // Removed ref dependency to avoid re-runs, usually ref is stable. Added persistenceKey

    const handleStart = (clientX, clientY) => {
        setIsDragging(true);
        setDragStart({
            x: clientX - positionRef.current.x,
            y: clientY - positionRef.current.y
        });
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return;

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        // Optional: Add bounds checking here if needed to keep it on screen

        // We update state for re-render, ref updates via useEffect
        setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
        setIsDragging(false);
        // Save position using the LATEST position from ref
        if (persistenceKey) {
            localStorage.setItem(persistenceKey, JSON.stringify(positionRef.current));
        }
    };

    // Mouse events
    const onMouseDown = (e) => {
        if (e.target.id === handleId || e.target.closest(`#${handleId}`)) {
            handleStart(e.clientX, e.clientY);
        }
    };

    const onMouseMove = (e) => {
        handleMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
        handleEnd();
    };

    // Touch events
    const onTouchStart = (e) => {
        if (e.target.id === handleId || e.target.closest(`#${handleId}`)) {
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
        }
    };

    const onTouchMove = (e) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
        handleEnd();
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onTouchEnd);
        } else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging]);

    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 1000,
                touchAction: 'none' // Prevent scrolling while dragging
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
        >
            {children}
        </div>
    );
};

export default Draggable;
