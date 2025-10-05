# 3D Model Viewer

This is a comprehensive 3D model viewer web application built with React, TypeScript, and Three.js. It allows users to upload and inspect `.obj`, `.gltf`, and `.glb` 3D models with various rendering options and controls.

## 1. Features

*   **3D Model Loading**: Upload and view `.obj`, `.gltf`, and `.glb` 3D models.
*   **Interactive 3D Viewer**: Orbit, pan, and zoom the camera to inspect the model from all angles.
*   **GLTF/GLB Support**: Full support for GLTF/GLB files with PBR materials, preserving colors and materials from CAD software like SOLIDWORKS.
*   **Multiple Rendering Modes**:
    *   **Solid**: Standard shaded material.
    *   **Wireframe**: Shows the model's geometry.
    *   **Normal**: Displays the model's normals.
    *   **Matcap**: Uses a material capture texture for detailed shading.
    *   **Depth**: Shows the depth of the model.
*   **Scene Controls**:
    *   Toggle grid visibility.
    *   Toggle auto-rotation.
    *   Toggle bounding box visibility.
*   **Lighting Controls**: Adjust ambient and directional light intensity and color.
*   **File Dropzone**: Easy drag-and-drop file uploading for OBJ, GLTF, and GLB files.
*   **Model Info Panel**: View detailed information including:
    *   File format (OBJ, GLTF, GLB)
    *   Number of meshes
    *   Number of vertices and faces
    *   Material count
    *   Animation information (for GLTF files)
*   **Error Handling**: Graceful error handling for failed model loading.
*   **Responsive Layout**: The application is designed with a responsive layout that works on different screen sizes.

## 2. Tech Stack

