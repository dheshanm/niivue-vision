import { InputNumber, Tooltip, Popover } from "antd";
import { Typography } from 'antd';

const { Paragraph } = Typography;

/**
 * Props for the Footer component.
 * 
 * @interface FooterProps
 * @property {string} name - The name associated of the current image.
 * @property {number} x - The x-coordinate value.
 * @property {number} y - The y-coordinate value.
 * @property {number} z - The z-coordinate value.
 * @property {number} i - An additional numeric value.
 * @property {(x: number) => void} setX - Function to set the x-coordinate value.
 * @property {(y: number) => void} setY - Function to set the y-coordinate value.
 * @property {(z: number) => void} setZ - Function to set the z-coordinate value.
 * @property {() => void} requestMetadata - Function to request metadata.
 */
export interface FooterProps {
    name: string;
    fullPath: string;
    x: number;
    y: number;
    z: number;
    i: number;
    setX: (x: number) => void;
    setY: (y: number) => void;
    setZ: (z: number) => void;
    requestMetadata: () => void;
}

/**
 * Footer component that displays metadata and input fields for coordinates.
 *
 * @param {FooterProps} props - The properties passed to the Footer component.
 * @param {string} props.name - The name to be displayed in the footer.
 * @param {string} props.fullPath - The full path of the image.
 * @param {number} props.x - The X coordinate value.
 * @param {number} props.y - The Y coordinate value.
 * @param {number} props.z - The Z coordinate value.
 * @param {number} props.i - The I coordinate value.
 * @param {Function} props.setX - Function to set the X coordinate value.
 * @param {Function} props.setY - Function to set the Y coordinate value.
 * @param {Function} props.setZ - Function to set the Z coordinate value.
 * @param {Function} props.requestMetadata - Function to request metadata when the name is clicked.
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = (props: FooterProps) => {
    const popoverContent = (
        <Paragraph copyable>{props.fullPath}</Paragraph>
    )
    return (
        <table className="text-white w-full my-2 font-mono text-sm" style={{ tableLayout: 'fixed' }}>
            <tbody>
                <tr style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Popover title={props.name} content={popoverContent}>
                        <th id="name" className="ms-4" onClick={props.requestMetadata} style={{
                            cursor: 'help',
                            textAlign: 'left',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            <span>&#8505;</span> {props.name}
                        </th>
                    </Popover>
                    <th className="me-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <InputNumber suffix="X" value={props.x} onChange={(value) => props.setX(value as number)} changeOnWheel className="w-21 mx-1 h-6" />
                        <InputNumber suffix="Y" value={props.y} onChange={(value) => props.setY(value as number)} changeOnWheel className="w-21 mx-1 h-6" />
                        <InputNumber suffix="Z" value={props.z} onChange={(value) => props.setZ(value as number)} changeOnWheel className="w-21 mx-1 h-6" />
                        <Tooltip title="Intensity">
                            <InputNumber suffix="I" value={props.i} controls={false} readOnly className="w-20 mx-1 h-6" />
                        </Tooltip>
                    </th>
                </tr>
            </tbody>
        </table>
    );
};

export default Footer;