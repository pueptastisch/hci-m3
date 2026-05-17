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
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
} from '../design/tokens';
import {
  getGroups,
  createGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup,
} from '../data/groupsStore';

export default function GroupManagement({ navigation }) {
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

        {selectedGroup ? (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGroup}>
            <Text style={styles.deleteButtonText}>Delete Selected Group</Text>
          </TouchableOpacity>
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
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    fontSize: fontSizes.display,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm + 2,
    marginTop: spacing.md,
  },
  helperText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: spacing.md,
    fontSize: fontSizes.lg,
    marginBottom: spacing.sm + 2,
  },
  primaryButton: {
    backgroundColor: colors.brand,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  deleteButton: {
    backgroundColor: colors.dangerBg,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.dangerText,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  groupItem: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  groupItemSelected: {
    borderColor: colors.brand,
    borderWidth: 2,
  },
  groupName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  groupMeta: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  membersBlock: {
    marginTop: spacing.sm + 2,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm - 2,
  },
  memberItem: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
  },
  memberDeleteButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
  },
  memberDeleteButtonText: {
    color: colors.dangerText,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  errorText: {
    marginTop: spacing.md + 2,
    color: colors.error,
    fontWeight: fontWeights.semibold,
  },
  successText: {
    marginTop: spacing.sm + 2,
    color: colors.success,
    fontWeight: fontWeights.semibold,
  },
});
