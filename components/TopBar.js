import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSizes, shadows, spacing, fontWeights } from '../design/tokens';
import { AppContext } from '../context/AppContext';

export default function TopBar({ title }) {
  const insets = useSafeAreaInsets();
  const { username } = useContext(AppContext);

  // If no title is provided, we default to the brand name
  const displayTitle = title || 'Recipy';

  return (
    <View style={[styles.container, { paddingTop: insets.top || spacing.md }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent />
      <View style={styles.innerContainer}>
        <View style={styles.sideContainer} />
        <Text style={styles.logo}>{displayTitle}</Text>
        <View style={styles.sideContainer}>
          {username ? (
            <Text style={styles.username} numberOfLines={1}>
              {username}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    ...shadows.sm,
    zIndex: 10,
  },
  innerContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  sideContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logo: {
    fontSize: fontSizes.brand,
    color: colors.brand,
    fontFamily: 'Jaini-Regular',
  },
  username: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
});