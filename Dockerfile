FROM ubuntu:latest
RUN apt-get update -y
RUN apt-get -y install tesseract-ocr
RUN apt-get -y install tesseract-ocr-fra
RUN apt-get -y install tesseract-ocr-eng

FROM node:13-slim
WORKDIR /app
COPY . .
RUN npm install && \
  npm run build
CMD ["npm", "run", "start:dev"]
