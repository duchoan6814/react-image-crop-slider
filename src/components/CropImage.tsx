import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Cropper, { Area, MediaSize } from "react-easy-crop";
import "./crop-image.scss";
import { CropContext } from "./CropImageWrapper";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

interface CropImageProps {
  aspect: number;
  maxScale?: number;
  slider?: React.FC<SliderProps>;
  className?: string;
  classNames?: {
    container?: string;
    cropImage?: string;
    slider?: string;
  };
}

const CropImage: React.FC<CropImageProps> = ({
  aspect,
  maxScale = 5,
  slider,
  className,
  classNames,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCroppedAreaPixels, imageUrl } = useContext(CropContext);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, onZoomChange] = useState<number>(1);
  const [minSlider, setMinSlider] = useState(1);
  const [maxSlider, setMaxSlider] = useState(3);
  const [mediaSize, setMediaSize] = useState<MediaSize | undefined>();
  const [cropSize, setCropSize] = useState<number>(400);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSliderChange = useCallback((scale: number) => {
    onZoomChange(scale);
  }, []);

  const increateZoom = useCallback(() => {
    onZoomChange((prev) => {
      if (prev + 0.5 >= maxSlider) return maxSlider;

      return Number.parseFloat(String(prev)) + 0.5;
    });
  }, [maxSlider]);

  const decreateZoom = useCallback(() => {
    onZoomChange((prev) => {
      if (prev - 0.5 <= minSlider) return minSlider;

      return Number.parseFloat(String(prev)) - 0.5;
    });
  }, [minSlider]);

  /**
   * effect
   * =================================================================
   */

  // calculate the initial zoom
  useEffect(() => {
    if (!mediaSize) return;

    if (!containerRef?.current) return;

    const containerWidth = containerRef?.current?.clientWidth;
    const containerHeight = containerRef?.current?.clientHeight;

    const cropSize =
      containerWidth <= containerHeight ? containerWidth : containerHeight;
    setCropSize(cropSize);

    const scaleX = cropSize / mediaSize?.width;
    const scaleY = cropSize / aspect / mediaSize?.height;

    if (scaleX >= scaleY) {
      onZoomChange(scaleX);
      setMinSlider(scaleX);
      setMaxSlider(scaleX * maxScale);
    } else {
      onZoomChange(scaleY);
      setMinSlider(scaleY);
      setMaxSlider(scaleY * maxScale);
    }
  }, [aspect, maxScale, mediaSize, mediaSize?.height, mediaSize?.width]);

  /**
   * render view
   * =================================================================
   */

  return (
    <div
      className={`wrap-crop-image ${className ? className : ""} ${
        classNames?.container ? classNames?.container : ""
      }`}
    >
      <div
        ref={containerRef}
        className={`wrap-crop-image__crop-image ${
          classNames?.cropImage ? classNames?.cropImage : ""
        }`}
      >
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          cropSize={{ width: cropSize, height: cropSize / aspect }}
          onMediaLoaded={setMediaSize}
        />
      </div>
      <div
        className={`wrap-crop-image__slider ${
          classNames?.slider ? classNames?.slider : ""
        }`}
      >
        {slider ? (
          slider({
            min: minSlider,
            max: maxSlider,
            value: zoom,
            onChange: handleSliderChange,
          })
        ) : (
          <input
            type="range"
            min={minSlider}
            max={maxSlider}
            step={0.1}
            value={zoom}
            onChange={(e) => handleSliderChange(Number(e?.target?.value))}
            className="form-range"
          />
        )}
      </div>
    </div>
  );
};

export default CropImage;
