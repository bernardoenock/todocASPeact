# --- Etapa de build ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copiar csproj e restaurar dependências
COPY *.csproj ./
RUN dotnet restore

# Copiar todo o código
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# --- Etapa de runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Expõe a porta padrão do ASP.NET
EXPOSE 80

# Inicializa a aplicação
ENTRYPOINT ["dotnet", "api.dll"]
