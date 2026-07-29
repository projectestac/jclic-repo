/* global process */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import banner from "vite-plugin-banner";
import svgrPlugin from "vite-plugin-svgr";
import pkg from "./package.json";

const date = new Date();
const version = `${pkg.version} (${date.toISOString().substring(0, 10)})`;
const bannerText = `
${pkg.name} v${version}
${pkg.description}
${pkg.homepage}
 
(c) ${date.getFullYear()} ${pkg.author.name || pkg.author}

Licensed under the EUPL, Version 1.2 or -as soon they will be approved by
the European Commission- subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.

You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
Licence for the specific language governing permissions and limitations
under the Licence.

For full license information of included components please see: components.LICENSE

WARNING: This is a compressed version of "${pkg.name}". Full source code is freely available at:
${pkg.repository.url}
`;

// See: https://vite.dev/config/
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
    VITE_APP_VERSION: `v${pkg.version}`,
  };

  return defineConfig({
    plugins: [
      react(),
      banner(bannerText),
      svgrPlugin(),
    ],
    base: "",
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    publicDir: "public",
    appType: "spa",
    assetsInclude: ["**/*.html"],
    build: {
      minify: "oxc",
      assetsDir: "",
      assetsInlineLimit: 16384,
      chunkSizeWarningLimit: 1000000,
      cssCodeSplit: false,
      sourcemap: true,
      rollupOptions: {
        output: {
          entryFileNames: `jclic-repo.js`,
          format: "iife",
        },
      },
    },
    oxc: {
      legalComments: "none",
    },
    server: {
      port: 8000,
      allowedHosts: true,
    },
    preview: {
      port: 8000,
      allowedHosts: true,
    },
  });
};
