FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED 1

WORKDIR /users

COPY requirements.txt /users/requirements.txt

RUN pip install -r requirements.txt

COPY . /users

CMD python manage.py runserver 0.0.0.0:8002

