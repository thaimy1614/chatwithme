// API mới của DiceBear
const generateDiceBearAvatar = (style, seed) =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;

export const generateAvatar = () => {
  const data = [];

  for (let i = 0; i < 3; i++) {
    const res = generateDiceBearAvatar('avataaars', Math.random().toString());
    data.push(res);
  }
  for (let i = 0; i < 3; i++) {
    const res = generateDiceBearAvatar('bottts', Math.random().toString());
    data.push(res);
  }
  for (let i = 0; i < 3; i++) {
    const res = generateDiceBearAvatar('micah', Math.random().toString());
    data.push(res);
  }

  return data;
};
