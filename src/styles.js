import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424549',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    
    paddingTop: 45,
    paddingHorizontal: 8,
    paddingBottom: 12,
    backgroundColor: '#2E294E',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    marginTop: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width:"85%"
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    color: '#000',
    padding: 0,
    fontSize: 14,
  },
  cartButton: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: '#2E294E',
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingVertical: 6,
    backgroundColor: 'transparent',
    height: 60,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#443C68',
    height: 48,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  selectedCategory: {
    backgroundColor: '#FED766',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  categoryName: {
    color: '#fff',
    fontSize: 11,
  },
  productList: {
    flex: 1,
    padding: 10,
  },
  productListContent: {
    paddingBottom: 16,
  },
  productCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#1e2124',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
    maxWidth: width / 2 - 12,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#fed766',
  },
  productPrice: {
    fontSize: 14,
    color: '#118C4F',
    fontWeight: '600',
  },
  productCategory: {
    fontSize: 12,
    color: '#fed766',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: '#FED766',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#2E294E',
    fontWeight: 'bold',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noImageText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
