FROM ubuntu:latest
RUN apt-get update -y
RUN apt-get -y install tesseract-ocr
RUN apt-get -y install tesseract-ocr-fra
RUN apt-get -y install tesseract-ocr-eng

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y npm
WORKDIR /app
COPY . .
RUN npm install && \
  npm run build
CMD ["npm", "run", "start:dev"]
