# NX Useful libs collection

## Documentation

Checkout documentation: https://temarusanov.github.io/dev-notes/workspace/getting-started

## TODO:

- [ ] Jest coverage bug [#13576](https://github.com/jestjs/jest/issues/13576)
- [ ] Localization
- [ ] GraphQL format error
- [x] Disable any rule in eslint
- [ ] Nats clusters with Ansible
- [x] Nats file location volume
- [ ] Nats authorization
- [ ] Update NestJS to 10 (wait for golevelup/discovery bump)
- [ ] Make nats module npm package

## Installing

### Install Ansible

Check full tutorial about Ansible installing [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ansible-on-ubuntu-20-04)

```bash
sudo apt-add-repository ppa:ansible/ansible
```

```bash
sudo apt update
```

```bash
sudo apt install ansible
```

If you don't have `docker` and `nvm` install then locate to `devops/ansible` and run

```bash
ansible-playbook prepare_environment.yml --ask-become-pass
```

## Run

Install dependencies

```bash
npm install
```

Use container command to create a docker image

```bash
npx nx container
```

Run full environment in docker containers

```
ansible-playbook start_app.yml --ask-become-pass
```
