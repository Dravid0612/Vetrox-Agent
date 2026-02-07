import os
import json
import shutil
import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
import google.generativeai as genai

# --- CONFIGURATION ---
GEMINI_API_KEY="AIzaSyBOg1K2Bujp-HhIDAVd8fXTie1ivmanmCo"

# Cronos Testnet Settings
CRONOS_RPC = "https://evm-t3.cronos.org"
SENDER_ADDRESS = "0x8adE4c7e51c1cf9c314641154fF7aa83a39Cf2ba"
SENDER_PRIVATE_KEY = "11f155cc425d0af9a2e794d2413ad55915d604aef912828a01ec2a3ffc6b0fd7" 
RECEIVER_ADDRESS = "0x469a3eec26D6Df75fd8A27e152ce711a35272a14" # Target wallet for payout

# --- SETUP ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=GEMINI_API_KEY)
w3 = Web3(Web3.HTTPProvider(CRONOS_RPC))

# --- HELPER FUNCTIONS ---
def analyze_claim_image(image_path):
    try:
        myfile = genai.upload_file(image_path)
        prompt = """
        Analyze this image for insurance claim. Return ONLY a raw JSON object:
        {
            "item_name": "Item Name",
            "damage_description": "Short description",
            "severity": "Low/Medium/High",
            "estimated_cost": based on the severity and damage and item type,
            "decision": "APPROVE" or "REJECT",
            "reason": "Reasoning"
        }
        Rules: Approve if damage is clear and cost < half of the item's original value.
        """
        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content([myfile, prompt])
        return result.text
    except Exception as e:
        return json.dumps({"decision": "REJECT", "reason": f"AI Error: {str(e)}"})

def transfer_funds(amount_usd):
    try:
        if not w3.is_connected():
            return _mock_transfer()

        # Send 0.01 TCRO
        amount_to_send = 0.01 
        nonce = w3.eth.get_transaction_count(SENDER_ADDRESS)
        
        tx = {
            'nonce': nonce,
            'to': RECEIVER_ADDRESS,
            'value': w3.to_wei(amount_to_send, 'ether'),
            'gas': 200000,
            'gasPrice': w3.to_wei('5000', 'gwei'),
            'chainId': 338
        }

        signed_tx = w3.eth.account.sign_transaction(tx, SENDER_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        tx_hash_hex = w3.to_hex(tx_hash)
        
        return {
            "status": "success",
            "amount": f"{amount_to_send} TCRO",
            "transaction_id": tx_hash_hex,
            "explorer_link": f"https://explorer.cronos.org/testnet/tx/{tx_hash_hex}"
        }
    except Exception:
        return _mock_transfer()

def _mock_transfer():
    return {
        "status": "simulated",
        "amount": "250 USD (Simulated)",
        "transaction_id": "0xSIMULATED_HASH_FOR_DEMO",
        "explorer_link": "#"
    }

# --- API ENDPOINT ---
@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    temp_filename = f"temp_{file.filename}"
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # AI Analysis
        raw_result = analyze_claim_image(temp_filename)
        
        # Parse JSON
        if isinstance(raw_result, str):
            clean_json = raw_result.replace("```json", "").replace("```", "").strip()
            try:
                result = json.loads(clean_json)
            except:
                result = {"decision": "REJECT", "reason": "AI Parsing Error"}
        else:
            result = raw_result

        # Blockchain Logic
        decision = result.get("decision", "").strip().upper()
        if decision == "APPROVE":
            payout_data = transfer_funds(result.get("estimated_cost", 0))
            result["payout_details"] = payout_data
            result["action_taken"] = "PAYOUT_SENT"
        else:
            result["action_taken"] = "NONE"
            result["payout_details"] = None

        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            
        return result

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)