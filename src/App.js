
import './App.css';
import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';

import { viewport, init, isTMA } from "@telegram-apps/sdk";

import { RotatingLines } from "react-loader-spinner";

function Loader() {
  return (
    <RotatingLines
      strokeColor="green"
      strokeWidth="5"
      animationDuration="30"
      width="96"
      visible={true}

    />
  )
}

async function initTg() {
    if (await isTMA()) {
        init(); // init tg app

        if (viewport.mount.isAvailable()) {
            await viewport.mount();
            viewport.expand(); // first it would be better to expand
        }

        if (viewport.requestFullscreen.isAvailable()) {
            await viewport.requestFullscreen(); // then request full screen mode
        }
    }
}

(async () => {
    await initTg();
})();

function App() {
  const [isHapticSoft, setIsHapticSoft] = useState(false);
  const [isHapticMedium, setIsHapticMedium] = useState(false);

  // const [devicePixelRatio, setDevicePixelRatio] = useState(
  //     window.devicePixelRatio
  //   );

  const { unityProvider, addEventListener, removeEventListener, loadingProgression, isLoaded, requestFullscreen } = useUnityContext({
    loaderUrl: "assets/WebGL.loader.js",
    dataUrl: "assets/WebGL.data.unityweb",
    frameworkUrl: "assets/WebGL.framework.js.unityweb",
    codeUrl: "assets/WebGL.wasm.unityweb",
  });
  const [impactOccurred, notificationOccurred, selectionChanged] =
    useHapticFeedback();

    function hapticSoft() {
      notificationOccurred('success');
    }
  function hapticMedium() {
    notificationOccurred('error');
  }

  const handleHapticSoft = useCallback(() => {
     hapticSoft();
   }, []);

   const handleHapticMedium = useCallback(() => {
      hapticMedium();
    }, []);

   useEffect(() => {
     addEventListener("HapticSoft", handleHapticSoft);
     addEventListener("HapticMedium", handleHapticMedium);




     // A function which will update the device pixel ratio of the Unity
           // Application to match the device pixel ratio of the browser.
           // const updateDevicePixelRatio = function () {
           //   setDevicePixelRatio(window.devicePixelRatio);
           // };
           // // A media matcher which watches for changes in the device pixel ratio.
           // const mediaMatcher = window.matchMedia(
           //   `screen and (resolution: ${devicePixelRatio}dppx)`
           // );
           // // Adding an event listener to the media matcher which will update the
           // // device pixel ratio of the Unity Application when the device pixel
           // // ratio changes.
           // mediaMatcher.addEventListener("change", updateDevicePixelRatio);





     return () => {
       removeEventListener("HapticSoft", handleHapticSoft);
       removeEventListener("HapticMedium", handleHapticMedium);



       //mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
     };
   }, [addEventListener, removeEventListener, handleHapticSoft,
     //devicePixelRatio
   ]);
   function handleClickEnterFullscreen() {
       requestFullscreen(true);
     }


  return (
    <Fragment >
     <div className="center">
          <Loader />
          {!isLoaded && (
           <div className="loading-overlay">
             <div className="loading-spinner"></div>
             <p>Loading: {Math.round(loadingProgression * 100)}%</p>
           </div>
         )}


      <Unity
      // style ={{
      //   width: "100vw",   // Full viewport width
      //   height: "100vh",  // Full viewport height
      //   position: "absolute",
      //   top: 0,
      //   left: 0,
      //   }}
      style={{ width: 250, height: 600 }}
      devicePixelRatio={window.devicePixelRatio}
         unityProvider={unityProvider}

         />

         </div>
    </Fragment>
  );
}

export default App;
