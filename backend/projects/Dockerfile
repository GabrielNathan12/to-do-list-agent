FROM python:3.13.0rc2-slim

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

WORKDIR /projects

COPY requirements.txt /projects/requirements.txt

COPY . /projects
COPY scripts /scripts

RUN apt-get update && apt-get install -y \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential  \
    pkg-config

RUN apt-get install -y netcat-traditional redis-server && \ 
    chmod -R +x /scripts

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENV PATH="/scripts:$PATH"


CMD ["commands.sh"]
