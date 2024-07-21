#!/bin/sh

set -e

while ! nc -z $MYSQL_HOST $MYSQL_PORT; do
  echo "🟡 Waiting for Mysql Database Startup ($MYSQL_HOST $MYSQL_PORT) ..."
  sleep 2
done

echo "✅ Mysql Database Started Successfully ($MYSQL_HOST:$MYSQL_PORT)"

python manage.py collectstatic --noinput
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000
