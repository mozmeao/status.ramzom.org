import requests
import yaml
from github3 import login

import config
from providers import fetch_snitches, fetch_newrelic, fetch_synthetics


def handler(event, context):
    if not config.DEBUG:
        github = login(config.GITHUB_USERNAME, config.GITHUB_PASSWORD)
        repository = github.repository(config.GITHUB_ORG, config.GITHUB_REPOSITORY)
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
            content = yaml.load(status_file.decoded)
        except ValueError:
            content = dict()
    else:
        try:
            with open(config.STATUS_FILE) as f:
                content = yaml.load(f.read())
        except IOError:
            content = dict()

    # Fetch components
    components = {}
    for f in [fetch_snitches, fetch_synthetics, fetch_newrelic]:
        components.update(f())

    changed = False
    for cid in components:
        if cid not in content:
            content[cid] = {
                'id': cid,
                'name': '{}'.format(components[cid]['name']),
                'status': '{}'.format(components[cid]['status']),
                'type': '{}'.format(components[cid]['type']),
                'link': '',
                'group': None,
                'display': True,
            }
            changed = True
        elif not content[cid].get('status', '') == components[cid]['status']:
            content[cid]['status'] = '{}'.format(components[cid]['status'])
            changed = True

    for component in content.keys():
        if component not in components:
            content.pop(component)
            changed = True

    if not config.DEBUG:
        if changed:
            status_file.update('Status update', yaml.dump(content, default_flow_style=False), branch='gh-pages')
        if config.DMS_PING_URL:
            requests.get(config.DMS_PING_URL)
    else:
        with open(config.STATUS_FILE, 'w') as f:
            f.write(yaml.dump(content, default_flow_style=False))


if __name__ == '__main__':
    handler(None, None)
