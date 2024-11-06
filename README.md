# react-image-crop-slider

`react-image-crop-slider` is a React component that enables users to easily adjust and crop images by using a slider to zoom in or out for precise alignment and cropping. This component is particularly useful for applications where users upload and align images before use.

## Features

- Supports zooming in/out of images via a slider.
- Simple image alignment within the cropping area.
- Customizable for integration into other React projects.

## Installation

Install using npm or yarn:

```bash
npm install react-image-crop-slider
```

Or

```bash
yarn add react-image-crop-slider
```

## Usage

Below is a basic example of how to use `react-image-crop-slider`:

```tsx
import React, { useState } from "react";
import { CropImageWrapper, CropImage } from "react-image-crop-slider";

const App = () => {
  const handleWhenCropImageSuccess = (result?: File | string) => {
    console.log("Result", result);
  };

  return (
    <CropImageWrapper
      imageData="https://images.unsplash.com/photo-1428606381429-22224991fb0c"
      onCropSuccess={handleWhenCropImageSuccess}
    >
      {({ onCrop }) => {
        return (
          <div>
            <CropImage aspect={1} />
            <button onClick={onCrop}>Crop</button>
          </div>
        );
      }}
    </CropImageWrapper>
  );
};

export default App;
```

#### Props

##### CropImageWrapper

| Prop          | Loại                                                                | Mô tả                                                                            |
| ------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| imageData     | string \| File                                                      | The image path or File object                                                    |
| outputType    | 'file' \| 'base64'                                                  | Type of data to return on onCropSuccess, default: `file`                         |
| onCropSuccess | (cropped: string \| File \| undefined) => void                      | Function called after triggering `onCrop`, returns the cropped image             |
| children      | (props: { onCrop: () => void; isLoading: boolean }) => JSX.Element; | `onCrop` triggers the crop action; `isLoading` shows the cropping process status |

##### CropImage

| Prop       | Loại                    | Mô tả                                                                                  |
| ---------- | ----------------------- | -------------------------------------------------------------------------------------- |
| aspect     | number                  | Desired aspect ratio for the cropped image, e.g., 16/9 for 16:9 or 1 for a square crop |
| maxScale   | number                  | Maximum zoom level relative to the original image, default: `5`                        |
| slider     | React.FC\<SliderProps\> | Pass a custom slider component                                                         |
| className  | string                  | Add a className to the container                                                       |
| classNames | object                  | Add className to specific elements                                                     |

## Contribution

If you have improvement ideas or find issues, please create an issue or open a pull request to contribute to the project.

## License

`react-image-crop-slider` is licensed under the MIT License.
