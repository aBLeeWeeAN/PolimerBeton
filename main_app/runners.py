import asyncio
import threading

from .tasks import reset_client_attempts_async

def start_async_task():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(reset_client_attempts_async())

def start_task_runner():
    task_thread = threading.Thread(target=start_async_task, daemon=True)
    task_thread.start()