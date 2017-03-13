# Linux Server Configuration

## Server details

- IP address:
`54.152.110.137`

- SSH port:
`2200`

- URL:
`http://54-152-110-137.tawatchairakpue.com/`

## Configuration made

### Update all currently installed packages

```bash
$ sudo apt-get update # update the package indexes
$ sudo apt-get upgrade # actually upgrade the installed packages
```

### Add grader user
```bash
$ sudo adduser grader
```

### Add user grader to sudo group
```bash
$ sudo usermod -aG sudo grader
```

### Set-up SSH keys for user grader
```bash
$ sudo mkdir /home/grader/.ssh
$ sudo chown grader:grader /home/grader/.ssh
$ sudo chmod 700 /home/grader/.ssh
$ sudo cp /home/ubuntu/.ssh/authorized_keys /home/grader/.ssh/
$ sudo chown grader:grader /home/grader/.ssh/authorized_keys
$ sudo chmod 644 /home/grader/.ssh/authorized_keys
```

### Configuring SSH
Reference: `https://sg.godaddy.com/help/changing-the-ssh-port-for-your-linux-server-7306`

Run the following command:
```bash
$ sudo vi /etc/ssh/sshd_config
```

Set the following configuration settings:
```bash
Port 2200
...
PermitRootLogin no
...
PasswordAuthentication no
```

Restart the sshd service by running the following command:
```bash
$ sudo service sshd restart
```

### Change timezone to UTC
Reference: `https://help.ubuntu.com/community/UbuntuTime`

```bash
$ sudo dpkg-reconfigure tzdata
```
This opened a dialog. From the menu I selected 'None of the above' and then 'UTC.'

### Configuration Firewall
Reference: `https://www.digitalocean.com/community/tutorials/how-to-setup-a-firewall-with-ufw-on-an-ubuntu-and-debian-cloud-server`

Allow incoming connection for port 2200, 80, and 123 by running the following command:
```bash
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
$ sudo ufw allow 2200/tcp
$ sudo ufw allow www
$ sudo ufw allow ntp
$ sudo ufw enable
```

### Install Apache to serve a Python mod_wsgi application

Install Apache:
```bash
$ sudo apt-get install apache2
```

Install the `libapache2-mod-wsgi` package:
```bash
$ sudo apt-get install libapache2-mod-wsgi
```

### Install and configure PostgreSQL
`https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04`
`https://www.digitalocean.com/community/tutorials/how-to-secure-postgresql-on-an-ubuntu-vps`

Install PostgreSQL:
```bash
$ sudo apt-get install postgresql postgresql-contrib
```

Check that remote connections are not allowed:
```bash
$ sudo less /etc/postgresql/9.5/main/pg_hba.conf
```
*By default, remote connections to the database are disabled.*

Set-up a password for user postgres:
```bash
$ sudo -u postgres psql postgres

# Set-up a password
\password postgres
\q
```

Connect to database as the user postgres:
```bash
$ sudo su - postgres
$ psql

# Create the catalog user
CREATE USER catalog WITH PASSWORD 'catalog_pw';

# Confirm that the user was created
\du

# Limit permissions to catalog user
ALTER ROLE catalog WITH LOGIN;
ALTER USER catalog CREATEDB;

# Create the catalog database
CREATE DATABASE catalog WITH OWNER catalog;

# Connect to the catalog database
\c catalog

# Revoke all rights
REVOKE ALL ON SCHEMA public FROM public;

# Grant only access to the catalog role
GRANT ALL ON SCHEMA public TO catalog;

# Exit out of PostgreSQL
\q
```

# Install Git

Install Git:
```bash
$ sudo apt-get install git
```

Edit Git Configuration:
```bash
$ sudo git config --global user.name "Tawatchai Rakpuen"
$ sudo git config --global user.email "me@tawatchairakpue.com"
```

Confirm by running the following command:
```bash
$ sudo git config --list
```

### Clone Udacity `Project: Item Catalog` to this Lightsail server

Create a directory:
```bash
$ sudo mkdir -p /var/www/catalog
$ cd /var/www/catalog
```

