import cv2
import numpy as np
import sys

def test_opencv():
    print("OpenCV version:", cv2.__version__)
    try:
        # Create a simple image
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        # Resize it
        resized = cv2.resize(img, (50, 50))
        print(f"Original shape: {img.shape}, Resized shape: {resized.shape}")
        print("OpenCV is working correctly!")
        return True
    except Exception as e:
        print(f"OpenCV test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_opencv()
    sys.exit(0 if success else 1) 