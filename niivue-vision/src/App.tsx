import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Header, { HeaderProps } from './Header';
import Footer, { FooterProps } from './Footer';
import NiiVueContainer, { NiiVueContainerProps } from './NiiVueContainer';
import { parseQueryParams } from './utils';

import './App.css';

// Default settings for the NiiVue instance
const niivueDefaults = {
  show3Dcrosshair: true,
  showLegend: true,
  showMeasureUnits: true,
  backColor: [0.2, 0.2, 0.2, 1],
  logLevel: "info"
};

const defaultDragState: "contrast" | "measurement" | "none" | "pan" | "slicer3D" = "measurement";

const queryParams = parseQueryParams();
console.log(queryParams);

function App() {
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");

  const [xCordinate, setX] = useState(1);
  const [yCordinate, setY] = useState(1);
  const [zCordinate, setZ] = useState(1);
  const [intensityValue, setIntensity] = useState(0);

  const [getMetadataFunction, setGetMetadataFunction] = useState<() => void>(() => () => { });
  const [resetSceneFunction, setResetSceneFunction] = useState<() => void>(() => { });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [crosshairMoved, setCrosshairMoved] = useState(false);

  const [dragState, setDragState] = useState<"contrast" | "measurement" | "none" | "pan" | "slicer3D">("none");

  let payload = queryParams['payload'];
  payload = payload.replace(/^['"]+|['"]+$/g, '');

  let niiVueContainerProps: NiiVueContainerProps = {
    defaults: niivueDefaults,
    payload: payload,
    notifier: toast,
    xCordinate: xCordinate,
    yCordinate: yCordinate,
    zCordinate: zCordinate,
    dragState: dragState,
    setX: setX,
    setY: setY,
    setZ: setZ,
    setI: setIntensity,
    setGetMetadataFunction: setGetMetadataFunction,
    setImageLoaded: setImageLoaded,
    setImageName: setImageName,
    setImagePath: setImagePath,
    setResetSceneFunction: setResetSceneFunction
  };

  let HeaderProps: HeaderProps = {
    activeDragState: dragState,
    notifier: toast,
    setActiveDragState: setDragState,
    resetSceneFunction: resetSceneFunction
  }

  let footerProps: FooterProps = {
    name: imageName,
    fullPath: imagePath,
    x: xCordinate,
    y: yCordinate,
    z: zCordinate,
    i: intensityValue,
    setX: setX,
    setY: setY,
    setZ: setZ,
    requestMetadata: getMetadataFunction
  };

  // Move the crosshair to the requested coordinates after the image has loaded
  // Set defaule dragState
  // Only trigger this effect once, via. the crosshairMoved state
  useEffect(() => {
    if (imageLoaded && !crosshairMoved) {
      const requestedX = queryParams['x'] || queryParams['X']; 
      const requestedY = queryParams['y'] || queryParams['Y'];
      const requestedZ = queryParams['z'] || queryParams['Z'];
      console.log('Moving crosshair to: ', requestedX, requestedY, requestedZ);

      if (requestedX && parseInt(requestedX) > 0) {
        setX(parseInt(requestedX));
      }
      if (requestedY && parseInt(requestedY) > 0) {
        setY(parseInt(requestedY));
      }
      if (requestedZ && parseInt(requestedZ) > 0) {
        setZ(parseInt(requestedZ));
      }

      // Set the drag state to the default value
      setDragState(defaultDragState);

      // Set crosshairMoved to true to prevent further updates
      setCrosshairMoved(true);
    }
  }, [imageLoaded, crosshairMoved, queryParams]);

  // Update the URL with the current coordinates
  useEffect(() => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('X', xCordinate.toString());
    newUrl.searchParams.set('Y', yCordinate.toString());
    newUrl.searchParams.set('Z', zCordinate.toString());

    // Use decodeURIComponent to handle special characters in the URL
    // Makes it easier to share URLs with special characters
    window.history.replaceState({}, '', decodeURIComponent(newUrl.toString()));
  }, [xCordinate, yCordinate, zCordinate]);


  return (
    <>
      <Header {...HeaderProps} />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <NiiVueContainer {...niiVueContainerProps} />
      <Footer {...footerProps} />
    </>
  );
}

export default App;
