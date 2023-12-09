from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel ,EmailStr

import bcrypt



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

class User(BaseModel):
    username: str
    password: str
    email: EmailStr
    emergencyContactEmail: EmailStr
    health_data: HealthData
    pending_doctors: list[str] = []  # Include the pending_doctors field with a default empty list of usernames
    doctors: list[str] = []  # Include the doctors field with a default empty list of usernames

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
        return hashed_password

    def update_password(self, new_password: str):
        # Hash the new password and update the password property
        self.password = self.hash_pass(new_password)