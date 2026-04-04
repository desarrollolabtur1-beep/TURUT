import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { bookingService } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';

const BookingsScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Alert.alert('Error', 'No se pudo cargar tus reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Reservas</Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No tienes reservas aún</Text>
          <Text style={styles.emptySubtext}>
            Explora experiencias y reserva tu próxima aventura
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id || item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookingCard}
              onPress={() => {
                // Navigate to booking detail (to be implemented)
                console.log('Navigate to booking detail:', item);
              }}
            >
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>
                  Reserva #{item._id?.slice(-6) || 'XXXXXX'}
                </Text>
                <Text style={styles.bookingDate}>
                  📅 {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.bookingStatus}>
                  {/* In a real app, you would have a status field */}
                  {item.status || 'Confirmada'}
                </Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.detailLabel}>Experiencia:</Text>
                <Text style={styles.detailValue}>
                  {item.experience?.title || 'Experiencia'}
                </Text>

                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>
                  {item.bookingDate
                    ? new Date(item.bookingDate).toLocaleDateString()
                    : 'Por confirmar'}
                </Text>

                <Text style={styles.detailLabel}>Personas:</Text>
                <Text style={styles.detailValue}>{item.participants || 1}</Text>

                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.detailValue}>${item.totalPrice || 0}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#0066cc',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
  },
  bookingStatus: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
    backgroundColor: '#d5f5e3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookingDetails: {
    padding: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default BookingsScreen;
