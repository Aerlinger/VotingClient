import pprint as pp
import json
import ast
import inspect
import types
import re

try:
  import pandas as pd
except:
  pd = None

try:
  import numpy as np
except:
  np = None

try:
  import pip
except:
  pip = None


def __get_docstrings(session, names, is_function):
  if is_function == True:
    dtype = "function"
  else:
    dtype = "---"

  docstrings = []

  for name in names:
    try:
      if name in session:
        docstring = session[name].__doc__
      else:
        docstring = eval(name, session).__doc__
    except:
      docstring = "no docstring provided"

    docstrings.append({
      "text":      name,
      "dtype":     dtype,
      "docstring": docstring,
    })

  print(json.dumps(docstrings))


def __is_code_finished(code):
  try:
    ast.parse(code)
    if "\\n" in code:
      return re.search('\\n\s+?$', code) is not None
    else:
      return True

  except Exception as e:
    return str(e)


def __get_variables(session):
  variables = {
    "list":      [],
    "dict":      [],
    "ndarray":   [],
    "DataFrame": [],
    "Series":    [],
    "function":  [],
    "other":     []
  }

  SPECIAL_VARS = ["In", "Out"]
  IPYTHON_VARS = ["get_ipython", "exit", "quit"]

  for variable_name in session.keys():
    # skip builtin variables
    if variable_name.startswith("_") or variable_name in SPECIAL_VARS or variable_name in IPYTHON_VARS:
      continue

    variable = session[variable_name]

    # skip modules
    elif isinstance(variable, types.ModuleType):
      continue

    elif isinstance(variable, list):
      variable_repr = "List of length %d" % len(variable)
    elif np and isinstance(variable, np.ndarray):
      shape = " x ".join([str(i) for i in variable.shape])
      variable_repr = "Array [%s]" % shape
    elif isinstance(variable, dict):
      variable_repr = "Dict with %d keys" % len(variable)
    elif pd and isinstance(variable, pd.DataFrame):
      variable_repr = "DataFrame [%d rows x %d cols]" % variable.shape
    elif pd and isinstance(variable, pd.Series):
      variable_repr = "Series [%d rows]" % variable.shape
    elif isinstance(variable, types.FunctionType):
      args = inspect.getargspec(variable)
      args = ", ".join(args.args)
      if len(args) > 40:
        args = args[:60] + "..."

      variable_repr = "def %s(%s)" % (variable_name, args)
    else:
      variables["other"].append({
        "name": variable_name,
        "repr": str(type(variable))
      })

      continue

    variable_type = str(type(variable))

    variables[variable_type].append({
      "name": variable_name,
      "repr": variable_repr
    })

  # Sort the variables by name and write them to JSON so we can echo back to the client
  for key in variables:
    variables[key] = sorted(variables[key], key=lambda x: "%s-%s" % (x['repr'], x['name']))

  print(json.dumps(variables))


def __get_packages():
  if not pip:
    print('[]')
    return

  installed_packages = pip.get_installed_distributions()
  packages = [{"name": i.key, "version": i.version} for i in installed_packages]
  installed_packages_list = sorted(packages, key=lambda x: x['name'])

  print(json.dumps(installed_packages_list))


def __pip_install(pkgname):
  if pip:
    print(pip.main(['install', pkgname]))
  else:
    print("Did not detect a pip installation on this machine.")
