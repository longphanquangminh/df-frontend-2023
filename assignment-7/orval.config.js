module.exports = {
  bookstore: {
    input: {
      target: 'https://develop-api.bookstore.dwarvesf.com/swagger/doc.json',
      validation: false,
    },
    output: {
      mode: 'tags-split',
      target: './src/api/orval/bookstore.ts',
      schemas: './src/api/orval/model',
    },
  },
};
