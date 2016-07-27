import requests
import yaml
from github3 import login

import config
from providers import fetch_snitches, fetch_newrelic, fetch_synthetics


def handler(event, context):
    if not config.DEBUG:
        github = login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD)
        repository = github.repository(config.GITHUB_ORG, config.GITHUB_REPOSITORY)
        if not repository:
            raise Exception('Repository {}/{} does not exist'.format(config.GITHUB_ORG,
                                                                     config.GITHUB_REPOSITORY))

        status_file = repository.file_contents(config.STATUS_FILE, ref='gh-pages')
        if not status_file:
            repository.create_file(
                path=config.STATUS_FILE,
                message='Create status file',
                content='{}',
                branch='gh-pages'
            )['content']
            status_file = repository.file_contents(config.STATUS_FILE, ref='gh-pages')

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
        updated_components.update(f())

    changed = False
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
            changed = True
        elif not current_components[cid].get('status', '') == data['status']:
            current_components[cid]['status'] = data['status']
            changed = True

    # If components stop reporting set their status to warning.
    for cid in current_components.keys():
        if cid not in updated_components:
            current_components[cid]['status'] = config.STATUS_MAP['warning']['name']
            changed = True

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
            status_file.update(
                'Status update',
                yaml.dump(status_data, default_flow_style=False), branch='gh-pages')
        if config.DMS_PING_URL:
            requests.get(config.DMS_PING_URL)
    else:
        with open(config.STATUS_FILE, 'w') as f:
            f.write(yaml.dump(status_data, default_flow_style=False))


if __name__ == '__main__':
    handler(None, None)
