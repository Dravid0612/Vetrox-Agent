# backend/agent_brain/vision.py

import os
import sys
from google import genai
from google.genai import types
from dotenv import load_dotenv

# --- FORCE LOAD .ENV ---
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
env_path = os.path.join(backend_dir, '.env')
load_dotenv(env_path)
# -----------------------

def analyze_claim_image(image_path_or_url):
    """
    Sends an image (local path or URL) to Gemini.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return '{"error": "Missing API Key"}'

    client = genai.Client(api_key=api_key)

    # USE THE MODEL YOU FOUND IN THE LIST
    # "gemini-2.0-flash-exp" is great, or use "gemini-1.5-flash"
    model_id = "gemini-3-flash-preview" 

    # 1. PREPARE THE IMAGE
    try:
        if image_path_or_url.startswith("http"):
            # It's a URL (from Supabase/Web)
            image_part = types.Part.from_uri(
                file_uri=image_path_or_url, 
                mime_type="image/jpeg"
            )
        else:
            # It's a Local File -> Read bytes!
            print(f"📂 Reading local file: {image_path_or_url}")
            with open(image_path_or_url, "rb") as f:
                image_bytes = f.read()
                
            image_part = types.Part.from_bytes(
                data=image_bytes, 
                mime_type="image/jpeg"
            )
    except FileNotFoundError:
        return f'{{"error": "File not found: {image_path_or_url}"}}'
    except Exception as e:
        return f'{{"error": "Error reading image: {str(e)}"}}'

    # 2. THE PROMPT (Brain)
    sys_instruct = """Role: You are "Vetrox Adjuster", an autonomous AI insurance agent.
Objective: Analyze images of damaged items to process claims instantly.

Instructions:
1. Identify the object in the image.
2. Analyze the visible damage specifically.
3. Estimate a realistic repair/replacement cost in USD.
4. Make a Decision:
   - APPROVE if the damage is clear and cost is under $500.
   - REJECT if the image is unclear, not damage, or cost is over $500.
5. Output MUST be raw JSON.

JSON Schema:
{
  "item_name": "string",
  "damage_description": "string",
  "severity": "Low" | "Medium" | "High",
  "estimated_cost": number,
  "decision": "APPROVE" | "REJECT",
  "reason": "string"
}"""

    # 3. COMBINE & SEND
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="Analyze this image."),
                image_part
            ],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=0.1,
        response_mime_type="application/json",
        system_instruction=sys_instruct
    )

    try:
        response = client.models.generate_content(
            model=model_id,
            contents=contents,
            config=generate_content_config,
        )
        return response.text
    except Exception as e:
        return f'{{"error": "{str(e)}"}}'