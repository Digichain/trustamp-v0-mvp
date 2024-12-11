FROM denoland/deno:1.37.0

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install OpenAttestation CLI globally
RUN npm install -g @govtechsg/open-attestation-cli

# The rest of the Dockerfile remains the same as the default Supabase Edge Function Dockerfile
EXPOSE 8000

WORKDIR /app

COPY . .

CMD ["run", "--allow-net", "--allow-env", "--allow-run", "index.ts"]