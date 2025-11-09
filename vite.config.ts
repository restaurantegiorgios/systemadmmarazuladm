import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Imagem_PWA.png'],
      // Força a geração do Service Worker mesmo em desenvolvimento para permitir testes de instalação
      devOptions: {
        enabled: true,
        type: 'module', // Garante que o SW seja carregado como módulo
      },
      manifest: {
        name: "Giorgio's Mar Azul - Gestão de Funcionários",
        short_name: "Gestão de Funcionários",
        description: "Sistema de Gestão de Funcionários do Giorgio's Mar Azul Restaurante",
        theme_color: '#0a192f',
        background_color: '#0a192f',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: '/Imagem_PWA.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/Imagem_PWA.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/Imagem_PWA.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));