

import uuid
from typing import List, Optional, Literal
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from bson import ObjectId
import random
import string

app = FastAPI()

# CORS setup to allow Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection - all collections in cl_cons
client = MongoClient("mongodb://localhost:27017/")

cl_cons_db = client["cl_cons"]
users_collection = cl_cons_db["users"]
devices_collection = cl_cons_db["devices"]
tickets_collection = cl_cons_db["tickets"]
cons_collection = cl_cons_db["cons"]
map_collection = cl_cons_db["map"]
responses_collection = cl_cons_db["responses"]
# Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class DeviceCreate(BaseModel):
    device_name: str
    device_id: Optional[str] = None
    type: str
    index: str
    construction: str
    model: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    ip: str
    station: str
    usine: str
    user_email: EmailStr
class ResponseModel(BaseModel):
    device_id: str
    message: str
    youtube_link: str | None = None
    consultant_email: EmailStr
class Ticket(BaseModel):
    _id: Optional[str]
    id_ticket: Optional[str] = None
    breve_description: str
    info_complementaires: Optional[str] = ''
    device_name: str
    device_id: str
    type_probleme: Literal['hardware', 'software']
    user_email: EmailStr
    status: Literal['Créé', 'Vu', 'Traitement', 'Répondu'] = 'Créé'
    created_at: Optional[str] = None

class ClientCreate(BaseModel):
    username: str
    password: str
    firstname: str
    lastname: str
    email: EmailStr
    job: Optional[str] = ''
    phone: Optional[str] = ''
    address: Optional[str] = ''
    super_user_id: Optional[str] = ''
    status: Optional[bool] = True
    device_reserved: Optional[int] = 0
    device_installed: Optional[int] = 0
    device_connected: Optional[int] = 0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class Dot(BaseModel):
    id: int
    lat: float
    lng: float
    color: str

class SaveDotsPayload(BaseModel):
    email: EmailStr
    dots: List[Dot]

# Existing endpoints (unchanged)
@app.post("/login")
def login(req: LoginRequest):
    user = users_collection.find_one({"email": req.email, "password": req.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "email": user["email"]
    }

@app.post("/cons_login")
def cons_login(req: LoginRequest): 
    cons = cons_collection.find_one({"email": req.email, "password": req.password})
    if not cons:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "message": "Login successful",
        "user_id": str(cons["_id"]),
        "email": cons["email"]
    }

def clean_device(device):
    device["_id"] = str(device["_id"])
    device["user_id"] = str(device.get("user_id", ""))
    device["created_at"] = device.get("created_at", "").isoformat() if "created_at" in device else ""
    device["updated_at"] = device.get("updated_at", "").isoformat() if "updated_at" in device else ""
    return device

@app.get("/devices")
def get_devices(user_email: str):
    devices = list(devices_collection.find({"user_email": user_email}))
    return [clean_device(d) for d in devices]

@app.post("/tickets")
def create_ticket(ticket: Ticket):
    device = devices_collection.find_one({"device_id": ticket.device_id.upper()})
    if not device:
        raise HTTPException(status_code=404, detail="Device with this ID not found")

    ticket_data = ticket.dict(by_alias=True, exclude={"_id", "created_at"})
    ticket_data["device_id"] = ticket.device_id.upper()
    ticket_data["id_ticket"] = ticket_data["device_id"]
    ticket_data["created_at"] = datetime.utcnow()

    try:
        result = tickets_collection.insert_one(ticket_data)
        return {
            "message": "Ticket created successfully",
            "ticket_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tickets", response_model=List[Ticket])
def get_tickets(user_email: Optional[str] = None):
    if not user_email:
        raise HTTPException(status_code=400, detail="Email is required")

    is_consultant = cons_collection.find_one({"email": user_email})
    is_client = users_collection.find_one({"email": user_email})

    if is_consultant:
        tickets = list(tickets_collection.find({}))
    elif is_client:
        tickets = list(tickets_collection.find({"user_email": user_email}))
    else:
        raise HTTPException(status_code=403, detail="Email not found in system")

    for ticket in tickets:
        ticket["_id"] = str(ticket["_id"])
        if "created_at" in ticket and isinstance(ticket["created_at"], datetime):
            ticket["created_at"] = ticket["created_at"].isoformat()
        else:
            ticket["created_at"] = None

    return tickets

