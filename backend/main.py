from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from entity.User import User,HealthData
from entity.Doctor import Doctor
from jose import JWTError, jwt
from fastapi import Depends, HTTPException,status
from fastapi.responses import JSONResponse, Response
from fastapi import Request
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union
import joblib
import sys
import bcrypt
import paho.mqtt.client as mqtt

import time
import threading
sys.path.append("..")
broker_address = "91.121.93.94"  

# MQTT topics to subscribe to
mqtt_pressure_topic = "device/data/pressure"
mqtt_saturation_topic = "device/data/saturation"
mqtt_heart_rate_topic = "device/data/heartRate"
mqtt_command_topic = "device/command"

# Create a dictionary to store the data
sensor_data = {
    "ap_hi": 0,
    "ap_lo":0,
    "saturation_data": 0,
    "heart_rate_data": 0
}
sensor_data_lock = threading.Lock()

def update_sensor_data(msg):
    with sensor_data_lock:
        if msg.topic == mqtt_pressure_topic:
            sensor_data["ap_hi"] = int(msg.payload.decode().split(":")[1])
        elif msg.topic == mqtt_pressure_topic:
            sensor_data["ap_lo"] = int(msg.payload.decode().split(":")[1])
        elif msg.topic == mqtt_saturation_topic:
            saturation_value = int(msg.payload.decode().split(":")[1])
            sensor_data["saturation_data"] = saturation_value
        elif msg.topic == mqtt_heart_rate_topic:
            sensor_data["heart_rate_data"] = int(msg.payload.decode().split(":")[1])

# Callback when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.publish(mqtt_command_topic, "1")
    client.subscribe([(mqtt_pressure_topic, 0), (mqtt_saturation_topic, 0), (mqtt_heart_rate_topic, 0)])


def on_message(client, userdata, msg):
    print(f"Received message from topic '{msg.topic}': {msg.payload.decode()}")
    update_sensor_data(msg)
sys.path.append("..")

from heart_attack_prediction.preprocess.preprocess_data import preprocess

app = FastAPI()
# Allow all origins and set CORS headers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to fetch user data from the database
def get_patient_data(username: str):
    user_data = users_collection.find_one({"username": username})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data
def verify_password(entered_password, hashed_password):
    return bcrypt.checkpw(entered_password.encode('utf-8'), hashed_password.encode('utf-8'))
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

# Register a new user to a data base (doctor or user)
@app.post("/register")
async def register(request:Request):
    # Check if the username already exists
    data = await request.json()

    if data["role"] == "doctor":

        doctor = Doctor(
            username=data["username"],
            password=data["password"],
            email=data["email"],
        )
        if doctors_collection.find_one({"username": data['username']}):
            raise HTTPException(status_code=400, detail="Username already registered")
        doctors_collection.insert_one(doctor.dict())
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": data["username"] ,"role": data['role']}, expires_delta=access_token_expires
        )   
        return {"access_token": access_token, "token_type": "bearer"}
    else: 
        user = User(
        username=data["username"],
        password=data['password'],
        email=data["email"],
        emergencyContactEmail=data["emergencyContactEmail"],
        health_data=HealthData(**data["health_data"]))
        if users_collection.find_one({"username": data["username"]}):
            raise HTTPException(status_code=400, detail="Username already registered")
        users_collection.insert_one(user.dict())
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub":data["username"] ,"role": data['role']}, expires_delta=access_token_expires
        )   
        return {"access_token": access_token, "token_type": "bearer"}


    
# Login and create token to set the cookie
@app.post("/login")
async def login(request: Request):
    # Validate username and password (compare hashed password with stored hash)
    data = await request.json()
    username = data["username"]
    password = data["password"]
    role = get_role(username)
    # Try to find the user in the users_collection
    if role == 'user':
        user = users_collection.find_one({"username": username})
    if role == "doctor":
        user = doctors_collection.find_one({"username": username})     
           
    if user and verify_password(password, user["password"]):
      
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"] ,"role": role}, expires_delta=access_token_expires
        )   
        return {"access_token": access_token, "token_type": "bearer"}
    else :
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
# Access the current user's information username and role 
@app.get("/")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

#This endpoint retrieves and returns information about the currently logged-in user
@app.get("/user/info")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    role=current_user['role']
    if role == 'user':
        user = users_collection.find_one({"username":current_user['username'] })
        return User(**user)
    if role == "doctor":
        doctor = doctors_collection.find_one({"username": current_user['username']}) 
        return Doctor(**doctor)

    #This endpoint allows doctors to retrieve information about a specific user, but only if the user is in their list of patients; 
    # otherwise, it raises an error indicating that only the doctor's patients' information is accessible.
@app.get("/user/me/")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
@app.get("/get_user/{username}")
async def get_user(username:str,current_user: dict = Depends(get_current_user)):
    # Check if the current user is a patient
    if current_user['role'] == "user":
        raise HTTPException(
            status_code=403,
            detail="Only Doctors can see patient info",
        )
    
        # Check if the specified user is in the doctor's patients list
    doctor = doctors_collection.find_one({"username": current_user['username']})
    if doctor and "patients" in doctor and username in doctor["patients"]:
        # User is in the doctor's patients list, retrieve and return the user's information
        user = users_collection.find_one({"username": username})
        if user:
            return User(**user)
        else:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )
    else:
        raise HTTPException(
            status_code=403,
            detail="You can only view information of your patients",
        )
    
