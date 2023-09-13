import { useState } from 'react';
import {  Box } from '@mui/material';

const POINTER_SIZE = 16;

export default function MaskProvider({ children }: { children: React.ReactNode }) {
    const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setPointerPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div onMouseMove={handleMouseMove}>
            {children}
            <Box
                className="mask"
                sx={{
                    position: 'absolute',
                    width: `${POINTER_SIZE}px`,
                    height: `${POINTER_SIZE}px`,
                    backgroundColor: 'black',
                    borderRadius: '50%',
                    opacity: 0.4,
                    pointerEvents: 'none',
                    left: `${pointerPosition.x - 0.5 * POINTER_SIZE}px`,
                    top: `${pointerPosition.y - 0.5 * POINTER_SIZE}px`,
                }}
            ></Box>
            <Box
                className="mask"
                sx={{
                    position: 'absolute',
                    width: `${2 * POINTER_SIZE}px`,
                    height: `${2 * POINTER_SIZE}px`,
                    backgroundColor: 'black',
                    borderRadius: '50%',
                    opacity: 0.3,
                    pointerEvents: 'none',
                    left: `${pointerPosition.x - POINTER_SIZE}px`,
                    top: `${pointerPosition.y - POINTER_SIZE}px`,
                }}
            ></Box>

            <Box
                className="mask"
                sx={{
                    position: 'absolute',
                    width: `${4 * POINTER_SIZE}px`,
                    height: `${4 * POINTER_SIZE}px`,
                    backgroundColor: 'black',
                    borderRadius: '50%',
                    opacity: 0.2,
                    pointerEvents: 'none',
                    left: `${pointerPosition.x - 2 * POINTER_SIZE}px`,
                    top: `${pointerPosition.y - 2 * POINTER_SIZE}px`,
                }}
            ></Box>
        </div>
    );
};
