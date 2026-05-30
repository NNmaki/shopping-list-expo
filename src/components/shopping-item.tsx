import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Trash2, CheckCircle2, Circle } from 'lucide-react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface ShoppingItemProps {
  name: string;
  quantity: string;
  isBought: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function ShoppingItem({ name, quantity, isBought, onToggle, onDelete }: ShoppingItemProps) {
  const theme = useTheme();

  return (
    <Animated.View 
      entering={FadeIn} 
      layout={Layout.springify()}
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
    >
      <TouchableOpacity 
        style={styles.content} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          {isBought ? (
            <CheckCircle2 size={24} color={theme.primary} />
          ) : (
            <Circle size={24} color={theme.textSecondary} />
          )}
        </View>
        
        <View style={styles.textContainer}>
          <ThemedText 
            style={[
              styles.name, 
              isBought && { textDecorationLine: 'line-through', color: theme.textSecondary }
            ]}
          >
            {name}
          </ThemedText>
          {quantity !== '1' && (
            <ThemedText type="small" style={styles.quantity}>
              Määrä: {quantity}
            </ThemedText>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={onDelete}
        activeOpacity={0.6}
      >
        <Trash2 size={20} color={theme.error} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.one,
    marginHorizontal: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    // Pehmeä varjo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: Spacing.three,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantity: {
    marginTop: 2,
  },
  deleteButton: {
    padding: Spacing.two,
  },
});
