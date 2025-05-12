# Image Classification API

This is a FastAPI application for image classification using the InceptionResNetV2 model. It's designed to be deployed on Hugging Face Spaces.

## Features

- Upload an image and get a classification result
- Deployed as a Hugging Face Space
- Built with FastAPI for high performance
- Uses TensorFlow and InceptionResNetV2 pre-trained model

## API Endpoints

- `GET /`: Root endpoint to check if the API is running
- `GET /health/`: Health check endpoint
- `POST /api/classifier/`: Upload an image for classification

## How to Use

1. Visit the Hugging Face Space URL
2. Use the interactive Swagger UI at `/docs` to test the API
3. Send a POST request to `/api/classifier/` with an image file
4. Receive the classification result as JSON

## Deploy Your Own

To deploy this on Hugging Face Spaces:

1. Create a new Hugging Face Space
2. Choose FastAPI as the SDK
3. Upload these files to your Space
4. The Space will automatically deploy

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the API locally
uvicorn app:app --reload
```

## Frontend Integration

Connect to this API from your frontend with:

```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://your-huggingface-space-url.hf.space/api/classifier/', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
};
```

## License

MIT