def create_client(client_data: ClientCreate):
    try:
        client_dict = client_data.dict()
        print("Received client data:", client_dict)

        phone_str = client_dict.get('phone', '').strip()
        if not phone_str.isdigit() or len(phone_str) != 10:
            raise HTTPException(status_code=422, detail="Phone must be a 10-digit number")

        client_dict['phone'] = phone_str

        username = client_dict.get('username', '')
        if len(username) < 3:
            raise HTTPException(status_code=422, detail="Username must be at least 3 characters")

        for field in ['username', 'email', 'password', 'phone']:
            if not client_dict.get(field):
                raise HTTPException(status_code=422, detail=f"Missing or empty field: {field}")

        import re
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$'
        if not re.match(pattern, client_dict['password']):
            raise HTTPException(status_code=422, detail="Password must contain lowercase, uppercase, and number")

        now = datetime.utcnow()
        client_dict['created_at'] = now
        client_dict['updated_at'] = now

        if not client_dict.get('super_user_id'):
            client_dict['super_user_id'] = ''

        result = users_collection.insert_one(client_dict)
        return {"message": "Client added", "id": str(result.inserted_id)}

    except Exception as e:
        print("Exception in create_client:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users")
def get_clients():
    clients = list(users_collection.find())
    for client in clients:
        client["_id"] = str(client["_id"])
    return clients

@app.post("/users")
def add_client(client: ClientCreate):
    return create_client(client)

def generate_unique_device_id():
    while True:
        new_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not devices_collection.find_one({"device_id": new_id}):
            return new_id

