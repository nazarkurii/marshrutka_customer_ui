FROM node:lts-alpine AS build

WORKDIR /app

ENV VITE_API_BASE_URL=https://pumpkinbooks.store/customer
ENV VITE_API_URL=https://pumpkinbooks.store
ENV VITE_APP_URL=https://marshrutka.store
ENV VITE_GOOGLE_CLIENT_ID=514590415012-07gn4691pekgolm4342rqjoep7qsrfo9.apps.googleusercontent.com
ENV VITE_RAPID_API_KEY=5e7102c268msh2da6a3b6a6a0b21p101734jsn3b3e006b1260
ENV VITE_GEOAPIFY_API_KEY=54e42e5b7c1748ef9d94edb7dda98064
ENV VITE_GOOGLE_MAPS_API_KEY=AIzaSyDIUnVZXPBglCkLSit2jmCfgmbdRo4e8sc

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine 

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d

HEALTHCHECK --interval=10s --timeout=2s --retries=5 \
    CMD curl -fs http://localhost:3000/health: exit 1

CMD ["nginx", "-g", "daemon off;"]