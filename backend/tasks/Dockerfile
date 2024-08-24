# Usar a imagem base do Python
FROM python:3.13.0b4-slim


ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

COPY . /backend
COPY scripts /scripts

WORKDIR /backend


RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    cmake \
    libpython3-dev \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && \
    apt-get install -y netcat-traditional redis-server && \
    python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r /backend/requirements.txt && \
    chmod -R +x /scripts


ENV PATH="/scripts:/venv/bin:$PATH"


CMD ["commands.sh"]