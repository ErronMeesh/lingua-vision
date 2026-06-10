import io
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
from deep_translator import GoogleTranslator

app = FastAPI(title="Lingvo Vision AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # На проде лучше заменить "*" на URL твоего фронтенда (например, "https://my-app.com")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("yolov8n.pt")
translator = GoogleTranslator(source='en', target='ru')

translation_cache = {}

@app.post("/analyze")
async def analyze_image(file: UploadFile):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    results = model(image)

    detected_objects = []
    
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = round(box.conf[0].item(), 2)
            cls_id = int(box.cls[0].item())
            label_en = result.names[cls_id]

            if label_en not in translation_cache:
                try:
                    translation_cache[label_en] = translator.translate(label_en).lower()
                except Exception:
                    translation_cache[label_en] = label_en
            
            label_ru = translation_cache[label_en]

            detected_objects.append({
                "box": [round(x1), round(y1), round(x2), round(y2)],
                "label_en": label_en,
                "label_ru": label_ru,
                "confidence": confidence
            })

    return {"objects": detected_objects}