import requests
from collections import defaultdict, Counter
from datetime import datetime, timedelta

import config


def fetch_snitches():
    response = requests.get(config.DMS_URL, auth=(config.DMS_API_KEY, ''))
    response.raise_for_status()

    snitches = {}
    for snitch in response.json():
        id = 'dms-{}'.format(snitch['token'])
        status = snitch['status']
        snitches[id] = {
            'name': snitch['name'],
            'status': status,
            'type': 'deadmanssnitch',
        }
    return snitches


def fetch_newrelic():
    apps = {}
    response = requests.get('https://api.newrelic.com/v2/applications.json',
                            headers={'X-Api-Key': config.NEW_RELIC_API_KEY})

    for application in response.json()['applications']:
        id = 'nr-{}'.format(application['id'])
        apps[id] = {
            'name': application['name'],
            'status': application['health_status'],
            'type': 'newrelic',
        }

    return apps


def fetch_synthetics():
    response = requests.get('https://insights-api.newrelic.com/v1/accounts/1299394/query?nrql=SELECT%20monitorId%2C%20monitorName%2C%20result%20%20FROM%20SyntheticCheck%20LIMIT%20200',
                            headers={'X-Query-Key': config.NEW_RELIC_QUERY_KEY})
    monitor_name = {}
    monitor_status = defaultdict(Counter)
    now = datetime.utcnow()
    for x in response.json()['results'][0]['events']:
        monitor_time = datetime.fromtimestamp(float(str(x['timestamp'])[:-3]))
        if monitor_time + timedelta(minutes=15) < now:
            continue
        monitor_status[x['monitorId']].update([x['result']])
        monitor_name[x['monitorId']] = x['monitorName']

    monitors = {}
    for monitor_id, status in monitor_status.items():
        if len(status) > 1:
            first, second = status.most_common(2)
        else:
            first = status.most_common()
            second = first
        first = first[0][0]
        second = second[0][0]

        if first == 'SUCCESS' and second == 'SUCCESS':
            status = 'operational'
        elif first == 'SUCCESS' and second == 'FAILED':
            status = 'performance issues'
        elif first == 'FAILED' and second == 'SUCCESS':
            status = 'partial outage'
        else:
            status = 'major outage'

        monitors['synthetics-{}'.format(monitor_id)] = {
            'name': monitor_name[monitor_id],
            'status': status,
            'type': 'synthetics',
        }
    return monitors
