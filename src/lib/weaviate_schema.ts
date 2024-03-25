export const productClass = {
  class: "Product",
  vectorizer: "text2vec-cohere", // If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
  moduleConfig: {
    "text2vec-cohere": { model: "embed-multilingual-v2.0", truncate: "RIGHT" },
  },
};