Clone repository:
```bash
$ git clone https://github.com/tawatchair/udacity-full-stack-web-developer.git udacity
$ sudo mv udacity/item-catalog/vagrant/catalog catalog
```

### Install Flask and create Virtual Environment for the Catalog App

Go to Project directory:
```bash
$ cd /var/www/catalog/catalog
```

Installing Python Modules:
```bash
$ sudo apt-get install python-pip
$ sudo pip install virtualenv
```

Run the following command:
```bash
$ sudo virtualenv venv
$ source venv/bin/activate
```

Install Flask, SQLAlchemy, etc with the following command:
```bash
$ sudo apt-get install python-psycopg2 python-flask
$ sudo apt-get install python-sqlalchemy
$ sudo pip install oauth2client
$ sudo pip install requests
$ sudo pip install httplib2
$ sudo pip install flask-seasurf
$ sudo pip install Flask
$ sudo pip install psycopg2
$ sudo pip install -r requirements.txt
```

Renamed `application.py` to `___init___.py`
```bash
$ sudo mv application.py __init__.py
```

Use the full path to `client_secrets.json` in the `__init__.py` file
```bash
$ sudo vi __init__.py

# SEARCH
('client_secrets.json'

# REPLACE
(r'/var/www/catalog/catalog/client_secrets.json'
```

**Modify the database calls in the catalog app to use PostgreSQL:**

Edit a file `__init__.py`:
```bash
$ sudo vi __init__.py

# SEARCH
engine = create_engine('sqlite:///item-catalog.db')

# REPLACE
engine = create_engine('postgresql://catalog:catalog_pw@localhost/catalog')
```

Edit a file `database_setup.py`:
```bash
$ sudo vi database_setup.py

# SEARCH
engine = create_engine('sqlite:///item-catalog.db')

# REPLACE
engine = create_engine('postgresql://catalog:catalog_pw@localhost/catalog')
```

Edit a file `db_seed.py`:
```bash
$ sudo vi db_seed.py

# SEARCH
engine = create_engine('sqlite:///item-catalog.db')

# REPLACE
engine = create_engine('postgresql://catalog:catalog_pw@localhost/catalog')
```

Set Up a Database with the following command:
```bash
$ sudo python database_setup.py
```

Database Seeding with the following command:
```bash
$ sudo python db_seed.py
```

Run the following command to test if the installation is successful and the app is running:
```bash
$ sudo python __init__.py
```

Configure the WSGI file:
```bash
$ sudo vi /var/www/catalog/catalog.wsgi
```

Add this to the file:
```bash#!/usr/bin/python 
import sys 
import logging 

logging.basicConfig(stream=sys.stderr) 
sys.path.insert(0,"/var/www/catalog/")  

from catalog import app as application 
application.secret_key = 'secret'
```

Configure Virtual Host in Apache:
```bash
$ sudo vi /etc/apache2/sites-available/catalog.conf
```

Add this to the file:
```bash
<VirtualHost *:80>
  ServerName 54-152-110-137.tawatchairakpue.com
  ServerAdmin me@tawatchairakpue.com
  WSGIScriptAlias / /var/www/catalog/catalog.wsgi
  <Directory /var/www/catalog/catalog/>
	  Order allow,deny
	  Allow from all
  </Directory>
  Alias /static /var/www/catalog/catalog/static
  <Directory /var/www/catalog/catalog/static/>
	  Order allow,deny
	  Allow from all
  </Directory>
  ErrorLog ${APACHE_LOG_DIR}/error.log
  LogLevel warn
  CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Enable this Virtual Host:
```bash
$ sudo a2ensite catalog
$ sudo service apache2 reload
```

Restart Apache:
```bash
$ sudo service apache2 restart
```

### Update the Google OAuth

- Go to: `https://console.developers.google.com/apis/dashboard?project=udacity-nanodegree-catalog`
- Click on Enable and Manage APIs, then click on Credentials in the left-hand menu
- Select Item Catalog

- Add URLs to Authorized Javascript origins, both local URL:
```
http://localhost:8000
http://54-152-110-137.tawatchairakpue.com
```

- Add URLs Authorized redirect URIs
```
http://localhost:8000/gconnect
http://54-152-110-137.tawatchairakpue.com/gconnect
```