*   **Framework**: [React](https://reactjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **3D Rendering**: [Three.js](https://threejs.org/) with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) and [Drei](https://github.com/pmndrs/drei).
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
*   **File Handling**: [React Dropzone](https://react-dropzone.js.org/)
*   **Bundler**: [Vite](https://vitejs.dev/)

## 3. Architecture

The application follows a component-based architecture, with a clear separation of concerns between UI, state management, and 3D rendering logic.

### 3.1. Project Structure

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/         # Layout components (MainLayout)
│   │   ├── ui/             # shadcn/ui components
│   │   ├── viewer/         # 3D viewer related components
│   │   ├── FileUploadDialog.tsx
│   │   └── FileUploader.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

### 3.2. Data Flow

The application uses a centralized state management approach with Zustand.

1.  **State Store (`viewerStore.ts`)**: A single store holds the entire application state, including the loaded model, viewer settings, light settings, and UI status (e.g., `isLoading`, `error`).
2.  **Components**: React components subscribe to the store and re-render when the relevant parts of the state change.
3.  **Actions**: User interactions in the UI (e.g., changing a slider, clicking a button) trigger action functions (e.g., `updateSettings`, `setCurrentModel`) defined in the store. These actions update the state.
4.  **3D Scene**: The `react-three-fiber` components in the `Viewer3D` also subscribe to the store. Changes in the store (e.g., `renderMode`, `lightSettings`) directly affect the properties of the 3D objects, lights, and materials in the scene, causing them to update in real-time.

## 4. Component Breakdown

### 4.1. Core Components

*   **`main.tsx`**: The entry point of the application. It renders the `App` component into the DOM.
*   **`App.tsx`**: The root component of the application.
    *   It sets up the main layout using the `MainLayout` component.
    *   It defines the `SidebarContent` component, which aggregates all the UI controls.
    *   It contains all the event handler functions for the UI controls, which in turn call the state update functions from the Zustand store.
    *   It manages the visibility of the `FileUploadDialog`.

### 4.2. Layout Components

*   **`components/layout/MainLayout.tsx`**: Defines the main two-column layout of the application. It has a slot for a `sidebar` (the left-side control panel) and `children` (the main content area, which holds the 3D viewer).

### 4.3. Viewer Components

*   **`components/viewer/ViewerContainer.tsx`**: This component acts as a conditional container for the 3D viewer.
    *   If a model is loaded (`currentModel` is not null), it renders the `Viewer3D` component.
    *   If no model is loaded, it displays a placeholder message prompting the user to upload a model.
*   **`components/viewer/Viewer3D.tsx`**: This is the heart of the 3D visualization.
    *   It uses the `<Canvas>` component from `react-three-fiber` to create a WebGL rendering context.
    *   It sets up the initial camera and renderer properties.
    *   It orchestrates the rendering of the different parts of the scene: `SceneLights`, the `Grid`, the `ModelLoader`, and the `CameraController`.
    *   It uses React's `<Suspense>` to show a loading fallback while the 3D model is being loaded asynchronously.
    *   It wraps the entire scene in an `ErrorBoundary` to catch and handle any rendering errors.
*   **`components/viewer/ModelLoader.tsx`**: This component is responsible for loading and preparing the 3D model.
    *   It uses the `useLoader` hook from `react-three-fiber` with `three/examples/jsm/loaders/OBJLoader` to load the `.obj` file from the provided URL.
    *   Once the model is loaded, it processes the geometry:
        *   It calculates the total number of vertices and faces and stores this information in the Zustand store.
        *   It computes the model's bounding box.
        *   It centers the model at the origin `(0,0,0)`.
        *   It scales the model to a normalized size to ensure it fits within the viewport.
    *   It contains a `useEffect` hook that listens for changes in the `renderMode` from the store. When the mode changes, it traverses the model's hierarchy and applies the corresponding new material to all meshes.
*   **`components/viewer/MaterialController.tsx`**: This is a UI component that provides a dropdown menu (`<Select>`) for the user to change the `renderMode`. It gets the current `renderMode` from the Zustand store and calls `updateSettings` when a new mode is selected.
*   **`components/viewer/SceneLights.tsx`**: This component declaratively sets up the lighting for the 3D scene. It includes an `<ambientLight>` for global illumination and two `<directionalLight>`s to provide key and fill lighting, creating a more realistic and detailed look. The light properties (intensity, color) are controlled by the `lightSettings` in the Zustand store.
*   **`components/viewer/SceneHelpers.tsx`**: This component renders visual aids in the scene, such as a `Grid` and a `GizmoHelper` (axes). The visibility of these helpers is controlled by the `settings` in the Zustand store.
*   **`components/viewer/ErrorBoundary.tsx`**: A standard React Error Boundary component that wraps the 3D viewer. If any error occurs during the rendering of the 3D scene, this component will catch it and display a user-friendly fallback UI instead of crashing the entire application.

### 4.4. File Handling Components

*   **`components/FileUploader.tsx`** and **`components/FileUploadDialog.tsx`**: These components create the user interface for uploading files. They use the `react-dropzone` library to provide a drag-and-drop area for `.obj` files.
*   **`hooks/useFileUpload.ts`**: This custom hook encapsulates the logic for handling file uploads.
    *   It uses `react-dropzone`'s `useDropzone` hook.
    *   When a file is dropped, it validates the file type.
    *   It creates a URL for the local file using `URL.createObjectURL()`.
    *   It updates the Zustand store with the new model information by calling `setCurrentModel`.

## 5. State Management (`viewerStore.ts`)

The application uses Zustand for simple and powerful state management. The store is a single object that contains all the application's state and the functions to update it.

### 5.1. State Properties

*   `currentModel`: Holds the information about the currently loaded 3D model.
*   `settings`: An object containing various settings for the viewer, such as `renderMode`, `wireframe`, `autoRotate`, `showGrid`, etc.
*   `lightSettings`: An object containing the settings for the lights, such as intensity and color.
*   `isLoading`: A boolean to indicate when a model is being loaded.
*   `error`: A string to hold any error messages.
*   `modelInfo`: An object to store the number of vertices and faces of the model.

### 5.2. Actions

*   `setCurrentModel`: Sets the current model.
*   `updateSettings`: Updates the viewer settings.
*   `updateLightSettings`: Updates the light settings.
*   `setIsLoading`: Sets the loading state.
*   `setError`: Sets the error message.
*   `setModelInfo`: Sets the model information.

## 6. 3D Rendering Pipeline

The 3D rendering is handled by `react-three-fiber`, which is a React renderer for Three.js. This allows us to work with the 3D scene in a declarative and component-based way.

1.  **Canvas Setup (`Viewer3D.tsx`)**: The `<Canvas>` component creates a `THREE.Scene` and a `THREE.WebGLRenderer` and manages the render loop.
2.  **Model Loading (`ModelLoader.tsx`)**: The `useLoader` hook asynchronously loads the `.obj` file. While loading, the `<Suspense>` component shows a `LoadingFallback`.
3.  **Geometry Processing (`ModelLoader.tsx`)**: Once loaded, the model's geometry is centered and scaled.
4.  **Material Application (`ModelLoader.tsx`)**: A material is applied to the model based on the `renderMode` in the Zustand store. A `useEffect` hook ensures that the material is updated whenever the `renderMode` changes.
5.  **Lighting (`SceneLights.tsx`)**: Lights are added to the scene to illuminate the model.
6.  **Camera (`Viewer3D.tsx`)**: `react-three-fiber` provides a default camera. The `CameraController` component adds `OrbitControls` to make the camera interactive.
7.  **Render Loop**: `react-three-fiber` automatically handles the render loop. It re-renders the scene whenever the component's state or props change, or when the camera is moved.

## 7. Code Analysis and Observations

*   **Unused Code**: The project contains a file `src/utils/objParser.ts`, which seems to be an early attempt at a custom OBJ parser. However, the application currently uses the more robust `OBJLoader` from the `three.js` library. The custom parser is not used.
*   **Hook vs. Component Confusion**: The file `src/hooks/useMaterial.ts` was previously named `MaterialController.tsx` and was being incorrectly used as a component, which caused errors. The logic for applying materials is now handled directly inside `ModelLoader.tsx`. The `useMaterial.ts` hook is currently not used anywhere in the application. This suggests a point of refactoring that was not completed.
*   **Centralized Controls**: All UI event handlers are defined in `App.tsx` and passed down as props to the `SidebarContent` component. This is a reasonable approach for a small application, but for a larger application, it might be better to have more co-location of state and the components that use it.

## 8. Supported File Formats

### OBJ (.obj)
- **Best for**: Simple geometry, individual parts
- **Limitations**:
  - Basic material support (requires .mtl file)
  - No color preservation from CAD software
  - No assembly hierarchy
- **Use case**: Quick geometry visualization

### GLTF/GLB (.gltf, .glb)
- **Recommended for SOLIDWORKS exports**
- **Advantages**:
  - Preserves PBR materials and colors
  - Maintains assembly hierarchy
  - Supports multiple meshes
  - Better performance for complex models
  - Animation support
- **Use case**: Full-featured CAD model visualization with colors and materials

## 9. Exporting from SOLIDWORKS

### Option 1: Direct GLTF Export (if available)
1. In SOLIDWORKS, go to `File → Save As`
2. Select `GLTF (*.gltf)` or `GLB (*.glb)` format
3. Configure export options:
   - ✓ Include materials
   - ✓ Include colors
4. Save and upload to the viewer

### Option 2: Via Blender (Free)
1. Export from SOLIDWORKS as `.obj` + `.mtl`
2. Import into [Blender](https://www.blender.org/) (free)
3. In Blender: `File → Export → glTF 2.0 (.glb)`
4. Export settings:
   - Format: `glTF Binary (.glb)`
   - ✓ Include: Materials
   - ✓ Compression
5. Upload the `.glb` file to the viewer

### Recommendations
- **For assemblies**: Use GLB format for best results
- **File size**: Keep under 100MB for optimal web performance
- **Colors**: GLB preserves SOLIDWORKS part colors automatically

## 10. How to Run the Project

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173` (or the port specified in the output).

## 11. Usage Tips

- **Drag and drop**: Simply drag `.obj`, `.gltf`, or `.glb` files onto the upload area
- **Model info**: Check the top-left panel for model statistics and format information
- **Performance**: For large assemblies (100+ parts), GLB format typically performs better than OBJ
- **Wireframe**: Use wireframe mode to inspect geometry structure regardless of file format