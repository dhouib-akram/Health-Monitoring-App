from urllib import request
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from entity.User import User
from jose import JWTError, jwt
from fastapi.responses import JSONResponse, Response
from fastapi import Request

from datetime import datetime, timedelta
from typing import Annotated
from typing import Union
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

import joblib
import sys
sys.path.append("..")
from heart_attack_prediction.preprocess.preprocess_data import preprocess
# loaded_rf_model = joblib.load('rf_new.joblib')


app = FastAPI()

# Set up CORS
origins = [
     "*",          # Allow requests from localhost during development
  # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


app = FastAPI()

# def hash_pass(password: str):
#     return pwd_context.hash(password)
@app.get("/")
async def root():
    return {"Welcome to the health monitoring app"}

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["HealthData"]
users_collection = db["Users"]





@app.post("/register")
async def register(request:Request):
    # Check if the username already exists
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    emergencyContactEmail = data.get("emergencyContactEmail")
    if users_collection.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already registered")
        # Store user data in MongoDB
    user_data = {"username": username, "password": password, 'email': email,"emergencyContactEmail": emergencyContactEmail}
    users_collection.insert_one(user_data)

    return {"message": "User registered successfully"}


# Updated login path to set the cookie
@app.post("/token")
async def login(request: Request):
    # Validate username and password (compare hashed password with stored hash)
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    user = users_collection.find_one({"username": username})
    if user and pwd_context.verify(password, user["password"]):
      
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else :
        raise HTTPException(status_code=400, detail="Incorrect username or password")

@app.get("/users/{username}")
async def get_user(username: str):
    user = users_collection.find_one({"username": username})
    
    if user:
        return {
            "username": user["username"],
            "password": user["password"],
            "email": user["email"],
            "emergencyContactEmail": user["emergencyContactEmail"]
        }
    else:
        raise HTTPException(status_code=404, detail="User not found")

# Endpoint that requires authentication
@app.get("/user/me/", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    # Access the current user
    return current_user

# data=    {
#   "age": 54,
#   "height":168,
#   "weight": 62,
#   "gender": 2,
#   "ap_hi": 110,
#   "ap_lo": 80,
#   "cholesterol": 1,
#   "gluc": 1,
#   "smoke": 0,
#   "alco": 1,
#   "active": 0,

# }
@app.post('/predict')
async def predict_heart_attack(request: Request):
    # Convert input data to a numpy array for prediction
    data = await request.json()
    data_dict = {key: int(value) for key, value in data.items()}
 
    loaded_rf_model = joblib.load('rf_model_73.joblib')

    # Make predictions using the loaded model
    prediction = loaded_rf_model.predict(preprocess(data_dict))
    # Return the prediction as a response
    return {"prediction": int(prediction)}