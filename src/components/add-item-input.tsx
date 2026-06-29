import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface AddItemInputProps {
  onAdd: (name: string, quantity: string) => void;
}

export function AddItemInput({ onAdd }: AddItemInputProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const theme = useTheme();

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), quantity.trim() || '1');
      setName('');
      setQuantity('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.nameInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            placeholder="Lisää tuote..."
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.quantityInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            placeholder="Määrä"
            placeholderTextColor={theme.textSecondary}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.primary }]} 
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  nameInput: {
    flex: 3,
    height: 48,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  quantityInput: {
    flex: 1,
    height: 48,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
