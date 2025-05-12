import os
import ssl
import numpy as np
import cv2
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from tempfile import NamedTemporaryFile
from datetime import datetime
from PIL import Image
from typing import Optional

# Create FastAPI app
app = FastAPI(
    title="Image Classification API",
    description="A simple API for image classification using InceptionResNetV2",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Create model instance (load only once)
print("Loading InceptionResNetV2 model...")
# SSL certificate necessary for downloading weights
ssl._create_default_https_context = ssl._create_unverified_context
model = tf.keras.applications.InceptionResNetV2(weights='imagenet')
print("Model loaded successfully")

class ClassificationResult(BaseModel):
    result: str
    date_classified: str

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health/")
def health_check():
    return {"status": "healthy"}

@app.post("/api/classifier/", response_model=ClassificationResult)
async def classify_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image")
    
    try:
        # Save uploaded file temporarily
        with NamedTemporaryFile(delete=False) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_file_path = temp_file.name
        
        # Process image
        img = Image.open(temp_file_path)
        img_array = tf.keras.utils.img_to_array(img)
        dimensions = (299, 299)
        
        # Resize and preprocess
        resized_image = cv2.resize(img_array, dimensions, interpolation=cv2.INTER_AREA)
        ready_image = np.expand_dims(resized_image, axis=0)
        ready_image = tf.keras.applications.inception_resnet_v2.preprocess_input(ready_image)
        
        # Make prediction
        prediction = model.predict(ready_image)
        decoded = tf.keras.applications.inception_resnet_v2.decode_predictions(prediction)[0][0][1]
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        # Return result
        return ClassificationResult(
            result=str(decoded),
            date_classified=datetime.now().strftime('%Y-%m-%d %H:%M')
        )
        
    except Exception as e:
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=7860, reload=True) 