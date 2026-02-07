import time
import uuid
import random

def transfer_funds(amount, currency="USD"):
    """
    Simulates an instant payout gateway.
    """
    print(f"💰 INITIATING TRANSFER: ${amount} {currency}...")
    
    # 1. Simulate API Latency
    time.sleep(1.5)
    
    # 2. Generate a fake Transaction ID
    tx_id = f"TX_{uuid.uuid4().hex[:16].upper()}"
    
    print(f"✅ TRANSFER COMPLETE. Ref: {tx_id}")
    
    return {
        "status": "success",
        "amount": amount,
        "currency": currency,
        "transaction_id": tx_id,
        "timestamp": time.time()
    }