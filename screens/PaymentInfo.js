import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
} from '../design/tokens';

export default function PaymentInfo({ navigation }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (cardNumber && expiry && cvv && cardName) {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        navigation.goBack();
      }, 2000);
    }
  };

  return (
    <AppLayout title="Payment Information">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionTitle}>Credit or Debit Card</Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={cardName}
                onChangeText={setCardName}
                placeholderTextColor={colors.textDisabled}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholderTextColor={colors.textDisabled}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.md }]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholderTextColor={colors.textDisabled}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                  placeholderTextColor={colors.textDisabled}
                />
              </View>
            </View>
          </View>

          {isSaved && (
            <View style={styles.savedMessage}>
              <Text style={styles.savedText}>✓ Payment information saved!</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.saveButton, (!cardNumber || !expiry || !cvv || !cardName) && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!cardNumber || !expiry || !cvv || !cardName || isSaved}
          >
            <Text style={styles.saveButtonText}>Save Card</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  form: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radii.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xxxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: colors.brand,
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    ...shadows.md,
  },
  buttonDisabled: {
    backgroundColor: colors.brandLight,
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.surface,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
  },
  savedMessage: {
    backgroundColor: colors.success + '20',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  savedText: {
    color: colors.success,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.md,
  },
});