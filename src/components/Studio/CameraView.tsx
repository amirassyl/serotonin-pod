import { useRef, useEffect, forwardRef } from 'react';

interface CameraViewProps {
  onVideoReady?: (video: HTMLVideoElement) => void;
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ onVideoReady }, ref) => {
    const localRef = useRef<HTMLVideoElement>(null);
    const videoRef = (ref as React.RefObject<HTMLVideoElement>) || localRef;

    useEffect(() => {
      const initCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
            },
            audio: false,
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play();
                onVideoReady?.(videoRef.current);
              }
            };
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
        }
      };

      initCamera();

      return () => {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }, [onVideoReady]);

    return (
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        style={{ transform: 'scaleX(-1)' }} // Mirror for natural feel
      />
    );
  }
);

CameraView.displayName = 'CameraView';

export default CameraView;
