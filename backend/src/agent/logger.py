import logging
import os
import asyncio
# from logging.handlers import RotatingFileHandler
from concurrent_log_handler import ConcurrentRotatingFileHandler as RotatingFileHandler

def setup_logger(name: str, log_file: str = "app.log", level=logging.INFO) -> logging.Logger:
    log_dir = os.path.dirname(log_file)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir, exist_ok=True)
    
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    file_handler = RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=3)
    file_handler.setFormatter(formatter)
    
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    logger.propagate = False
    
    return logger

async def log_async(logger: logging.Logger, level: str, message: str):
    """Run any logger call in a separate thread to avoid blocking the event loop."""
    log_func = getattr(logger, level, logger.info)
    await asyncio.to_thread(log_func, message)