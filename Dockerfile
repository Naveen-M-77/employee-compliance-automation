FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "preview"]
# docker build -t naveenm77/employeecompliance:tag .
# docker run -d -p 8080:80 --name mycontainer naveenm77/employeecompliance:tag
# docker tag naveenm77/employeecompliance:tag naveenm77/employeecompliance:tag
# docker push naveenm77/employeecompliance:tag
# docker pull naveenm77/employeecompliance:tag