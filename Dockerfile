FROM registry.vestack.sunnyoptical.cn/baseimages/node:20-alpine3.20 AS build-stage
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/ \
    &&npm install -g pnpm@latest
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN npm run build
RUN echo "Build Success 🎉"

FROM registry.vestack.sunnyoptical.cn/baseimages/nginx:1.12.2
RUN chmod 777 /usr/share/nginx/html
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]