const fs = require("fs");
const path = require("path");

/**
 * Função para ler um diretório recursivamente e chamar uma função de retorno de chamada para cada arquivo encontrado.
 * @param {string} dir - O diretório a ser lido.
 * @param {(file: string) => void} callback - Função de retorno de chamada a ser chamada para cada arquivo encontrado.
 */
function readDirRecursive(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      readDirRecursive(filePath, callback); // Se for um diretório, chama recursivamente a função readDirRecursive.
    } else {
      callback(filePath);
    }
  });
}

/**
 * Função para carregar comandos de uma pasta.
 * @param {string} slash - O caminho da pasta contendo os comandos de slash.
 * @returns {{slashes: SlashBuild[]}} - Um objeto contendo os comandos carregados.
 */
module.exports = function commandHandler(slash) {
  const slashes = [];

  readDirRecursive(slash, (file) => {
    try {
      slashes.push(require(file));
    } catch (error) {
      console.error(`Failed to load slash ${file}:`, error);
    }
  });

  return { slashes };
};