from typing import Dict, List
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel ,EmailStr

import bcrypt

##

from pydantic import BaseModel

class HealthData(BaseModel):
    age: int
    height: int
    weight: int
    gender: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int
class SensorData(BaseModel):
    ap_hi: int = 100  
    ap_lo: int = 80  
    saturation_data: int = 78  
    heart_rate_data: int = 60  
    temp:int = 37


class User(BaseModel):
    username: str
    password: str
    email: EmailStr
    emergencyContactEmail: EmailStr
    health_data: HealthData
    pending_doctors: List[str] = []  # Include the pending_doctors field with a default empty list of usernames
    doctors: List[str] = []  # Include the doctors field with a default empty list of usernames
    measure: List[SensorData] =[]
    prediction:int = 0
    health_status: Dict = {}
    def __init__(self, **data):
        super().__init__(**data)
        self.password = self.hash_password(self.password)

    def get_username(self): 
        return self.username

    def get_password(self):
        return self.password

    def get_email(self):
        return self.email

    def get_emergency_contact_email(self):
        return self.emergencyContactEmail

    @staticmethod
    def hash_password(password: str):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')
    
    def update_password(self, new_password: str):
        # Hash the new password and update the password property
        self.password = self.hash_pass(new_password)