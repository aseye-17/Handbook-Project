# This file makes the routes directory a Python package
from fastapi import APIRouter

router = APIRouter()

# Import route modules here to register them with the router
from . import auth, users, courses
