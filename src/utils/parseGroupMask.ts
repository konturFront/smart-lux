export function parseGroupMasks(g07: number, g815: number) {
  const groups = [];

  // Проверяем группы 0-7
  for (let i = 0; i < 8; i++) {
    const power = Math.pow(2, i);
    if (Math.floor(g07 / power) % 2 === 1) {
      groups.push(i);
    }
  }

  // Проверяем группы 8-15
  for (let i = 0; i < 8; i++) {
    const power = Math.pow(2, i);
    if (Math.floor(g815 / power) % 2 === 1) {
      groups.push(i + 8);
    }
  }

  return groups.sort((a, b) => a - b);
}

export function groupsToMasks(groups: number[]) {
  let g07 = 0;
  let g815 = 0;

  groups.forEach(group => {
    if (group >= 0 && group < 8) {
      g07 += Math.pow(2, group);
    } else if (group >= 8 && group < 16) {
      g815 += Math.pow(2, group - 8);
    }
  });

  return { g07, g815 };
}
