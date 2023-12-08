import json
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from entity.User import User,HealthData
from entity.Doctor import Doctor
from jose import JWTError, jwt
from fastapi import Depends, HTTPException,status
from fastapi.responses import JSONResponse, Response
from fastapi import Request
from datetime import datetime, timedelta
from typing import Optional, Union
import logging 

app = FastAPI()



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "IYAwM+O69b20dBSjHAiBeX6NdHu6Ca9nklSc8A+cn9Y="
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
# OAuth2PasswordBearer is used to get the token from the request
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Function to create an access token
class Token(BaseModel):
    access_token: str
    token_type: str

    # Function to create an access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get('role')
        if username is None:
            raise credentials_exception
        if role =="user":
         user = users_collection.find_one({"username": username})
         if user is None:
            raise credentials_exception
         return {"username":username,"role":role}
        if role == "doctor":
         doctor = doctors_collection.find_one({"username": username})
         if doctor is None:
            raise credentials_exception
         return {"username":username,"role":role}
        
    except JWTError:
        raise credentials_exception

def get_role(username: str):
    # Try to find the user in the users_collection
    user = users_collection.find_one({"username": username})
    
    # If the user is not found in the users_collection, try doctors_collection
    if user is None:
        doctor = doctors_collection.find_one({"username": username})
        
        # If the doctor is not found either, raise an exception
        if doctor is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        # If the doctor is found, return the role
        return "doctor"
    
    # If the user is found, return the role
    return "user"

@app.get("/")
async def root():
    return {"Welcome to the health monitoring app"}

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["HealthData"]
users_collection = db["Users"]
doctors_collection = db["Doctors"]


@app.post("/register")
async def register(request:Request):
    # Check if the username already exists
    data = await request.json()
        #measures=entity.Measures(**data.get(data["measures"], {})),
    if data["role"] == "doctor":

        doctor = Doctor(
            username=data["username"],
            password=data["password"],
            email=data["email"],
            role=data["role"]
        )
        if doctors_collection.find_one({"username": data['username']}):
            raise HTTPException(status_code=400, detail="Username already registered")
        doctors_collection.insert_one(doctor.dict())
        return 'Registered !'
    else: 
        user = User(
        username=data["username"],
        password=data['password'],
        email=data["email"],
        role=data.get("role", "user"),
        emergencyContactEmail=data["emergencyContactEmail"],
        DoctorContact= data.get(data["DoctorContact"],""),
        health_data=HealthData(**data["health_data"]))
        if users_collection.find_one({"username": data["username"]}):
            raise HTTPException(status_code=400, detail="Username already registered")
        users_collection.insert_one(user.dict())

    if data["role"]== "user" and "DoctorContact" in data:
        doctor_username = data["DoctorContact"]
        existing_doctor = doctors_collection.find_one({"username": doctor_username})
        if existing_doctor:
            doctors_collection.update_one({"username": doctor_username}, {"$push": {"patients": user.username}})
            users_collection.update_one({"username": user.username}, {"$push": {"doctors": doctor_username}})
        else:
            user.DoctorContact = ""
        return 'Registered !'

    
# Updated login path to set the cookie
@app.post("/login")
async def login(request: Request):
    # Validate username and password (compare hashed password with stored hash)
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    role = get_role(username)
    # Try to find the user in the users_collection
    if role == 'user':
        user = users_collection.find_one({"username": username})
    if role == "doctor":
        user = doctors_collection.find_one({"username": username})     
           
    if user and pwd_context.verify(password, user["password"]):
      
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"] ,"role": role}, expires_delta=access_token_expires
        )   
        return {"access_token": access_token, "token_type": "bearer"}
    else :
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
@app.get("/user/me/")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    # Access the current user
    return current_user


# @app.get("/users/{username}")
# async def get_user(username: str):
#     user = users_collection.find_one({"username": username})
    
#     if user:
#         return {
#             "username": user["username"],
#             "password": user["password"],
#             "email": user["email"],
#             "emergencyContactEmail": user["emergencyContactEmail"]
#         }
#     else:
#         raise HTTPException(status_code=404, detail="User not found")
    

@app.post("/add_doctor/{doctor_username}")
async def add_doctor(
    doctor_username: str,
    current_user: dict = Depends(get_current_user),
):
    # Check if the current user is a patient
    if current_user['role'] != "user":
        raise HTTPException(
            status_code=403,
            detail="Only patients can add doctors",
        )

    # Check if the doctor exists
    doctor = doctors_collection.find_one({"username": doctor_username})

    if doctor is None:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found",
        )
    


   # Add the patient to the doctor's pending list
    doctors_collection.update_one(
        {"username": doctor["username"]},
        {"$addToSet": {"pending_patient": current_user['username']}},
    )

    # Add the doctor to the user's pending_doctors list
    users_collection.update_one(
        {"username": current_user['username']},
        {"$addToSet": {"pending_doctors": doctor_username}},
    )
    return "Request is pending"

@app.post("/select_pending_user")
async def select_pending_user(request: Request, current_doctor: dict = Depends(get_current_user)):
    data = await request.json()
    patient_username = data["username"]
    status = data["status"]

    # Check if the current user is a doctor
    if current_doctor['role'] != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can select pending users",
        )

    # Check if the patient exists
    patient = users_collection.find_one({"username": patient_username})
    doctor = doctors_collection.find_one({"username": current_doctor['username']})

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    # Check if the patient is in the doctor's pending list
    if patient_username not in doctor.get('pending_patient', []):
        raise HTTPException(
            status_code=400,
            detail="Patient not in pending list",
        )

    # Update the doctor's patients list or remove from pending based on the status
    if status == "accept":
        # Initialize if needed
        doctor["patients"] = doctor.get("patients", [])
        doctor["patients"].append(patient_username)
        doctors_collection.update_one(
            {"username": current_doctor["username"]},
            {
                "$addToSet": {"patients": patient_username},
            },
        )

        # Add the doctor to the user's doctors list
        # Initialize if needed
        patient["doctors"] = patient.get("doctors", [])
        patient["doctors"].append(current_doctor['username'])
        users_collection.update_one(
            {"username": patient_username},
            {
                "$addToSet": {"doctors": current_doctor['username']},
            },
        )

    # Remove the patient from the doctor's pending list
    if "pending_patient" in doctor:
        doctor["pending_patient"].remove(patient_username)

    # Remove the doctor from the user's pending_doctors list
    if "pending_doctors" in patient:
        patient["pending_doctors"].remove(current_doctor["username"])

    # Update the pending_doctor and pending_patient in the database
    users_collection.update_one(
        {"username": patient_username},
        {
            "$pull": {"pending_doctors": current_doctor["username"]},
        },
    )

    doctors_collection.update_one(
        {"username": current_doctor["username"]},
        {
            "$pull": {"pending_patient": patient_username},
        },
    )

    return {"message": "Patient Added Successfully"}

