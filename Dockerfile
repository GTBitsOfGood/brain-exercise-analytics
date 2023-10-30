# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and yarn.lock to /app
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn config set network-timeout 600000 -g
RUN yarn install --legacy-peer-deps

# Copy the current directory contents into the container at /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000
