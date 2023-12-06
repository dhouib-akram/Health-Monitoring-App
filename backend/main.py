from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from entity import User,Doctor
from jose import JWTError, jwt
from fastapi import Depends, HTTPException,status
from fastapi.responses import JSONResponse, Response
from fastapi import Request
from datetime import datetime, timedelta
from typing import Optional
import logging 

app = FastAPI()
logging.basicConfig(level=logging.DEBUG)

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

class TokenData(BaseModel):
    username: Optional[str] = None
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
        if username is None:
            raise credentials_exception
        user = users_collection.find_one({"username": username})
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception
# def hash_pass(password: str):
#     return pwd_context.hash(password)
@app.get("/")
async def root():
    return {"Welcome to the health monitoring app"}

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["helath"]
users_collection = db["user"]
doctors_collection = db["doctors"]

@app.post("/register")

async def register(request:Request):
    # Check if the username already exists
    data = await request.json()
        #measures=entity.Measures(**data.get(data["measures"], {})),
    if data["role"] == "doctor":
        if doctors_collection.find_one({"username": data['username']}):
            raise HTTPException(status_code=400, detail="Username already registered")
        doctor = Doctor.Doctor(
            username=data["username"],
            password=data["password"],
            email=data["email"],
            role=data["role"]
        )
        doctors_collection.insert_one(doctor.dict())
    else: 
        user = User.User(
        username=data["username"],
        password=data['password'],
        email=data["email"],
        role=data.get("role", "user"),
        emergencyContactEmail=data["emergencyContactEmail"],
        DoctorContact= data.get(data["DoctorContact"],""),
        health_data=User.HealthData(**data["health_data"]))
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


# Updated login path to set the cookie
@app.post("/login")
async def login(request: Request):
    # Validate username and password (compare hashed password with stored hash)
    data = await request.form()
    username = data.get("username")
    password = data.get("password")
    user = users_collection.find_one({"username": username})
    user = users_collection.find_one({"username": username})
    if user and pwd_context.verify(password, user["password"]):
      
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else :
        raise HTTPException(status_code=400, detail="Incorrect username or password")