import { createContext, useEffect, useState } from "react";
import { getCroppedImage } from "../utils";
import { Area } from "react-easy-crop";

interface CropImageProps {
  imageData?: string | File;
  onCropSuccess?: (file?: File | string) => void;
  children: (props: { onCrop: () => void; isLoading: boolean }) => JSX.Element;
  outputType?: "file" | "base64";
}

export const CropContext = createContext<{
  setCroppedAreaPixels: (area: Area) => void;
  imageUrl?: string;
}>({ setCroppedAreaPixels: () => {} });

const CropImageWrapper: React.FC<CropImageProps> = ({
  children,
  imageData,
  onCropSuccess,
  outputType = "file",
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<
    Area | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cropImageWhenSubmit = async () => {
    if (!croppedAreaPixels || !imageUrl) return;

    const croppedImage = await getCroppedImage(
      imageUrl,
      croppedAreaPixels,
      outputType
    );
    return croppedImage;
  };

  const handleButtonSubmit = async () => {
    setIsLoading(true);
    const _fileImageCropped = await cropImageWhenSubmit();

    onCropSuccess?.(_fileImageCropped);

    setIsLoading(false);
  };

  /**
   * useEffect
   * ====================================================================
   */

  // set image url
  useEffect(() => {
    if (!imageData) return;

    if (typeof imageData === "string") {
      setImageUrl(imageData);
      return;
    }

    if (imageData instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(imageData);
    }
  }, [imageData]);

  /**
   * render view
   * ====================================================================
   */

  return (
    <CropContext.Provider value={{ setCroppedAreaPixels, imageUrl }}>
      {children({ onCrop: handleButtonSubmit, isLoading })}
    </CropContext.Provider>
  );
};

export default CropImageWrapper;
