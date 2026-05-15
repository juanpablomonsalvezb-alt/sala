#!/bin/bash
set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Nebbuler Deploy Pipeline"
echo "=========================="

# 1. Build
echo "\n📦 Paso 1/4: Build..."
npm run build || { echo "${RED}❌ Build falló — deploy abortado${NC}"; exit 1; }
echo "${GREEN}✅ Build OK${NC}"

# 2. Deploy a preview
echo "\n☁️  Paso 2/4: Desplegando a preview..."
PREVIEW_URL=$(npx vercel --yes 2>&1 | grep "https://" | tail -1)
echo "Preview: $PREVIEW_URL"

# Esperar 10 segundos para que el deploy esté listo
sleep 10

# 3. Health check en preview
echo "\n🏥 Paso 3/4: Verificando sistema en preview..."
HEALTH=$(curl -s "$PREVIEW_URL/api/health")
ALL_OK=$(echo $HEALTH | python3 -c "import sys,json; d=json.load(sys.stdin); print('true' if d.get('ok') else 'false')" 2>/dev/null)

if [ "$ALL_OK" != "true" ]; then
  echo "${RED}❌ Health check falló — producción NO actualizada${NC}"
  echo "\nDetalle de fallos:"
  echo $HEALTH | python3 -c "
import sys, json
d = json.load(sys.stdin)
for name, check in d.get('checks', {}).items():
    if not check.get('ok'):
        print(f'  ❌ {name}: {check.get(\"error\", \"fallo\")}')
"
  echo "\n${YELLOW}El preview está disponible en: $PREVIEW_URL${NC}"
  echo "Arregla los problemas y vuelve a correr ./deploy.sh"
  exit 1
fi

echo "${GREEN}✅ Health check OK — 11/11 sistemas funcionando${NC}"

# 4. Alias a producción
echo "\n🌐 Paso 4/4: Publicando en nebbuler.com..."
npx vercel alias "$PREVIEW_URL" nebbuler.com --yes
echo "${GREEN}✅ nebbuler.com actualizado${NC}"

echo "\n${GREEN}🎉 Deploy completado exitosamente${NC}"
echo "URL: https://nebbuler.com"
