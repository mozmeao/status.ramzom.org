import requests
import yaml
from github3 import login
from raven import Client

import config
from providers import fetch_snitches, fetch_newrelic, fetch_synthetics

sentry_client = Client(config.SENTRY_DSN,
                       install_sys_hook=False,
                       ignore_exceptions=['KeyboardInterrupt', 'SystemExit'],
                       processors=['raven.processors.SanitizePasswordsProcessor'],
                       release=config.VERSION)


def handler(event, context):
    if not config.DEBUG:
        github = login(token=config.GITHUB_TOKEN)
        repository = github.repository(config.GITHUB_ORG, config.GITHUB_REPOSITORY)
        if not repository:
            raise Exception('Repository {}/{} does not exist'.format(config.GITHUB_ORG,
                                                                     config.GITHUB_REPOSITORY))

        status_file = repository.file_contents(config.STATUS_FILE, ref=config.BRANCH)
        if not status_file:
            repository.create_file(
                path=config.STATUS_FILE,
                message='Create status file',
                content='{}',
                branch=config.BRANCH,
            )['content']
            status_file = repository.file_contents(config.STATUS_FILE, ref=config.BRANCH)

        try:
            current_status = yaml.load(status_file.decoded)
        except ValueError:
            current_status = dict()
    else:
        try:
            with open(config.STATUS_FILE) as f:
                current_status = yaml.load(f.read())
        except IOError:
            current_status = dict()

    current_components = current_status['components']

    # Fetch components
    updated_components = {}
    for f in [fetch_snitches, fetch_synthetics, fetch_newrelic]:
        try:
            updated_components.update(f())
        except:
            sentry_client.captureException()
            raise

    changed = []
    for cid, data in updated_components.items():
        if cid not in current_components:
            current_components[cid] = {
                'id': cid,
                'name': '{}'.format(data['name']),
                'status': '{}'.format(data['status']),
                'type': '{}'.format(data['type']),
                'link': '',
                'group': None,
                'display': True,
            }
            changed.append(data['name'])
        elif not current_components[cid].get('status', '') == data['status']:
            current_components[cid]['status'] = data['status']
            changed.append(current_components[cid]['name'])

    # If components stop reporting set their status to warning.
    for cid in current_components.keys():
        if cid not in updated_components:
            current_components[cid]['status'] = config.STATUS_MAP['warning']['name']
            changed.append(current_components[cid]['name'])

    status = config.STATUS_MAP['healthy']['name']
    for data in (d for d in current_components.values() if d.get('display', True)):
        if config.STATUS_MAP[status]['order'] < config.STATUS_MAP[data['status']]['order']:
            status = data['status']

    status_data = {
        'globalStatus': {
            'status': status,
            'message': config.STATUS_MAP[status]['global_name'],
        },
        'components': current_components,
    }

    if not config.DEBUG:
        if changed:
            commit_msg = 'Status update for ' + ', '.join(changed)
            if len(commit_msg) > 80:
                commit_msg = 'Status update for {} services\n\n'.format(len(changed))
                commit_msg += ''.join([' * {}\n'.format(x) for x in changed])

            status_file.update(
                commit_msg,
                yaml.dump(status_data, default_flow_style=False), branch=config.BRANCH)
        if config.DMS_PING_URL:
            requests.get(config.DMS_PING_URL)
    else:
        with open(config.STATUS_FILE, 'w') as f:
            f.write(yaml.dump(status_data, default_flow_style=False))


if __name__ == '__main__':
    handler(None, None)
