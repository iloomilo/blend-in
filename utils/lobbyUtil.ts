export function createGameCode() {
  return Math.random().toString(36).substring(2, 8);
}

export function getRandomUsername() {
  const adjectives = ["Cool", "Fast", "Angry", "Happy", "Sneaky", "Lucky"];
  const animals = ["Tiger", "Panda", "Falcon", "Monkey", "Shark", "Fox"];
  const number = Math.floor(Math.random() * 1000);

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adjective}${animal}${number}`;
}
