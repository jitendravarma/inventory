# inventory

Installation

    Git clone this repo
    You might need to install nodejs
        sudo apt-get install nodejs
    Install all the requirements in the virtualenv of your choice
        pip install -r requirements.txt
    Install node modules and build files, from base dir of the repo.
        cd frontend
        npm install
        npm build
    Migrate the app
        ./manage.py makemigrations
        ./ manage.py migrate
    Load currencies into the database, from base dir execute
        ./manage.py load_data

For production setup, you might need to add the server's ip address in ALLOWED_HOSTS in settings/base.py

Also, you might need to change the BASE_URL in frontend/src/utils/constants.js (Currently points to 127.0.0.1:8000).

You will also need to update base.py to set email credentials for sending mails. Set smtp ports, from email and password in base.py


./manage.py runserver 0.0.0.0:8000

And visit http://127.0.0.1:8000
