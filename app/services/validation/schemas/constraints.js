const cvv = {
  presence: true,
  format: {
    pattern: /^\d{3}$/,
    message: 'must be 3 digit',
  },
}

const date = {
  date: true,
}

export default {
  cvv,
  date,
}
