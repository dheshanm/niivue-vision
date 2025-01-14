import { InfoCircleFilled, ReloadOutlined } from '@ant-design/icons';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Button, Select, Tooltip } from "antd";
import { Typography } from 'antd';
const { Paragraph, Text } = Typography;

import { Dispatch, SetStateAction } from 'react';

export interface HeaderProps {
    activeDragState: "contrast" | "measurement" | "none" | "pan" | "slicer3D";
    notifier: any;
    setActiveDragState: Dispatch<SetStateAction<"contrast" | "measurement" | "none" | "pan" | "slicer3D">>;
    resetSceneFunction: () => void;
}

const Header = (props: HeaderProps) => {
    function toastInfo() {
        props.notifier.custom((t: any) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-900">
                                    About
                                </p>
                                <button
                                    onClick={() => props.notifier.dismiss(t.id)}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="w-full my-2 font-mono text-sm text-left" style={{ tableLayout: 'fixed' }}>
                                <Paragraph>
                                    Hotkeys
                                    <ul>
                                        <li>
                                        Press <Text keyboard>v</Text> to cycle through the available views.
                                        </li>
                                        <li>
                                        Press <Text keyboard>c</Text> to cycle through the different clip views.
                                        </li>
                                        <li>
                                        Press <Text keyboard> Left Arrow </Text> or <Text keyboard>Right Arrow</Text> to move between different volumes.
                                        </li>
                                    </ul>
                                </Paragraph>
                                <Paragraph>
                                    Mouse Controls
                                    <ul>
                                        <li>
                                        Hold <Text keyboard>left mouse button</Text> and drag to move crosshairs.
                                        </li>
                                        <li>
                                        Hold <Text keyboard>right mouse button</Text> to use actions described in the dropdown menu on Header.
                                        </li>
                                        <li>
                                        Use <Text keyboard>scroll wheel</Text> to move between slices (or zoom in/out, if in Zoom / Pan mode).
                                        </li>
                                    </ul>
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ), {
            duration: 10000,
        }
        )
    }

    return (
        <header className="p-0 my-2 mx-4">
            <table className="text-white w-full font-mono text-sm" style={{ tableLayout: 'fixed' }}>
                <tbody>
                    <tr style={{ width: '100%' }}>
                        <th colSpan={2} className='mx-10' style={{
                            textAlign: 'left',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            <span>NiiVue - Vision</span>
                            <Tooltip title="Reset Scene">
                                <Button onClick={props.resetSceneFunction} type="text" className='ml-4' icon={<ReloadOutlined style={{ color: '#CECECE' }} />} />
                            </Tooltip>
                            <Tooltip title="About">
                                <Button onClick={toastInfo} type="text" className='ml-4' icon={<InfoCircleFilled style={{ color: '#CECECE' }} />} />
                            </Tooltip>
                        </th>
                        <th>
                            <Select
                                value={props.activeDragState}
                                onChange={(value: string) => props.setActiveDragState(value as "contrast" | "measurement" | "none" | "pan" | "slicer3D")}
                                style={{
                                    width: '100%',
                                }}
                                options={[
                                    { value: 'none', label: 'None' },
                                    { value: 'contrast', label: 'Contrast' },
                                    { value: 'measurement', label: 'Measurement' },
                                    { value: 'pan', label: 'Pan / Zoom' },
                                    { value: 'slicer3d', label: 'Slicer3d' },
                                ]}
                            />
                        </th>
                    </tr>
                </tbody>
            </table>
        </header>
    )
}

export default Header;