import { XMarkIcon } from '@heroicons/react/24/solid';
import { Niivue } from "@niivue/niivue";
import { useEffect, useRef, useState } from 'react';


/**
 * Props for the NiiVueContainer component.
 * 
 * @property {Object} defaults - Default settings for the NiiVue instance.
 * @property {any} [notifier] - Optional notifier for displaying messages.
 * @property {string} [payload] - Optional URL of the payload to load.
 * @property {number} xCordinate - X coordinate for the crosshair.
 * @property {number} yCordinate - Y coordinate for the crosshair.
 * @property {number} zCordinate - Z coordinate for the crosshair.
 * @property {number} tValue - T (time) value for the crosshair.
 * @property {'contrast' | 'measurement' | 'none' | 'pan' | 'slicer3D' | 'callbackOnly'} dragState - The current drag state of the canvas.
 * @property {(x: number) => void} setX - Function to set the X coordinate.
 * @property {(y: number) => void} setY - Function to set the Y coordinate.
 * @property {(z: number) => void} setZ - Function to set the Z coordinate.
 * @property {(i: number) => void} setI - Function to set the intensity value.
 * @property {(t: number) => void} setT - Function to set the T (time) value.
 * @property {(f: () => void) => void} setGetMetadataFunction - Function to set the metadata retrieval function.
 * @property {(b: boolean) => void} setImageLoaded - Function to set the image loaded state.
 * @property {(s: string) => void} setImageName - Function to set the image name.
 * @property {(s: string) => void} setImagePath - Function to set the image path.
 * @property {(f: () => void) => void} setResetSceneFunction - Function to set the reset scene function.
 */
export interface NiiVueContainerProps {
    defaults: { [key: string]: any };
    notifier?: any;
    payload?: string;
    xCordinate: number;
    yCordinate: number;
    zCordinate: number;
    tValue: number;
    dragState: 'contrast' | 'measurement' | 'none' | 'pan' | 'slicer3D' | 'callbackOnly';
    setX: (x: number) => void;
    setY: (y: number) => void;
    setZ: (z: number) => void;
    setI: (i: number) => void;
    setT: (t: number) => void;
    setGetMetadataFunction: (f: () => void) => void;
    setImageLoaded: (b: boolean) => void;
    setImageName: (s: string) => void;
    setImagePath: (s: string) => void;
    setResetSceneFunction: (f: () => void) => void;
}

/**
 * NiiVueContainer component for rendering a NiiVue instance within a canvas.
 * 
 * @param {NiiVueContainerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered NiiVueContainer component.
 */
