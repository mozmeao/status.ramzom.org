from decouple import config

DEBUG = config('DEBUG', default=True, cast=bool)
VERSION = config('GIT_SHA', default='')

GITHUB_TOKEN = config('GITHUB_TOKEN')
GITHUB_ORG = config('GITHUB_ORG')
GITHUB_REPOSITORY = config('GITHUB_REPOSITORY')

BRANCH = config('BRANCH', default='master')
STATUS_FILE = config('STATUS_FILE', default='docs/status.yml')

DMS_URL = 'https://api.deadmanssnitch.com/v1/snitches'
DMS_API_KEY = config('DMS_API_KEY')

NEW_RELIC_API_KEY = config('NEW_RELIC_API_KEY')
NEW_RELIC_QUERY_KEY = config('NEW_RELIC_QUERY_KEY')

DMS_PING_URL = config('DMS_PING_URL', default=None)

SENTRY_DSN = config('SENTRY_DSN', default=None)

STATUS_MAP = {
    'pending': {
        'name': 'pending',
        'order': 10,
        'global_name': 'Awaiting status for all systems',
    },
    'paused': {
        'name': 'paused',
        'order': 15,
        'global_name': 'Some systems are paused',
    },
    'healthy': {
        'name': 'healthy',
        'order': 20,
        'global_name': 'All systems healthy',
    },
    'warning': {
        'name': 'warning',
        'order': 30,
        'global_name': 'Some systems are experiencing issues'
    },
    'failed': {
        'name': 'failed',
        'order': 40,
        'global_name': 'Some systems are in trouble'
    }
}
