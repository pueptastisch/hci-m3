import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import AppLayout from '../components/AppLayout';
import { AVAILABLE_USERNAMES, userExists } from '../data/users';
import {
  getGroups,
  createGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup,
} from '../data/groupsStore';

export default function GroupManagement() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadGroups = useCallback(() => {
    const nextGroups = getGroups();
    setGroups(nextGroups);

    if (nextGroups.length === 0) {
      setSelectedGroupId('');
      return;
    }

    const selectedStillExists = nextGroups.some((group) => group.id === selectedGroupId);
    if (!selectedStillExists) {
      setSelectedGroupId(nextGroups[0].id);
    }
  }, [selectedGroupId]);

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [loadGroups])
  );

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleCreateGroup = () => {
    clearMessages();

    const result = createGroup(groupName);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setGroupName('');
    setSelectedGroupId(result.group.id);
    setSuccess(`Created group "${result.group.name}".`);
    loadGroups();
  };

  const handleAddUser = () => {
    clearMessages();

    if (!selectedGroupId) {
      setError('Please create or select a group first.');
      return;
    }

    if (!userExists(username)) {
      setError('That username does not exist in the local users list.');
      return;
    }

    const result = addMemberToGroup(selectedGroupId, username);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setUsername('');
    setSuccess(`Added ${username.trim()} to ${result.group.name}.`);
    loadGroups();
  };

  const handleRemoveUser = (member) => {
    clearMessages();

    const result = removeMemberFromGroup(selectedGroupId, member);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(`Removed ${member} from ${result.group.name}.`);
    loadGroups();
  };

  const handleDeleteGroup = () => {
    clearMessages();

    const result = deleteGroup(selectedGroupId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(`Deleted group "${result.deletedGroup.name}".`);
    loadGroups();
  };

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || null;

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Group Management</Text>

        <Text style={styles.sectionTitle}>Create Group</Text>
        <TextInput
          style={styles.input}
          placeholder="Group name"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateGroup}>
          <Text style={styles.primaryButtonText}>Create Group</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Available Groups</Text>
        {groups.length === 0 ? (
          <Text style={styles.helperText}>No groups yet. Create your first group above.</Text>
        ) : (
          groups.map((group) => {
            const selected = selectedGroupId === group.id;
            return (
              <TouchableOpacity
                key={group.id}
                style={[styles.groupItem, selected && styles.groupItemSelected]}
                onPress={() => {
                  clearMessages();
                  setSelectedGroupId(group.id);
                }}
              >
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupMeta}>{group.members.length} member(s)</Text>
              </TouchableOpacity>
            );
          })
        )}

        <Text style={styles.sectionTitle}>Add User To Selected Group</Text>
        <Text style={styles.helperText}>
          Existing usernames: {AVAILABLE_USERNAMES.join(', ')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddUser}>
          <Text style={styles.primaryButtonText}>Add User</Text>
        </TouchableOpacity>

        {selectedGroup ? (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGroup}>
            <Text style={styles.deleteButtonText}>Delete Selected Group</Text>
          </TouchableOpacity>
        ) : null}

        {selectedGroup ? (
          <View style={styles.membersBlock}>
            <Text style={styles.sectionTitle}>Members In {selectedGroup.name}</Text>
            {selectedGroup.members.length === 0 ? (
              <Text style={styles.helperText}>No members yet.</Text>
            ) : (
              selectedGroup.members.map((member) => (
                <View key={`${selectedGroup.id}-${member}`} style={styles.memberRow}>
                  <Text style={styles.memberItem}>• {member}</Text>
                  <TouchableOpacity
                    style={styles.memberDeleteButton}
                    onPress={() => handleRemoveUser(member)}
                  >
                    <Text style={styles.memberDeleteButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 10,
    marginTop: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#f8d7da',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d9534f',
  },
  deleteButtonText: {
    color: '#a72824',
    fontSize: 16,
    fontWeight: '700',
  },
  groupItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  groupItemSelected: {
    borderColor: '#34C759',
    borderWidth: 2,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  groupMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#666666',
  },
  membersBlock: {
    marginTop: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  memberItem: {
    fontSize: 16,
    color: '#222222',
  },
  memberDeleteButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9534f',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  memberDeleteButtonText: {
    color: '#a72824',
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    marginTop: 14,
    color: '#d23232',
    fontWeight: '600',
  },
  successText: {
    marginTop: 10,
    color: '#1f8d3d',
    fontWeight: '600',
  },
});
