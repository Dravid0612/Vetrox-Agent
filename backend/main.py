import os
import json
import shutil
import uuid
import uvicorn
import warnings
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from web3 import Web3
from web3.middleware import geth_poa_middleware
import google.generativeai as genai
from dotenv import load_dotenv 
load_dotenv()
# --- 1. CONFIGURATION ---
warnings.filterwarnings("ignore")

# 🔑 FILL THESE IN!
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OWNER_WALLET = "0x8adE4c7e51c1cf9c314641154fF7aa83a39Cf2ba"
OWNER_PRIVATE_KEY = "11f155cc425d0af9a2e794d2413ad55915d604aef912828a01ec2a3ffc6b0fd7"

# 🔗 SEPOLIA CONFIGURATION
RPC_URL = "https://rpc.sepolia.org"
CHAIN_ID = 11155111
CONTRACT_ADDRESS = "0x254112a5f7cDEb51AEfD16c903A705f0647B3921" 
CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address payable","name": "_user","type": "address"},
                   {"internalType": "uint256","name": "_amount","type": "uint256"}],
        "name": "processInstantClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address payable","name": "_user","type": "address"},
                   {"internalType": "uint256","name": "_amount","type": "uint256"}],
        "name": "payoutAppeal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# --- 2. SETUP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
APPEALS_DB = []

genai.configure(api_key=GEMINI_API_KEY)
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

def send_blockchain_tx(function_name, user_address, amount_usd):
    try:
        if not w3.is_connected():
            return {"status": "error", "message": "Blockchain disconnected"}

        amount_eth = 0.0001 
        amount_wei = w3.to_wei(amount_eth, 'ether')

        func = contract.functions[function_name](user_address, amount_wei)
        
        tx = func.build_transaction({
            'from': OWNER_WALLET,
            'nonce': w3.eth.get_transaction_count(OWNER_WALLET),
            'gas': 200000,
            'gasPrice': w3.to_wei('10', 'gwei'),
            'chainId': CHAIN_ID
        })

        signed_tx = w3.eth.account.sign_transaction(tx, OWNER_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        return {
            "status": "success",
            "tx_hash": w3.to_hex(tx_hash),
            "explorer": f"https://sepolia.etherscan.io/tx/{w3.to_hex(tx_hash)}"
        }
    except Exception as e:
        print(f"Tx Error: {e}")
        return {"status": "error", "message": str(e)}

def analyze_claim_image(image_path):
    try:
        myfile = genai.upload_file(image_path)
        prompt = """
        Analyze this image for insurance claim. Return ONLY a raw JSON object:
        {
            "item_name": "Item Name",
            "damage_description": "Short description",
            "severity": "Low/Medium/High",
            "estimated_cost_usd": 150,
            "decision": "APPROVE" or "REJECT",
            "reason": "Reasoning"
        }
        Rules: Approve ONLY if damage is extremely clear (like broken glass). and estimated cost < the actual cost of the item Reject if ambiguous.
        """
        model = genai.GenerativeModel("gemini-3-flash-preview")
        result = model.generate_content([myfile, prompt])
        clean = result.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except Exception as e:
        return {"decision": "REJECT", "reason": f"AI Error: {str(e)}", "estimated_cost_usd": 0}

# --- 4. API ENDPOINTS ---

@app.get("/appeals")
def get_appeals():
    """Get list of rejected claims"""
    return APPEALS_DB

@app.post("/approve_appeal/{claim_id}")
def approve_appeal(claim_id: str):
    """Admin manually approves a claim"""
    claim = next((item for item in APPEALS_DB if item["id"] == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Trigger Blockchain Payout
    result = send_blockchain_tx("payoutAppeal", OWNER_WALLET, claim['amount'])
    
    if result.get("status") == "success":
        APPEALS_DB.remove(claim) # Remove from list after paying
        
    return result

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    claim_id = str(uuid.uuid4())[:8]
    filename = f"static/{claim_id}_{file.filename}"
    
    with open(filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    result = analyze_claim_image(filename)
    
    if result.get("decision", "").upper() == "APPROVE":
        # AI Pays Instantly
        tx = send_blockchain_tx("processInstantClaim", OWNER_WALLET, result.get("estimated_cost_usd", 0))
        result["payout"] = tx
    else:
        # Save to DB for Admin Review
        appeal_record = {
            "id": claim_id,
            "item": result.get("item_name", "Unknown"),
            "reason": result.get("reason", "Unknown"),
            "amount": result.get("estimated_cost_usd", 0),
            "image_url": f"http://localhost:8000/{filename}",
            "status": "Pending Review"
        }
        APPEALS_DB.append(appeal_record)
        result["appeal_status"] = "Sent to DAO for Review"

    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)