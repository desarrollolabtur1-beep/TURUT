import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ExperienceDetail: { experienceId: string };
  Profile: undefined;
  Bookings: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;
export type ExperienceDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ExperienceDetail'
>;
export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;
export type BookingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Bookings'
>;
