function snakelize(p) {
  return p
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
}

export default snakelize;
