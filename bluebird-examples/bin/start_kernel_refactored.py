#!/usr/bin/env python

import getpass
import sys
import os
import sys
import json
import pprint as pp
import threading
from datetime import datetime
from collections import OrderedDict

# start compatibility with IPython Jupyter 4.0
try:
  from jupyter_client import manager
except ImportError:
  from IPython.kernel import manager

# python3/python2 nonsense
try:
  from Queue import Empty
  import Queue
except:
  from queue import Empty
  import queue as Queue

default_timeout = 0.01

def json_serial(obj):
  '''JSON serializer for objects not serializable by default json code'''

  if isinstance(obj, datetime):
    serial = obj.isoformat()
    return serial

  raise TypeError("Type %s not serializable" % type(obj))


def add_input(input_queue):
  '''Read a single line from stdin, adding it to our input queue to be processed by the main loop'''
  while True:
    input_queue.put(sys.stdin.readline())


def apply_patches():
  '''Attempt to find and execute `python-patch.py` which populates session-specific helper code into our Python client'''
  dirname = os.path.dirname(os.path.abspath(__file__))
  python_patch_file = os.path.join(dirname, "python-patch.py")
  kernel_client.execute("%run " + python_patch_file, {"silent": True, "store_history": False})


def set_working_directory(wd=None):
  '''set working directory (if present)'''
  if wd:
    kernel_client.execute("cd %s" % wd)


def start_main_thread():
  '''
    *Starts the main consumer thread.*
    The Main thread consumes lines from `stdin` (via `add_line`) and places them into `input_queue` to be processed
    by the Kernel.
  '''
  input_queue = Queue.Queue()

  # TODO: More robust failure handline for this thread
  input_thread = threading.Thread(target=add_input, args=(input_queue,))
  input_thread.daemon = True
  input_thread.start()

  # Report that startup is complete
  write_obj_to_stdout({"id": "startup-complete", "status": "complete"})

  return input_queue


def unwrap_payload(line):
  '''Deserialize `line` from JSON string into Python dict object. Set defaults where necessary'''
  payload = json.loads(line)

  return {
    "uid": payload["id"],
    "args":       payload.get("args", []),
    "kwargs":     payload.get("kwargs", {}),
    "method":     payload.get("method", False),
    "target_str": payload.get("target", "client"),
    "exec_eval":  payload.get("exec_eval", False)
  }


def write_obj_to_stdout(obj, default=None):
  '''Helper function to simplify serializing and writing objects to `stdout`'''
  return sys.stdout.write(json.dumps(obj, default=default) + '\n')


def process_request(request_payload, kernel_manager, kernel_client):
  '''
  Determine type of request, and dispatch relevant action in the IPython Kernel.

   action_types:
    - method evaluation: `request_payload["method"]`
    - simple code execution: `request_payload["exec_eval"]`

  :param request_payload: Python dictionary containing extracted request params
  :param kernel_manager: IPython Kernel Manager
  :param kernel_client:  IPython Kernel Client
  :return:
  '''

  if request_payload['target_str'] == "manager":
    target = kernel_manager
  else:
    target = kernel_client

  if request_payload["method"]:
    if getattr(target, method, False):
      result = getattr(target, method)(*request_payload["args"], **request_payload["kargs"])

      write_obj_to_stdout({
        "source":            "link",
        "result":            result,
        "id": request_payload["uid"]
      })
    else:
      write_obj_to_stdout({
        "error":             "Missing method " + request_payload["method"],
        "id": request_payload["uid"]
      })

  if request_payload["exec_eval"]:
    result = eval(request_payload["exec_eval"])
    write_obj_to_stdout({
      "source":            "eval",
      "result":            result,
      "id": request_payload["uid"]
    })


def write_response(kernel_client):
  _write_iopub_response(kernel_client)
  _write_shell_response(kernel_client)
  _write_stdin_response(kernel_client)

def _write_iopub_response(kernel_client):
  try:
    acceptable_types = [
      "execute_input",
      "stream",
      "display_data",
      "error",
      "execute_result",
      "execute_reply",
      "complete_reply"
    ]

    while True:
      data = kernel_client.get_iopub_msg(timeout=default_timeout)

      if data.get("msg_type") in acceptable_types:
        write_obj_to_stdout({
          "source": "iopub",
          "result": data
        }, default=json_serial)
        sys.stdout.flush()

  except Empty:
    pass


def _write_shell_response(kernel_client):
  try:
    write_obj_to_stdout({
      "source": "shell",
      "result": kernel_client.get_shell_msg(timeout=default_timeout)
    }, default=json_serial)

  except Empty:
    pass


def _write_stdin_response(kernel_client):
  try:
    write_obj_to_stdout({
      "source": "stdin",
      "result": kernel_client.get_stdin_msg(timeout=default_timeout)
    }, default=json_serial)

  except Empty:
    pass

def kernel(wd=None, verbose=0):
  '''Setup ipython kernel and configure it'''

  apply_patches()
  set_working_directory(wd)

  input_queue = start_main_thread()
  kernel_manager, kernel_client = manager.start_new_kernel(extra_arguments=["--matplotlib='inline'"])

  while True:
    if not input_queue.empty():
      request_input_line = input_queue.get().strip()
      request_payload = unwrap_payload(request_input_line)

      process_request(request_payload, kernel_manager, kernel_client)

    write_response(kernel_client)


if __name__ == "__main__":
  wd = None
  if len(sys.argv) > 1:
    wd = sys.argv[1]

  kernel(wd, verbose=2)
