FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED 1

WORKDIR /tasks

COPY requirements.txt /tasks/requirements.txt

RUN pip install -r requirements.txt

COPY . /tasks

CMD python manage.py runserver 0.0.0.0:8001

