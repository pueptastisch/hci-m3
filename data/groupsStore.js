let groups = [];

function normalize(value) {
  return value.trim().toLowerCase();
}

function cloneGroup(group) {
  return {
    ...group,
    members: [...group.members],
  };
}

export function getGroups() {
  return groups.map(cloneGroup);
}

export function getGroupById(groupId) {
  const found = groups.find((group) => group.id === groupId);
  return found ? cloneGroup(found) : null;
}

export function createGroup(groupName) {
  const trimmedName = groupName.trim();
  if (!trimmedName) {
    return { ok: false, error: 'Please enter a group name.' };
  }

  const normalizedName = normalize(trimmedName);
  const alreadyExists = groups.some((group) => normalize(group.name) === normalizedName);
  if (alreadyExists) {
    return { ok: false, error: 'A group with this name already exists.' };
  }

  const newGroup = {
    id: String(Date.now() + Math.random()),
    name: trimmedName,
    members: [],
  };

  groups = [...groups, newGroup];
  return { ok: true, group: cloneGroup(newGroup) };
}

export function addMemberToGroup(groupId, username) {
  const trimmedUsername = username.trim();
  if (!trimmedUsername) {
    return { ok: false, error: 'Please enter a username.' };
  }

  const index = groups.findIndex((group) => group.id === groupId);
  if (index < 0) {
    return { ok: false, error: 'Please select a group first.' };
  }

  const normalizedUsername = normalize(trimmedUsername);
  const currentMembers = groups[index].members;
  const memberAlreadyExists = currentMembers.some(
    (member) => normalize(member) === normalizedUsername
  );

  if (memberAlreadyExists) {
    return { ok: false, error: 'This user is already in the selected group.' };
  }

  const updatedGroup = {
    ...groups[index],
    members: [...groups[index].members, trimmedUsername],
  };

  groups = [
    ...groups.slice(0, index),
    updatedGroup,
    ...groups.slice(index + 1),
  ];

  return { ok: true, group: cloneGroup(updatedGroup) };
}
