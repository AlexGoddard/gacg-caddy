export const formatName = (value: string) => {
  const words = value.trim().split(' ');
  return words
    .map((word) =>
      word
        .split("'")
        .map((w) => capitalize(w))
        .join("'"),
    )
    .join(' ');
};

const capitalize = (value: string) =>
  `${value[0].toUpperCase()}${value.slice(1)}`;
