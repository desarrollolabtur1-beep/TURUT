import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Alert,
  Modal
} from 'react-native';
import { experienceService, bookingService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const ExperienceDetailScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { experienceId } = route.params || {};
  
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [participants, setParticipants] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!experienceId) return;
      
      try {
        setLoading(true);
        const response = await experienceService.getById(experienceId);
        const expData = response.data.data || response.data;
        setExperience(expData);
        
        // Calcular precio total por defecto (1 participante)
        if (expData) {
          setTotalPrice(expData.price);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load experience');
        Alert.alert('Error', err.response?.data?.message || 'Failed to load experience');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId]);

  const handleBookExperience = () => {
    if (experience) {
      setBookingModalVisible(true);
    }
  };

  const handleDateChange = (date: Date) => {
    setBookingDate(date);
  };

  const handleParticipantsChange = (count: number) => {
    setParticipants(count);
    if (experience) {
      setTotalPrice(experience.price * count);
    }
  };

  const handleSpecialRequestsChange = (text: string) => {
    setSpecialRequests(text);
  };

  const handleBookNow = async () => {
    if (!experience || !bookingDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingService.create({
        experience: experience._id,
        bookingDate: bookingDate.toISOString(),
        participants,
        totalPrice,
        specialRequests,
      });
      
      setBookingModalVisible(false);
      Alert.alert('Success', 'Booking created successfully!');
      // Limpiar formulario
      setBookingDate(null);
      setParticipants(1);
      setSpecialRequests('');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !experience) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Imagen principal */}
      <Image 
        source={{ uri: experience.images && experience.images.length > 0 
          ? experience.images[0] 
          : require('../assets/default-experience.jpg') }} 
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.category}>{experience.category}</Text>
        </View>
      </Image>

      {/* Información de la experiencia */}
      <View style={styles.content}>
        <Text style={styles.title}>{experience.title}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.price}>${experience.price}</Text>
          <Text style={styles.duration}>⏱️ {experience.duration}h</Text>
        </View>
        <Text style={styles.location}>📍 {experience.location}</Text>
        
        {/* Descripción */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{experience.description}</Text>
        </View>
        
        {/* Información adicional */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Detalles</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoItem}>
              👥 Máximo {experience.maxParticipants} personas
            </Text>
            <Text style={styles.infoItem}>
              📅 {experience.availableDates?.length} fechas disponibles
            </Text>
          </View>
        </View>
      </View>

      {/* Botón de reserva */}
      <TouchableOpacity 
        style={[styles.bookButton, !user && styles.bookButtonDisabled]}
        onPress={user ? handleBookExperience : () => 
          Alert.alert('Please login to book this experience')}
        disabled={!user}
      >
        <Text style={styles.bookButtonText}>
          {user ? 'Reservar Ahora' : 'Iniciar Sesión para Reservar'}
        </Text>
      </TouchableOpacity>
    </View>

    {/* Modal de reserva */}
    <Modal 
      visible={bookingModalVisible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reserva tu experiencia</Text>
          
          {/* Fecha */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fecha de reserva</Text>
            {/* En una app real, usarías un date picker como @react-native-community/datetimepicker */}
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => {
                // Simulamos selección de fecha
                const today = new Date();
                setBookingDate(today);
              }}
            >
              <Text style={styles.dateText}>
                {bookingDate ? bookingDate.toLocaleDateString() : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Participantes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Participantes</Text>
            <View style={styles.participantsContainer}>
              <TouchableOpacity 
                style={styles.buttonSmall}
                onPress={() => setParticipants(Math.max(1, participants - 1))}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text style={styles.participantsCount}>{participants}</Text>
              <TouchableOpacity 
                style={styles.buttonSmall}
                onPress={() => 
                  setParticipants(Math.min(experience.maxParticipants || 10, participants + 1))
                }
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Precio total */}
          <View style={styles.priceSummary}>
            <Text style={styles.priceLabel}>Total:</Text>
            <Text style={styles.priceAmount}>${totalPrice}</Text>
          </View>
          
          {/* Peticiones especiales */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Peticiones especiales (opcional)</Text>
            <TextInput
              placeholder="Ej: Alergias, requerimientos especiales..."
              value={specialRequests}
              onChangeText={handleSpecialRequestsChange}
              style={styles.textInput}
              multiline
              minHeight={80}
            />
          </View>
          
          {/* Botones */}
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setBookingModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleBookNow}
              disabled={bookingLoading || !bookingDate}
            >
              {bookingLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar Reserva</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
  },
  category: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  duration: {
    fontSize: 16,
    color: '#666666',
  },
  location: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    fontSize: 14,
    color: '#666666',
  },
  bookButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
  },
  bookButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  dateInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  dateText: {
    color: '#666666',
    fontSize: 16,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonSmall: {
    backgroundColor: '#e9ecef',
    padding: 8,
    borderRadius: 6,
    width: 30,
    alignItems: 'center',
  },
  participantsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    width: 40,
    textAlign: 'center',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExperienceDetailScreen;