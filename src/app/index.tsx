import { ShoppingBasket } from 'lucide-react-native';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddItemInput } from '@/components/add-item-input';
import { ShoppingItem } from '@/components/shopping-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { useTheme } from '@/hooks/use-theme';

export default function ShoppingListScreen() {
  const { items, isLoading, addItem, toggleBought, deleteItem, clearAll } = useShoppingList();
  const theme = useTheme();

  const remainingItems = items.filter(item => !item.is_bought).length;

  const handleClearAll = () => {
    Alert.alert(
      'Tyhjennä lista',
      'Haluatko varmasti poistaa kaikki tuotteet listalta?',
      [
        { text: 'Peruuta', style: 'cancel' },
        { text: 'Tyhjennä', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Otsikko-osio */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <ShoppingBasket size={32} color={theme.primary} />
              <ThemedText type="title" style={styles.title}>
                NMakien Ostoslista
              </ThemedText>
            </View>
            {items.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <ThemedText style={{ color: theme.error, fontWeight: '600' }}>Tyhjennä</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          <ThemedText style={styles.subtitle}>
            {items.length === 0 
              ? 'Lista on tyhjä' 
              : `${remainingItems} tuotetta ostamatta`}
          </ThemedText>
        </View>

        {/* Lista tuotteista */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ShoppingItem
                name={item.name}
                quantity={item.quantity}
                isBought={item.is_bought === 1}
                onToggle={() => toggleBought(item.id, item.is_bought)}
                onDelete={() => deleteItem(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  Lisää ensimmäinen tuote listalle alta!
                </ThemedText>
              </View>
            }
          />
        )}
      </SafeAreaView>

      {/* Lisäyskenttä alareunassa */}
      <AddItemInput onAdd={addItem} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  listContent: {
    paddingBottom: Spacing.four,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
  },
});
