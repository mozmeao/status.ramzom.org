from decouple import config

DEBUG = config('DEBUG', default=True, cast=bool)

USERNAME = config('GITHUB_USERNAME')
PASSWORD = config('GITHUB_PASSWORD')
GITHUB_ORG = config('GITHUB_ORG')
GITHUB_REPOSITORY = config('GITHUB_REPOSITORY')

STATUS_FILE = 'status.yml'

DMS_URL = config('DMS_URL')
DMS_API_KEY = config('DMS_API_KEY')

NEW_RELIC_API_KEY = config('NEW_RELIC_API_KEY')
NEW_RELIC_QUERY_KEY = config('NEW_RELIC_QUERY_KEY')

DMS_PING_URL = config('DMS_PING_URL')