#This endpoint retrieves a list of pending invitations, 
# either pending doctors for a user or pending patients for a doctor, based on the user's role.
@app.get('/pending_invitations')
async def get_pending_invitations(current_user: dict = Depends(get_current_user)):
    role=current_user['role']
    if role == 'user':
        user = users_collection.find_one({"username":current_user['username'] })
        return user['pending_doctors']
    if role == "doctor":
        doctor = doctors_collection.find_one({"username": current_user['username']}) 
        return doctor['pending_patient']

#This endpoint allows a patient to send a request to add a doctor.
#  It checks if the doctor exists, and if so, adds the patient to the doctor's pending list and the doctor to the user's pending doctors list.
#  The request is marked as pending, awaiting the doctor's approval.

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

#This endpoint allows a doctor to accept or decline a pending patient request.
#If accepted, it adds the patient to the doctor's patients list and the doctor to the patient's doctors list. 
#It removes the patient from the doctor's pending list and the doctor from the patient's pending doctors list (if status is acepted/declined).

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

#This endpoint retrieves a list of all doctors in the database
@app.get("/get_doctors", response_model=List[Doctor])
async def get_doctors():
    doctors = list(doctors_collection.find())
    return doctors

# Define a route to handle the GET request without authentication
@app.post("/getM/")
async def get_sensor_data(current_user: dict = Depends(get_current_user)):

    if current_user['role'] != "user":
        raise HTTPException(
            status_code=403,
            detail="Only users can measure")
    else: 
    
        mqtt_client = mqtt.Client()
        # Set the callbacks
        mqtt_client.on_connect = on_connect
        mqtt_client.on_message = on_message  

        try:
            # Connect to the MQTT broker
            mqtt_client.connect(broker_address, 1883, 60)

            # Wait for the connection to establish
            mqtt_client.loop_start()
            while not mqtt_client.is_connected():
                time.sleep(1)

            # Wait for a short duration to receive messages
            time.sleep(1)  

        finally:
            # Disconnect from the MQTT broker
            mqtt_client.loop_stop()

        with sensor_data_lock:
            # return sensor_data
            print(sensor_data)
            print(type(sensor_data))
            users_collection.update_one(
                {"username": current_user['username']},
                {
                    "$addToSet": {"measure": sensor_data},
                })
            return "done"
# Function to formulate JSON structure for prediction
def formulate_prediction_data(user_data):
    ap_hi = user_data["measure"][-1].get("ap_hi")
    ap_lo = user_data["measure"][-1].get("ap_lo")

    health_data = user_data["health_data"]

    prediction_data = {
        "age": health_data.get("age", 0),
        "height": health_data.get("height", 0),
        "weight": health_data.get("weight", 0),
        "gender": health_data.get("gender", 0),
        "ap_hi": ap_hi,
        "ap_lo": ap_lo,
        "cholesterol": health_data.get("cholesterol", 0),
        "gluc": health_data.get("gluc", 0),
        "smoke": health_data.get("smoke", 0),
        "alco": health_data.get("alco", 0),
        "active": health_data.get("active", 0),
    }

    return prediction_data
@app.post('/predict')
async def predict_heart_attack( current_user: dict = Depends(get_current_user)):
    # Convert input data to a numpy array for prediction
    # Fetch user data from the database
    user_data = get_patient_data(current_user["username"])
    # Formulate JSON structure for prediction
    prediction_data = formulate_prediction_data(user_data)   
 
    loaded_rf_model = joblib.load('rf_model_73.joblib')
 
    # Make predictions using the loaded model
    prediction = loaded_rf_model.predict(preprocess(prediction_data))
      # Add predicted value to user data
    user_data["prediction"] = int(prediction)
    # Update user data in the database
    users_collection.update_one(
        {"username": current_user['username']},
        {"$set": user_data}
    )
    # Return the prediction as a response
    return {"prediction": int(prediction)}

# Function to get health status
def get_health_status(health_data: Dict,measure_data: Dict):
   

    # Calculate BMI
    bmi = health_data.get("weight", 0) / ((health_data.get("height", 0) / 100) ** 2)

    # Analyze BMI
    bmi_status = "Normal"
    if bmi < 18.5:
        bmi_status = "Underweight"
    elif 18.5 <= bmi < 24.9:
        bmi_status = "Normal"
    elif 25 <= bmi < 29.9:
        bmi_status = "Overweight"
    elif bmi >= 30:
        bmi_status = "Obese"

    # Analyze Blood Pressure
    ap_hi = measure_data.get("ap_hi", 0)
    ap_lo = measure_data.get("ap_lo", 0)
    
    pressure_status = "Normal"
    if ap_hi >= 140 or ap_lo >= 90:
        pressure_status = "High"
    elif ap_hi <= 90 or ap_lo <= 60:
        pressure_status = "Low"

    # Analyze Saturation Data
    saturation_data = measure_data.get("saturation_data", 0)

    saturation_status = "Normal"
    if saturation_data < 95:
        saturation_status = "Low"

    # Compile the results
    health_status = {
        "bmi": bmi,
        "bmi_status": bmi_status,
        "blood_pressure_status": pressure_status,
        "saturation_status": saturation_status
    }

    # Store the health status back into user_data
    user_data["health_status"] = health_status

    # Update user data in the database
    users_collection.update_one(
        {"username": user_data['username']},
        {"$set": {"health_status": health_status}}
    )

    return health_status
    # Endpoint to get user health status
@app.get("/user/health-status", response_model=Dict)
async def get_user_health_status(request: Request, current_user: dict = Depends(get_current_user)):
    # Fetch user data from the database
    user_data = users_collection.find_one({"username":current_user['username'] })
    health_data = user_data.get("health_data")
    measure_data = user_data.get("measure")[-1]
        

    # Get health status
    

    return {"health_data":health_data,"measure_data":measure_data}