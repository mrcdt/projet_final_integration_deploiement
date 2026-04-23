FROM node:18-alpine
WORKDIR /app
# On copie la page HTML
COPY index.html ./
# On installe le paquet "serve" globalement
RUN npm install -g serve
# On expose le port 3000
EXPOSE 3000
# On lance le serveur sur le dossier courant
CMD ["serve", "-s", ".", "-p", "3000"]