# Guia de Code Splitting com Chunks Remotos - Re.Pack

Este projeto está configurado para carregar chunks JavaScript de URLs remotas usando Re.Pack.

## 📁 Estrutura

```
pocrepack/
├── components/
│   ├── Button/          # Componente que será dividido em chunk
│   └── RemoteButton.tsx # Wrapper que gerencia carregamento remoto
├── bundles/             # Pasta para hospedar os chunks (criar manualmente)
├── server.js            # Servidor Express para servir os chunks
└── rspack.config.mjs    # Configuração do bundler
```

## 🚀 Como Funciona

### 1. Code Splitting
O componente `MyButton` é carregado dinamicamente usando `React.lazy()`:
```tsx
const MyButton = React.lazy(() => import('./Button'));
```

### 2. ChunkManager
O `ChunkManager` no `RemoteButton.tsx` resolve onde buscar os chunks:
- **Local**: Carrega do bundle do app (desenvolvimento)
- **Remoto**: Carrega de uma URL (produção)

### 3. Configuração do Rspack
O `rspack.config.mjs` está configurado para:
- Dividir código em chunks (`optimization.splitChunks`)
- Definir `publicPath` para a URL base dos chunks
- Gerar chunks com nomes apropriados

## 📝 Passo a Passo

### 1. Instalar dependências do servidor
```bash
npm install express cors
```

### 2. Criar pasta para os bundles
```bash
mkdir bundles
```

### 3. Gerar os bundles
```bash
# Para Android
npx react-native rspack-bundle --platform android --dev false --entry-file index.js --bundle-output bundles/index.bundle --assets-dest bundles

# Para iOS
npx react-native rspack-bundle --platform ios --dev false --entry-file index.js --bundle-output bundles/index.bundle --assets-dest bundles
```

### 4. Iniciar o servidor de chunks
```bash
node server.js
```
O servidor estará rodando em `http://localhost:3000`

### 5. Habilitar carregamento remoto
Edite `components/RemoteButton.tsx` e mude:
```tsx
const isRemote = true; // Mude de false para true
```

### 6. Rodar o app
```bash
npm run android
# ou
npm run ios
```

## 🔧 Configurações Importantes

### RemoteButton.tsx
```tsx
ChunkManager.configure({
  resolve: async (chunkId: string) => {
    const BASE_URL = 'http://localhost:3000/bundles'; // Altere para sua URL
    const isRemote = false; // true = remoto, false = local

    if (isRemote) {
      return {
        url: `${BASE_URL}/${chunkId}`,
        cache: false,
      };
    }

    return {
      url: ChunkManager.getChunkURL(chunkId),
    };
  },
});
```

### rspack.config.mjs
```javascript
output: {
  publicPath: 'http://localhost:3000/bundles/', // URL base dos chunks
  chunkFilename: '[name].chunk.bundle',
  filename: 'index.bundle',
}
```

## 📦 Chunks Gerados

Após o build, você verá arquivos como:
- `index.bundle` - Bundle principal
- `components.chunk.bundle` - Chunk dos componentes
- `vendors.chunk.bundle` - Chunk das dependências

## 🌐 Produção

Para usar em produção:

1. Altere a `BASE_URL` no `RemoteButton.tsx` para seu servidor de produção
2. Altere o `publicPath` no `rspack.config.mjs`
3. Configure seu servidor para servir os bundles com CORS habilitado
4. Opcionalmente, adicione cache e versionamento

Exemplo de URLs de produção:
```tsx
const BASE_URL = 'https://cdn.seuapp.com/bundles/v1.0.0';
```

## 🐛 Troubleshooting

### Erro: "Failed to load chunk"
- Verifique se o servidor está rodando (`http://localhost:3000/health`)
- Confirme que `isRemote = true` no `RemoteButton.tsx`
- Verifique os logs do servidor

### Erro: "CORS policy"
- O servidor já está configurado com CORS habilitado
- Se usar outro servidor, adicione: `Access-Control-Allow-Origin: *`

### Chunks não encontrados
- Liste os chunks disponíveis: `http://localhost:3000/bundles/list`
- Verifique se os arquivos estão na pasta `./bundles`

## 💡 Dicas

1. **Desenvolvimento**: Use `isRemote = false` para desenvolvimento mais rápido
2. **Debugging**: Ative `verbose: true` no `RepackPlugin` para logs detalhados
3. **Cache**: Em produção, habilite cache mudando `cache: false` para `cache: true`
4. **Versionamento**: Adicione versões na URL: `/bundles/v1.0.0/components.chunk.bundle`

## 📚 Recursos

- [Re.Pack Documentation](https://re-pack.dev)
- [Rspack Documentation](https://rspack.dev)
- [React Native Code Splitting](https://reactnative.dev/docs/ram-bundles-inline-requires)
