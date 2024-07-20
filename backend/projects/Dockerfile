FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED 1

WORKDIR /projects

COPY requirements.txt /projects/requirements.txt

RUN pip install -r requirements.txt

COPY . /projects

CMD  python manage.py runserver 0.0.0.0:8000