@app.post("/devices")
def create_device(device: DeviceCreate):
    user = users_collection.find_one({"email": device.user_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_device = device.dict()

    if not new_device.get("device_id"):
        new_device["device_id"] = generate_unique_device_id()
    else:
        new_device["device_id"] = new_device["device_id"].upper()

    if new_device.get("latitude") is None:
        new_device.pop("latitude", None)
    if new_device.get("longitude") is None:
        new_device.pop("longitude", None)

    new_device["user_id"] = user["_id"]
    new_device["created_at"] = datetime.utcnow()
    new_device["updated_at"] = datetime.utcnow()

    result = devices_collection.insert_one(new_device)
    return {"message": "Device added", "device_id": str(result.inserted_id)}

@app.get("/is_consultant")
def is_consultant(email: str):
    cons = cons_collection.find_one({"email": email})
    return {"is_consultant": bool(cons)}

@app.put("/tickets/by_id_ticket/{id_ticket}")
def update_ticket_by_id_ticket(id_ticket: str, update_data: dict):
    try:
        result = tickets_collection.update_one(
            {"id_ticket": id_ticket},
            {"$set": update_data}
        )
        if result.modified_count == 1:
            return {"message": "Ticket updated"}
        else:
            return {"message": "No ticket updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/tickets")
def delete_user_tickets(user_email: str = Query(...)):
    if not user_email:
        raise HTTPException(status_code=400, detail="Email is required")

    result = tickets_collection.delete_many({"user_email": user_email})
    return {"message": f"{result.deleted_count} ticket(s) deleted"}

@app.get("/user_device_stats")
def get_device_stats(email: EmailStr):
    print(f"[DEBUG] Received email param: {email}")
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reserved = user.get("device_reserved", 0)
    installed = user.get("device_installed", 0)

    return {
        "device_reserved": reserved,
        "device_installed": installed,
        "percentage": round((reserved / installed) * 100) if installed else 0
    }

@app.get("/user_device_stats_connected")
def get_device_stats_connected(email: EmailStr):
    print(f"[DEBUG] Received email param: {email}")
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    connected = user.get("device_connected", 0)
    installed = user.get("device_installed", 0)

    return {
        "device_connected": connected,
        "device_installed": installed,
        "percentage2": round((connected/ installed) * 100) if installed else 0
    }

@app.get("/map/load")
def load_map_dots(email: EmailStr = Query(...)):
    is_consultant = cons_collection.find_one({"email": email})

    if is_consultant:
        all_docs = list(map_collection.find())
        all_dots = []
        for doc in all_docs:
            all_dots.extend(doc.get("dots", []))
        return {"dots": all_dots}
    else:
        doc = map_collection.find_one({"email": email})
        return {"dots": doc.get("dots", [])} if doc else {"dots": []}

@app.post("/map/save")
def save_map_dots(payload: SaveDotsPayload):
    map_collection.update_one(
        {"email": payload.email},
        {"$set": {"dots": [dot.dict() for dot in payload.dots]}},
        upsert=True
    )
    return {"message": "Map dots saved successfully"}

# New consolidated endpoint
@app.get("/device_stats")
def get_consolidated_device_stats(email: EmailStr):
    print(f"[DEBUG] Received email param: {email}")
    
    # Check if user is consultant
    is_consultant = cons_collection.find_one({"email": email})
    
    if is_consultant:
        # Consultant gets aggregated stats from all users
        pipeline = [
            {"$group": {
                "_id": None,
                "total_reserved": {"$sum": "$device_reserved"},
                "total_installed": {"$sum": "$device_installed"},
                "total_connected": {"$sum": "$device_connected"}
            }}
        ]
        result = list(users_collection.aggregate(pipeline))
        
        if result:
            stats = result[0]
            reserved = stats["total_reserved"]
            installed = stats["total_installed"]
            connected = stats["total_connected"]
            
            return {
                "device_reserved": reserved,
                "device_installed": installed,
                "device_connected": connected,
                "percentage_reserved": round((reserved / installed) * 100) if installed else 0,
                "percentage_connected": round((connected / installed) * 100) if installed else 0
            }
        else:
            return {
                "device_reserved": 0,
                "device_installed": 0,
                "device_connected": 0,
                "percentage_reserved": 0,
                "percentage_connected": 0
            }
    else:
        # Regular user gets their own stats
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        reserved = user.get("device_reserved", 0)
        installed = user.get("device_installed", 0)
        connected = user.get("device_connected", 0)

        return {
            "device_reserved": reserved,
            "device_installed": installed,
            "device_connected": connected,
            "percentage_reserved": round((reserved / installed) * 100) if installed else 0,
            "percentage_connected": round((connected / installed) * 100) if installed else 0
        }
   
@app.get("/tickets/unresolved_count")
def count_unresolved_tickets():
    query = {"status": {"$ne": "Répondu"}}
    count = tickets_collection.count_documents(query)
    return {"unresolved_count": count}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.post("/responses")
def create_response(response: ResponseModel):
    data = response.dict()
    data["created_at"] = datetime.utcnow()
    result = responses_collection.insert_one(data)
    return {"inserted_id": str(result.inserted_id)}

@app.get("/responses", response_model=List[ResponseModel])
def get_all_responses():
    responses = list(responses_collection.find())
    return responses


@app.get("/responses/by_user")
def get_responses_by_user(email: EmailStr = Query(...)):
    # Find all devices that belong to this user by email
    devices = list(devices_collection.find({"user_email": email}, {"device_id": 1}))
    
    print(f"[DEBUG] Devices found for user {email}:")
    for device in devices:
        print(device)  # This will print each device document (with device_id and _id)

    if not devices:
        return []

    device_ids = [device["device_id"] for device in devices]

    # Find all responses matching these device_ids
    responses = list(responses_collection.find({"device_id": {"$in": device_ids}}))

    for r in responses:
        r["_id"] = str(r["_id"])
    
    return responses
@app.delete("/responses/by_user")
def delete_responses_by_user(email: EmailStr = Query(...)):
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_devices = list(devices_collection.find({"owner_email": email}))
    device_ids = [device["device_id"] for device in user_devices]

    if not device_ids:
        return {"deleted_count": 0}

    result = responses_collection.delete_many({"device_id": {"$in": device_ids}})
    return {"deleted_count": result.deleted_count}

from bson import ObjectId

@app.delete("/users/{user_id}")
def delete_client(user_id: str):
    try:
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
        return {"message": "Client deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@app.put("/users/{user_id}")
def update_client(user_id: str, updated_client: ClientCreate):
    try:
        updated_data = updated_client.dict(exclude_unset=True)
        updated_data["updated_at"] = datetime.utcnow()

        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updated_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")

        return {"message": "Client updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
