module.exports = {
  bookstore: {
    input: {
      target: 'https://develop-api.bookstore.dwarvesf.com/swagger/doc.json',
      validation: false,
    },
    output: {
      workspace: './app/api/generated/orval/',
      target: './bookstore.ts',
      mode: 'tags',
    },
  },
};
