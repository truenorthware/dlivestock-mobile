export default function Promisify(fn, ...args): Promise {
  return new Promise((resolve, reject) => {
    fn.apply(null, [...args, resolve, reject])
  })
}
