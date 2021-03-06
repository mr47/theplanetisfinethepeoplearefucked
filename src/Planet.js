import React from 'react';
import ReactDOM from 'react-dom'
import * as THREE from 'three';

import './OrbitControls'
/*
import './EffectComposer'
import './ShaderPass'
import './CopyShader'
import './FilmShader'
import './FilmPass'
*/
import React3 from 'react-three-renderer'


class Planet extends React.Component {
    constructor(props, context) {
        super(props, context);

        // construct the position vector here, because if we use 'new' within render,
        // React will think that things have changed when they have not.

        this.state = {
            cubeRotation: new THREE.Euler(1.0, 0),
            light: {
                direction: new THREE.Vector3(0, 0, 0),
                position: new THREE.Vector3(0, 0, 450)
            },
            position: {
                camera: new THREE.Vector3(0, 0, 980),
                globe: new THREE.Vector3(0, 0, 0),
                glow: new THREE.Vector3(-4, 80, -318),
                backGlow: new THREE.Vector3(0, 15, -1400 )
            },
            glowOffset: new THREE.Vector2(0, 0.074),
            rtParameters: {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBuffer: true
            }
        };
        this._onAnimate = () => {
            // we will get this callback every frame

            // pretend cubeRotation is immutable.
            // this helps with updates and pure rendering.
            // React will be sure that the rotation has now updated.

            this.setState({
                cubeRotation: new THREE.Euler(
                    this.state.cubeRotation.x,
                    this.state.cubeRotation.y + 0.0025,
                    0
                ),
            });
//            this.composer.render(0.1);
        };
        this._onRendererUpdated = (renderer)=>{
  //          this.composer = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, this.state.rtParameters ) );
        };

    }
    componentDidMount(){
        let { orbit, composer, effectFilm, state, refs: { camera, glow, light, backGlow, rendererNode } } = this;

        orbit = new THREE.OrbitControls( camera, ReactDOM.findDOMNode(rendererNode) );
        // effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );

        orbit.enableZoom = false;
        camera.add(glow, backGlow);

        glow.position.copy(state.position.glow);
        backGlow.position.copy(state.position.backGlow);

        //composer.addPass(effectFilm);
        //composer.render(0.1);
         camera.add(light);
         light.position.copy(state.position.camera);
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
            onRendererUpdated={this._onRendererUpdated}
            ref="rendererNode"
        >
            <scene ref="screne">
                <perspectiveCamera
                    ref="camera"
                    name="camera"
                    aspect={width / height}
                    near={1}
                    fov={45}
                    far={1500}
                    position={this.state.position.camera}
                />
                <ambientLight ref="light" color={0x333333} intensity={1} />
                <directionalLight castShadow={true} lookAt={this.state.light.direction} ref="light" intensity={0.5} position={this.state.light.position}/>
                <mesh
                    position={this.state.position.backGlow}
                    ref="backGlow"
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
                        bumpScale={3}
                        shininess={16}
                    >
                        <texture url={'earth.jpg'} magFilter={THREE.NearestFilter} minFilter={THREE.NearestFilter} slot={'map'}/>
                        <texture url={'earth-bump.jpg'} magFilter={THREE.LinearFilter} minFilter={THREE.LinearFilter} slot={'bumpMap'}/>
                    </meshPhongMaterial>
                </mesh>
                <mesh
                    ref="glow"
                >
                    <planeGeometry
                        width={300}
                        height={300}
                    />
                    <meshBasicMaterial transparent={true}>
                        <texture offset={this.state.glowOffset} anisotropy={8} magFilter={THREE.NearestFilter} minFilter={THREE.NearestFilter} url={'globe-topglow2.png'} />
                    </meshBasicMaterial>
                </mesh>
            </scene>
        </React3>);
    }
}

export default Planet;
