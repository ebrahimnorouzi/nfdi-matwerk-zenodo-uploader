FROM python:3.12-slim

WORKDIR /docs

RUN pip install --no-cache-dir \
    mkdocs-material==9.5.18 \
    mkdocs-minify-plugin==0.8.0

COPY . .

EXPOSE 8080

CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8080"]
