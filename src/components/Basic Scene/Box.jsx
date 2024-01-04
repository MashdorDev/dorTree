    import React, { useRef } from 'react';
    import { useFrame } from '@react-three/fiber';

    const Box = props => {
        // This reference will give us direct access to the mesh
        const mesh = useRef();

        // Rotate mesh every frame, this is outside of React without overhead
        return (
            <mesh
            >
                <boxGeometry attach="geometry" />
                <meshStandardMaterial attach="material" color={props.color} />
            </mesh>
        );
    };

    export default Box;