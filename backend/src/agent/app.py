# mypy: disable - error - code = "no-untyped-def,misc"
import pathlib
import json
import os
from fastapi import FastAPI, Response, Body, HTTPException, status, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from jose import jwt, JWTError
from datetime import datetime, timedelta
from agent.logger import log_async, setup_logger

logger = setup_logger("APP")

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "defaultsecretkey")
ALGORITHM = "HS256"

# Define the FastAPI app
app = FastAPI()

origins = [
    "https://ai-research.riskedgesolutions.com",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_users():
    users = {}
    for i in range(1,5):
        creds = os.getenv(f"USER{i}")
        if creds:
            username, password = creds.split(":")
            users[username] = password
    return users

USERS = load_users()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    username = form_data.username
    password = form_data.password
    
    if username not in USERS or USERS[username] != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
        
    token_data = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(hours=100),
    }
    
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    await log_async(logger, "info", f"USER LOGGED IN - USER: {username}")
    
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username not in USERS:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

def create_frontend_router(build_dir="../frontend/dist"):
    """Creates a router to serve the React frontend.

    Args:
        build_dir: Path to the React build directory relative to this file.

    Returns:
        A Starlette application serving the frontend.
    """
    build_path = pathlib.Path(__file__).parent.parent.parent / build_dir

    if not build_path.is_dir() or not (build_path / "index.html").is_file():
        print(
            f"WARN: Frontend build directory not found or incomplete at {build_path}. Serving frontend will likely fail."
        )
        # Return a dummy router if build isn't ready
        from starlette.routing import Route

        async def dummy_frontend(request):
            return Response(
                "Frontend not built. Run 'npm run build' in the frontend directory.",
                media_type="text/plain",
                status_code=503,
            )

        return Route("/{path:path}", endpoint=dummy_frontend)

    return StaticFiles(directory=build_path, html=True)


# Mount the frontend under /app to not conflict with the LangGraph API routes
app.mount(
    "/app",
    create_frontend_router(),
    name="frontend",
)


@app.post("/outreach")
# async def generate_outreach_message(input = Body(...)):
async def generate_outreach_message(input = Body(...), current_user: str = Depends(get_current_user)):
    try:
        from agent.outreach_agent import generate_content
        print(current_user)
        await log_async(logger, "info", f"CREATING OUTREACH MESSAGE - USER: {current_user}")
        response = await generate_content(input)
        
        return json.loads(response)
    except Exception as e:
        return {"error": str(e)}