function NiiVueContainer(props: NiiVueContainerProps) {
    const niiVueDefaults = props.defaults;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const niivueInstanceRef = useRef<Niivue | null>(null);

    const [startedLoading, setStartedLoading] = useState(false);

    /**
     * Focuses the canvas element
     * 
     * This function focuses the canvas element by calling the `focus` method on the canvas reference.
     * This is useful for enabling keyboard shortcuts to interact with the canvas.
     */
        const focusCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.focus();
            }
        };

    /**
     * Asynchronously loads volumes into the Niivue instance.
     *
     * @param {Niivue} nv - The Niivue instance to load volumes into.
     * @param {string} payloadURL - The URL of the volume payload to load.
     * @returns {Promise<void>} A promise that resolves when the volumes are loaded.
     */
    async function loadVolumes(nv: Niivue, payloadURL: string) {
        const payloadName = payloadURL.split('/').pop();
        if (startedLoading) return;
        console.log('Loading payload: ', payloadURL);
        setStartedLoading(true);
        props.setImagePath(payloadURL);
        if (payloadName) {
            props.setImageName(payloadName);
        }
        await nv.loadVolumes([
            {
                url: payloadURL,
                name: payloadName,
            },
        ]);
        props.setImageLoaded(true);
        focusCanvas();
    }

    /**
     * Moves the crosshair to the specified voxel coordinates (x, y, z).
     *
     * This function first moves the crosshair to an out-of-bounds position
     * to ensure that the subsequent move to the desired coordinates is registered.
     *
     * @param {number} x - The x-coordinate in voxel space.
     * @param {number} y - The y-coordinate in voxel space.
     * @param {number} z - The z-coordinate in voxel space.
     */
    function moveCrosshair(x: number, y: number, z: number) {
        if (!niivueInstanceRef.current) return;
        niivueInstanceRef.current.moveCrosshairInVox(-999999, -999999, -999999)
        niivueInstanceRef.current.moveCrosshairInVox(x, y, z);
    }

    /**
     * Displays a toast notification with metadata information.
     * 
     * This function retrieves descriptive metadata from the current `niivueInstanceRef` 
     * and displays it in a toast notification using the `props.notifier.custom` method.
     * The toast includes a title, a close button, and a table listing the metadata keys and values.
     * 
     * @returns {void} This function does not return a value.
     */
    function toastMetadata() {
        if (!niivueInstanceRef.current) return;
        let obj: { [key: string]: any } = niivueInstanceRef.current.getDescriptives({});

        console.log("Metadata: ", obj);

        props.notifier.custom((t: any) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="ml-3 flex-1">
                            {/* Titile with a close button, in a row */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-900">
                                    Metadata
                                </p>
                                <button
                                    onClick={() => props.notifier.dismiss(t.id)}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                            <table className="w-full my-2 font-mono text-sm text-left" style={{ tableLayout: 'fixed' }}>
                                <tbody>
                                    {Object.keys(obj).map((key) => (
                                        <tr key={key}>
                                            <th>{key}</th>
                                            <td>{obj[key]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        ), {
            duration: 10000,
        }
        )
    }

    // Set the getMetadata function
    useEffect(() => {
        props.setGetMetadataFunction(() => toastMetadata);
    }, []);

    // Move the crosshair when the coordinates change
    useEffect(() => {
        moveCrosshair(props.xCordinate, props.yCordinate, props.zCordinate);
    }, [props.xCordinate, props.yCordinate, props.zCordinate]);

    // Switch Drag State when the drag state changes
    useEffect(() => {
        if (!niivueInstanceRef.current) return;
        niivueInstanceRef.current.opts.dragMode = niivueInstanceRef.current.dragModes[props.dragState];
    }, [props.dragState]);

    function resetScene() {
        if (!niivueInstanceRef.current) return;
        console.log('Resetting Scene with: ', niiVueDefaults);
        props.notifier('Resetting Scene', {
            icon: 'ℹ️',
        });
        // Reset the scene, including the crosshair position, brightness, and contrast
        niivueInstanceRef.current.setDefaults(niiVueDefaults, true);
        focusCanvas();
    }

    // Initialize the Niivue instance
    useEffect(() => {
        if (canvasRef.current) {
            /**
             * Handles the location change event by extracting voxel data and intensity value from the provided data object.
             *
             * @param {any} data - The data object containing voxel and string information.
             * @property {Array<number>} data.vox - An array containing voxel coordinates [x, y, z].
             * @property {string} data.string - A string containing intensity information in the format "-2×80×51×0 = 572".
             *
             * The function performs the following actions:
             * - Extracts the voxel coordinates from `data.vox` and updates the corresponding props (`setX`, `setY`, `setZ`).
             * - Parses the intensity value from `data.string` and updates the `setI` prop.
             */
            function handleLocationChange(data: any) {
                const voxData = data.vox;
                const strData = data.string;  // "-2×80×51×0 = 572   "

                let strDataSplit = strData.split("×");
                strDataSplit = strDataSplit.map((item: any) => item.trim());

                props.setX(voxData[0]);
                props.setY(voxData[1]);
                props.setZ(voxData[2]);

                let timeIntensityValue = strDataSplit[3];  // 0 = 572
                timeIntensityValue = timeIntensityValue.split("=");
                let intensityValue = timeIntensityValue[1].trim();
                intensityValue = parseInt(intensityValue);
                props.setI(intensityValue);
                let timeValue = timeIntensityValue[0].trim();
                timeValue = parseInt(timeValue);
                props.setT(timeValue);
            }

            niiVueDefaults['onLocationChange'] = handleLocationChange;
            console.log('Initializing Niivue with : ', niiVueDefaults);
            const niivue = new Niivue(niiVueDefaults);
            niivue.attachToCanvas(canvasRef.current);
            niivue.opts.dragMode = niivue.dragModes.pan;
            niivue.opts.multiplanarForceRender = true;
            niivue.opts.yoke3Dto2DZoom = true;
            niivue.opts.crosshairGap = 10;
            niivue.setInterpolation(true);

            niivueInstanceRef.current = niivue;

            // Set the reset scene function
            props.setResetSceneFunction(() => resetScene);

            // If a payload is provided, load the volumes from the payload URL
            if (props.payload) {
                const payloadURL = props.payload;
                props.notifier.promise(
                    loadVolumes(niivue, payloadURL),
                    {
                        loading: 'Loading Payload...',
                        success: <b>Loaded Payload</b>,
                        error: <b>Error Loading Payload</b>,
                    }
                );
            }
        }

        return () => {
            niivueInstanceRef.current = null;
        };
    }, []);

    return (
        <canvas ref={canvasRef} id="niivue" className="flex-grow p-0" style={{ cursor: 'crosshair', outline: 'none' }} tabIndex={0}></canvas>
    );
}

export default NiiVueContainer;
