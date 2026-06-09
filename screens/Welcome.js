import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';
import { AppContext } from '../context/AppContext';

import TopBar from '../components/TopBar';

export default function Welcome({ navigation }) {
  const { setUsername } = useContext(AppContext);
  const [name, setName] = useState('');
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    if (name.trim()) {
      setUsername(name.trim());
      navigation.navigate('GoalSelection');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <TopBar />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome to Recipy!</Text>
            <Text style={styles.welcomeSubtitle}>Let's get started by setting up your profile.</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What should we call you?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor={colors.placeholder}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={[styles.button, !name.trim() && styles.buttonDisabled]} 
            onPress={handleContinue}
            disabled={!name.trim()}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    ...shadows.sm,
    zIndex: 10,
  },
  innerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    fontSize: fontSizes.brand,
    color: colors.brand,
    fontFamily: 'Jaini-Regular',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  bottomSection: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: radii.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  buttonDisabled: {
    backgroundColor: '#CFF7D3',
    borderWidth: 1,
    borderColor: colors.brand,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
});