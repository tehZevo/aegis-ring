import getpass
from pathlib import Path
from oauthlib.oauth2 import MissingTokenError
import json

from ring_doorbell import Ring, Auth

#TODO: env
PROJECT_NAME = "Aegis/0.1"
TOKEN_PATH = "data/token.json"

token_file = Path(TOKEN_PATH)

def token_updated(token):
  #token_file.write_text(json.dumps(token))
  token_file.write_text(json.dumps(token.refresh_token)) #just write refresh token

def otp_callback():
  auth_code = input("2FA code: ")
  return auth_code

username = input("Username: ")
password = getpass.getpass("Password: ")
auth = Auth(PROJECT_NAME, None, token_updated)
try:
  auth.fetch_token(username, password)
except MissingTokenError:
  auth.fetch_token(username, password, otp_callback())
