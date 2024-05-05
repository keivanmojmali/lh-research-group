module.exports = {
  resolve: {
    extensions: [".js", ".mjs"], // Allow JavaScript and MJS extensions
    alias: {
      "pdfjs-dist/build/pdf.worker.entry": require.resolve(
        "pdfjs-dist/build/pdf.worker.entry"
      ),
    },
  },
  // Other Webpack configurations like `module`, `output`, etc.
};
