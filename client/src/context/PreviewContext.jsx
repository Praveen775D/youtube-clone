import { createContext, useContext, useRef } from "react";

const PreviewContext = createContext();

export function PreviewProvider({ children }) {
  const activeVideoRef = useRef(null);

  const register = (videoEl) => {
    // stop previous video
    if (activeVideoRef.current && activeVideoRef.current !== videoEl) {
      activeVideoRef.current.pause();
      activeVideoRef.current.currentTime = 0;
    }

    activeVideoRef.current = videoEl;
  };

  const clear = (videoEl) => {
    if (activeVideoRef.current === videoEl) {
      activeVideoRef.current = null;
    }
  };

  return (
    <PreviewContext.Provider value={{ register, clear }}>
      {children}
    </PreviewContext.Provider>
  );
}

export const usePreview = () => useContext(PreviewContext);