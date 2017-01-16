import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

class Planet extends React.Component {
    constructor(props, context) {
        super(props, context);

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.
        this.cameraPosition = new THREE.Vector3(0, 0, 980);

        this.state = {
            cubeRotation: new THREE.Euler(1.0, 0),
            light: {
                direction: new THREE.Vector3(0, 0, 0),
                position: new THREE.Vector3(0, 0, 450)
            },
            position: {
                globe: new THREE.Vector3(0, 0, 0),
                glow: new THREE.Vector3(0, 53, 512),
                backGlow: new THREE.Vector3(0, 15, -590)
            },
            glowOffset: new THREE.Vector2(0, 0.08)

        };
        this._onAnimate = () => {
            // we will get this callback every frame

            // pretend cubeRotation is immutable.
            // this helps with updates and pure rendering.
            // React will be sure that the rotation has now updated.
            this.setState({
                cubeRotation: new THREE.Euler(
                    this.state.cubeRotation.x - 0.0015,
                    this.state.cubeRotation.y + 0.0025,
                    0
                ),
            });
        };
    }

    render() {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height

        return (<React3
            mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
            width={width}
            height={height}
            gammaInput={true}
            gammaOutput={true}
            alpha={true}
            pixelRatio={window.devicePixelRatio}
            onAnimate={this._onAnimate}
        >
            <scene>
                <perspectiveCamera
                    name="camera"
                    aspect={width / height}
                    near={1}
                    fov={45}
                    far={1500}
                    position={this.cameraPosition}
                />
                <ambientLight color={0x333333} intensity={1} />
                <directionalLight lookAt={this.state.light.direction} name="light" intensity={0.5} position={this.state.light.position}/>
                <mesh
                    position={this.state.position.backGlow}
                >
                    <planeGeometry
                        width={1450}
                        height={1450}
                    />
                    <meshBasicMaterial transparent={true}>
                        <texture anisotropy={8} url={'globe-backglow.png'} magFilter={THREE.NearestFilter} minFilter={THREE.LinearMipMapNearestFilter}/>
                    </meshBasicMaterial>
                </mesh>
                <mesh
                    rotation={this.state.cubeRotation}
                    position={this.state.position.globe}
                >
                    <sphereGeometry
                        radius={296}
                        widthSegments={40}
                        heightSegments={30}
                    />

                    <meshPhongMaterial
                        bumpScale={2}
                        shininess={16}
                    >
                        <texture url={'earth.jpg'} magFilter={THREE.LinearFilter} minFilter={THREE.LinearFilter} slot={'map'}/>
                        <texture url={'earth-bump.jpg'} magFilter={THREE.LinearFilter} minFilter={THREE.LinearFilter} slot={'bumpMap'}/>
                    </meshPhongMaterial>
                </mesh>
                <mesh
                    position={this.state.position.glow}
                >
                    <planeGeometry
                        width={300}
                        height={300}
                    />
                    <meshBasicMaterial transparent={true}>
                        <texture offset={this.state.glowOffset} anisotropy={8} url={'globe-topglow.png'} magFilter={THREE.NearestFilter} minFilter={THREE.LinearMipMapNearestFilter}/>
                    </meshBasicMaterial>
                </mesh>
            </scene>
        </React3>);
    }
}

export default Planet;
